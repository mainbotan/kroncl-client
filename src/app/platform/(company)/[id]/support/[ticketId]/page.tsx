'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Textarea from '@/assets/ui-kit/textarea/textarea';
import styles from './page.module.scss';
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import PaperClip from '@/assets/ui-kit/icons/paper-clip';
import Send from '@/assets/ui-kit/icons/send';
import { Scrollable } from '../components/scrollable/content';
import { MessageCard } from '../components/message-card/card';
import Button from '@/assets/ui-kit/button/button';
import { useSupport } from '@/apps/company/modules';
import { Ticket, Message, TicketThemeTitle, TicketTheme, TicketStatus } from '@/apps/company/modules/support/types';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import { usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { supportEvents } from '@/apps/company/modules/support/events';
import clsx from 'clsx';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const ticketId = params.ticketId as string;
    const supportModule = useSupport();
    const { showMessage } = useMessage();

    // perms
    const ALLOW_UPDATE_STATUS = usePermission(PERMISSIONS.SUPPORT_TICKETS_UPDATE);

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    
    // Сообщение
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    
    // Модалка закрытия тикета
    const [closeModalOpen, setCloseModalOpen] = useState(false);
    const [closing, setClosing] = useState(false);
    
    const scrollableRef = useRef<HTMLDivElement>(null);
    const prevScrollHeightRef = useRef(0);

    const loadTicket = async () => {
        try {
            const response = await supportModule.getTicket(ticketId);
            if (response.status && response.data) {
                setTicket(response.data);
            } else {
                setError(response.message || 'Не удалось загрузить тикет');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        }
    };

    const loadMessages = async (pageNum: number, isLoadMore = false) => {
        try {
            const response = await supportModule.getMessages(ticketId, { page: pageNum, limit: 20 });
            if (response.status && response.data) {
                const newMessages = response.data.messages;
                // Сервер возвращает от новых к старым, реверсируем
                const reversedMessages = [...newMessages].reverse();
                
                if (isLoadMore) {
                    // При загрузке старых сообщений (скролл вверх)
                    // newMessages уже реверсированы, но они должны быть сверху
                    setMessages(prev => [...reversedMessages, ...prev]);
                } else {
                    // Первая загрузка — просто реверсируем
                    setMessages(reversedMessages);
                }
                setHasMore(newMessages.length === 20);
                setPage(pageNum);
            }
        } catch (err) {
            console.error('Error loading messages:', err);
        }
    };

    const loadInitialData = async () => {
        setLoading(true);
        setError(null);
        try {
            await Promise.all([
                loadTicket(),
                loadMessages(1, false)
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInitialData();
    }, [ticketId]);

    const handleScroll = useCallback(async (e: React.UIEvent<HTMLDivElement>) => {
        if (loadingMore || !hasMore) return;
        
        const target = e.currentTarget;
        if (target.scrollTop === 0) {
            setLoadingMore(true);
            prevScrollHeightRef.current = target.scrollHeight;
            await loadMessages(page + 1, true);
            setLoadingMore(false);
        }
    }, [loadingMore, hasMore, page]);

    useEffect(() => {
        if (scrollableRef.current && prevScrollHeightRef.current > 0) {
            const newScrollHeight = scrollableRef.current.scrollHeight;
            const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
            scrollableRef.current.scrollTop = scrollDiff;
            prevScrollHeightRef.current = 0;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        const text = newMessage.trim();
        if (!text || sending) return;
        
        if (text.length < 10 || text.length > 3000) {
            showMessage({
                label: 'Сообщение должно быть от 10 до 3000 символов',
                variant: 'error'
            });
            return;
        }
        
        setSending(true);
        try {
            const response = await supportModule.createMessage(ticketId, { text });
            if (response.status && response.data) {
                // Уведомляем Panel об обновлении
                supportEvents.emit();
                
                showMessage({
                    label: 'Сообщение отправлено',
                    variant: 'success'
                });
                setNewMessage('');
                // Обновляем список сообщений
                setMessages(prev => [...prev, response.data]);
                // Прокручиваем вниз
                setTimeout(() => {
                    if (scrollableRef.current) {
                        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
                    }
                }, 100);
            } else {
                throw new Error(response.message || 'Не удалось отправить сообщение');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Ошибка при отправке',
                variant: 'error'
            });
        } finally {
            setSending(false);
        }
    };

    const handleCloseTicket = async () => {
        if (!ticket || ticket.status !== 'pending') return;
        
        setClosing(true);
        try {
            const response = await supportModule.updateTicketStatus(ticketId, { status: 'revoked' });
            if (response.status) {
                // Уведомляем Panel об обновлении
                supportEvents.emit();
                
                showMessage({
                    label: 'Тикет закрыт',
                    variant: 'success'
                });
                // Обновляем локальный статус тикета
                setTicket(prev => prev ? { ...prev, status: 'revoked' } : null);
                setCloseModalOpen(false);
            } else {
                throw new Error(response.message || 'Не удалось закрыть тикет');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Ошибка при закрытии тикета',
                variant: 'error'
            });
        } finally {
            setClosing(false);
        }
    };

    const canCloseTicket = ticket?.status === 'pending' && ALLOW_UPDATE_STATUS.allowed && !ALLOW_UPDATE_STATUS.isLoading;

    if (loading || ALLOW_UPDATE_STATUS.isLoading) return <PlatformLoading />;
    if (error) return <PlatformError error={error} />;

    const themeTitle = TicketThemeTitle[ticket?.theme as TicketTheme] || ticket?.theme || '';

    return (
        <>
        <div className={styles.top}>
            <div className={styles.info}>
                <div className={styles.capture}>{themeTitle}</div>
            </div>
            <div className={styles.actions}>
                {canCloseTicket && (
                    <Button 
                        className={styles.action} 
                        variant='contrast'
                        onClick={() => setCloseModalOpen(true)}
                    >
                        Закрыть тикет
                    </Button>
                )}
            </div>
        </div>
        <Scrollable 
            className={styles.scrollable} 
            ref={scrollableRef}
            onScroll={handleScroll}
        >
            <div className={styles.messages}>
                {loadingMore && (
                    <div className={styles.loadingMore}>Загрузка...</div>
                )}
                {messages.map((message) => (
                    <MessageCard 
                        key={message.id} 
                        message={message}
                        className={styles.message}
                    />
                ))}
                {ticket?.status === 'pending' && messages.length > 0 && !messages[messages.length - 1].is_tech && (
                    <div className={styles.inWork}>
                        <span className={styles.text}>Уже обрабатываем ваше сообщение</span>
                    </div>
                )}
            </div>
        </Scrollable>
        <div className={styles.textable}>
            {ticket?.status === 'pending' && (
            <div className={styles.textareaWrap}>
                <Textarea 
                    className={styles.textarea} 
                    fullWidth 
                    placeholder='Ваше сообщение в поддержку (от 10 до 3000 символов)' 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <div className={styles.actions}>
                    <button 
                        className={clsx(styles.contrast, styles.shimmer)} 
                        onClick={handleSendMessage}
                        disabled={sending || !newMessage.trim()}
                    >
                        <Send />
                    </button>
                </div>
            </div>
            )}
            {ticket?.status === 'pending' ? (
                <div className={styles.subtitle}>Формальный стиль, от 10 до 3000 символов</div>
            ) : (
                <div className={styles.subtitle}>В тикет больше нельзя написать сообщение</div>
            )}
        </div>
        <span className={styles.shadow} />

        {/* Модалка закрытия тикета */}
        <PlatformModal
            isOpen={closeModalOpen}
            onClose={() => setCloseModalOpen(false)}
        >
            <PlatformModalConfirmation
                title='Закрыть тикет?'
                description='После закрытия тикета вы не сможете отправлять новые сообщения. Тикет будет перемещён в архив.'
                actions={[
                    {
                        children: 'Отмена',
                        variant: 'light',
                        onClick: () => setCloseModalOpen(false),
                        disabled: closing
                    },
                    {
                        variant: 'accent',
                        onClick: handleCloseTicket,
                        children: closing ? 'Закрытие...' : 'Закрыть',
                        disabled: closing
                    }
                ]}
            />
        </PlatformModal>
        </>
    );
}