'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { useParams } from 'next/navigation';
import Textarea from '@/assets/ui-kit/textarea/textarea';
import Send from '@/assets/ui-kit/icons/send';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import clsx from 'clsx';
import Link from 'next/link';
import Upload from '@/assets/ui-kit/icons/upload';
import Arrow from '@/assets/ui-kit/icons/arrow';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import Button, { ButtonProps } from '@/assets/ui-kit/button/button';
import { useEffect, useState, useRef } from 'react';
import { adminSupportApi } from '@/apps/admin/support/api';
import { AdminTicket } from '@/apps/admin/support/types';
import { Message as MessageType } from '@/apps/company/modules/support/types';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useAdminLevel } from '@/apps/admin/auth/hook';
import { ADMIN_LEVEL_4 } from '@/apps/admin/auth/types';
import { shortenId } from '@/assets/utils/ids';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import { useAuth } from '@/apps/account/auth/context/AuthContext';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';

export function Message({ 
    msg, 
    onEdit,
    onDelete,
    canEdit = false,
    isEditing: isEditingProp = false,
    onStartEdit
}: { 
    msg: MessageType; 
    onEdit?: (msg: MessageType, newText: string) => Promise<void>;
    onDelete?: (msg: MessageType) => Promise<void>;
    canEdit?: boolean;
    isEditing?: boolean;
    onStartEdit?: (msg: MessageType) => void;
}) {
    const [isEditing, setIsEditing] = useState(isEditingProp);
    const [editText, setEditText] = useState(msg.text);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const isAdminMessage = msg.is_tech;
    
    useEffect(() => {
        setIsEditing(isEditingProp);
        if (isEditingProp) {
            setEditText(msg.text);
        }
    }, [isEditingProp, msg.text]);
    
    const handleSaveEdit = async () => {
        const trimmedText = editText.trim();
        if (trimmedText.length < 10) {
            return;
        }
        if (trimmedText.length > 3000) {
            return;
        }
        if (trimmedText === msg.text) {
            setIsEditing(false);
            onStartEdit?.(null as any);
            return;
        }
        
        setIsUpdating(true);
        try {
            await onEdit?.(msg, trimmedText);
            setIsEditing(false);
            onStartEdit?.(null as any);
        } finally {
            setIsUpdating(false);
        }
    };
    
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditText(msg.text);
        onStartEdit?.(null as any);
    };
    
    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        await onDelete?.(msg);
        setIsDeleteModalOpen(false);
    };
    
    const handleEditClick = () => {
        setIsEditing(true);
        onStartEdit?.(msg);
    };
    
    return (
        <>
            <div className={clsx(styles.message, isAdminMessage && styles.answer)}>
                {isEditing ? (
                    <div className={styles.editContainer}>
                        <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className={styles.textarea}
                            autoFocus
                        />
                        <div className={styles.editActions}>
                            <Button variant='accent' loading={isUpdating} onClick={handleSaveEdit} className={styles.action} disabled={isUpdating}>
                                Сохранить
                            </Button>
                            <Button variant='glass' onClick={handleCancelEdit} className={styles.action}>
                                Отмена
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={styles.text}>
                            {msg.text}
                        </div>
                        <div className={styles.meta}>
                            {new Date(msg.created_at).toLocaleString()} | &nbsp;
                            <Link href={`/tech/accounts/${msg.account.id}`} className={styles.accent}>
                                {msg.account.name || msg.account.email}
                            </Link>
                            {isAdminMessage && <span className={styles.badge}>&nbsp;поддержка</span>}
                        </div>
                        {canEdit && isAdminMessage && (
                            <div className={styles.actions}>
                                <span className={styles.action} onClick={handleEditClick}>Редактировать</span>
                                <span className={styles.action} onClick={handleDeleteClick}>Удалить</span>
                            </div>
                        )}
                    </>
                )}
            </div>
            
            <PlatformModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <PlatformModalConfirmation
                    title='Удалить сообщение'
                    description='Сообщение будет безвозвратно удалено. Вы уверены?'
                    actions={[
                        { children: 'Отмена', variant: 'light', onClick: () => setIsDeleteModalOpen(false) },
                        { variant: 'red', onClick: handleConfirmDelete, children: 'Удалить' }
                    ]}
                />
            </PlatformModal>
        </>
    );
}

export default function Page() {
    const params = useParams();
    const ticketId = params.ticketId as string;
    const { showMessage } = useMessage();
    const { level: adminLevel, allowed: isAdmin } = useAdminLevel(ADMIN_LEVEL_4);
    
    const { user } = useAuth();
    const [ticket, setTicket] = useState<AdminTicket | null>(null);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [unassigning, setUnassigning] = useState(false);
    const [closing, setClosing] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    
    const dialogRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const isAssignedToMe = ticket?.assigned_admin_id === user?.id;
    const isPending = ticket?.status === 'pending';
    const canSend = isAssignedToMe && isPending;
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    useEffect(() => {
        loadTicket();
        loadMessages();
    }, [ticketId]);
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const loadTicket = async () => {
        try {
            const response = await adminSupportApi.getTicketById(ticketId);
            if (response.status && response.data) {
                setTicket(response.data);
            }
        } catch (error) {
            console.error('Error loading ticket:', error);
        }
    };
    
    const loadMessages = async () => {
        setLoadingMessages(true);
        try {
            const response = await adminSupportApi.getTicketMessages(ticketId);
            if (response.status && response.data) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoadingMessages(false);
            setLoading(false);
        }
    };
    
    const handleAssign = async () => {
        setAssigning(true);
        try {
            const response = await adminSupportApi.assignTicket(ticketId);
            if (response.status) {
                showMessage({ label: 'Тикет принят в обработку', variant: 'success' });
                setIsAssignModalOpen(false);
                await loadTicket();
                await loadMessages();
            } else {
                showMessage({ label: response.message || 'Ошибка при назначении', variant: 'error' });
            }
        } catch (error: any) {
            showMessage({ label: error.message || 'Ошибка при назначении', variant: 'error' });
        } finally {
            setAssigning(false);
        }
    };
    
    const handleUnassign = async () => {
        setUnassigning(true);
        try {
            const response = await adminSupportApi.unassignTicket(ticketId);
            if (response.status) {
                showMessage({ label: 'Тикет сброшен', variant: 'success' });
                setIsUnassignModalOpen(false);
                await loadTicket();
                await loadMessages();
            } else {
                showMessage({ label: response.message || 'Ошибка при сбросе', variant: 'error' });
            }
        } catch (error: any) {
            showMessage({ label: error.message || 'Ошибка при сбросе', variant: 'error' });
        } finally {
            setUnassigning(false);
        }
    };
    
    const handleClose = async () => {
        setClosing(true);
        try {
            const response = await adminSupportApi.closeTicket(ticketId);
            if (response.status) {
                showMessage({ label: 'Тикет закрыт', variant: 'success' });
                setIsCloseModalOpen(false);
                await loadTicket();
            } else {
                showMessage({ label: response.message || 'Ошибка при закрытии', variant: 'error' });
            }
        } catch (error: any) {
            showMessage({ label: error.message || 'Ошибка при закрытии', variant: 'error' });
        } finally {
            setClosing(false);
        }
    };
    
    const handleSendMessage = async () => {
        const trimmedText = newMessage.trim();
        if (trimmedText.length < 10) {
            showMessage({ label: 'Сообщение должно содержать не менее 10 символов', variant: 'error' });
            return;
        }
        if (trimmedText.length > 3000) {
            showMessage({ label: 'Сообщение не должно превышать 3000 символов', variant: 'error' });
            return;
        }
        if (!canSend) {
            showMessage({ label: 'Вы не можете отправлять сообщения в этот тикет', variant: 'error' });
            return;
        }
        
        setSending(true);
        try {
            const response = await adminSupportApi.createAdminMessage(ticketId, { text: trimmedText });
            if (response.status && response.data) {
                showMessage({ label: 'Сообщение отправлено', variant: 'success' });
                setNewMessage('');
                await loadMessages();
                await loadTicket();
            } else {
                showMessage({ label: response.message || 'Ошибка при отправке', variant: 'error' });
            }
        } catch (error: any) {
            showMessage({ label: error.message || 'Ошибка при отправке', variant: 'error' });
        } finally {
            setSending(false);
        }
    };
    
    const handleEditMessage = async (msg: MessageType, newText: string) => {
        const response = await adminSupportApi.updateAdminMessage(ticketId, msg.id, { text: newText });
        if (response.status && response.data) {
            showMessage({ label: 'Сообщение обновлено', variant: 'success' });
            await loadMessages();
        } else {
            showMessage({ label: response.message || 'Ошибка при обновлении', variant: 'error' });
        }
        setEditingMessageId(null);
    };
    
    const handleDeleteMessage = async (msg: MessageType) => {
        const response = await adminSupportApi.deleteAdminMessage(ticketId, msg.id);
        if (response.status) {
            showMessage({ label: 'Сообщение удалено', variant: 'success' });
            await loadMessages();
        } else {
            showMessage({ label: response.message || 'Ошибка при удалении', variant: 'error' });
        }
    };
    
    const handleRefresh = async () => {
        await Promise.all([loadTicket(), loadMessages()]);
        showMessage({ label: 'Диалог обновлён', variant: 'success' });
    };
    
    if (loading) return <PlatformLoading />;
    
    const actions: ButtonProps[] = [];
    actions.push({
        children: 'Смотреть организацию',
        variant: 'glass',
        as: 'link',
        href: `/tech/companies/${ticket?.company.id}`
    })
    
    if (isPending) {
        if (isAssignedToMe) {
            actions.push({
                children: 'Отказаться',
                variant: 'glass',
                onClick: () => setIsUnassignModalOpen(true)
            });
            actions.push({
                children: 'Закрыть тикет',
                variant: 'light',
                onClick: () => setIsCloseModalOpen(true)
            });
        } else if (!ticket?.assigned_admin_id) {
            actions.push({
                children: 'Принять тикет',
                variant: 'accent',
                onClick: () => setIsAssignModalOpen(true)
            });
        }
    }

    return (
        <>
        <div className={styles.container}>
            <PlatformHead 
                title={`Тикет #${shortenId(ticketId)}`}
                description={`Создан ${ticket?.created_at ? new Date(ticket.created_at).toLocaleDateString() : ''} - ${ticket?.status === 'pending' ? 'В обработке' : ticket?.status === 'closed' ? 'Закрыт' : 'Отклонён'}. От организации #${shortenId(ticket?.company.id)}.`}
                actions={actions}
            />
            <div className={styles.dialog} ref={dialogRef}>
                <div className={styles.grid}>
                    {loadingMessages ? (
                        <div className={styles.loadingMessages}>
                            <Spinner />
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <Message 
                                key={msg.id} 
                                msg={msg}
                                onEdit={handleEditMessage}
                                onDelete={handleDeleteMessage}
                                canEdit={isAssignedToMe}
                                isEditing={editingMessageId === msg.id}
                                onStartEdit={(msg) => setEditingMessageId(msg?.id || null)}
                            />
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className={styles.dialogActions}>
                <ModalTooltip content='Обновить диалог'>
                    <button 
                        onClick={handleRefresh}
                        children={<Upload />}
                        className={clsx(styles.action)} />
                </ModalTooltip>
                <ModalTooltip content='Промотать вниз'>
                    <button 
                        onClick={scrollToBottom}
                        children={<Arrow />}
                        className={clsx(styles.action, styles.rotated)} />
                </ModalTooltip>
            </div>
            
            {!isAssignedToMe && ticket?.assigned_admin_id && isPending && (
                <div className={styles.textablePlug}>
                    <div className={styles.info}>
                        <div className={styles.capture}>Тикет обрабатывается другим админом</div>
                        <div className={styles.description}>
                            Отправка сообщений в диалог доступна только ответственному за тикет админу. 
                            Если он сбросит тикет - вы сможете его перенять.
                        </div>
                    </div>
                </div>
            )}
            
            {!ticket?.assigned_admin_id && isPending && !isAssignedToMe && (
                <div className={styles.textablePlug}>
                    <div className={styles.info}>
                        <div className={styles.capture}>Принять тикет</div>
                        <div className={styles.description}>
                            Для отправки сообщений в диалог примите тикет в обработку
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <Button
                            className={styles.action}
                            variant='accent'
                            onClick={() => setIsAssignModalOpen(true)}
                            children='Принять тикет'
                        />
                    </div>
                </div>
            )}
            
            {canSend && (
                <div className={styles.textable}>
                    <Textarea
                        fullWidth
                        placeholder='Ответ клиенту'
                        className={styles.textarea}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <ModalTooltip content='Отправить ответ на тикет'>
                        <button
                            className={styles.send}
                            onClick={handleSendMessage}
                            disabled={sending || !newMessage.trim()}
                        >
                            {sending ? <Spinner size="sm" /> : <Send className={styles.svg} />}
                        </button>
                    </ModalTooltip>
                </div>
            )}
        </div>

        <PlatformModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)}>
            <PlatformModalConfirmation
                title='Принять тикет в работу'
                description='После принятия тикета вы станете ответственным за его обработку. Вы сможете отправлять сообщения клиенту.'
                actions={[
                    { children: 'Отмена', variant: 'light', onClick: () => setIsAssignModalOpen(false) },
                    { variant: 'accent', onClick: handleAssign, children: assigning ? 'Принятие...' : 'Принять', disabled: assigning }
                ]}
            />
        </PlatformModal>

        <PlatformModal isOpen={isUnassignModalOpen} onClose={() => setIsUnassignModalOpen(false)}>
            <PlatformModalConfirmation
                title='Отказаться от тикета'
                description='Вы перестанете быть ответственным за этот тикет. Другой администратор сможет его принять.'
                actions={[
                    { children: 'Отмена', variant: 'light', onClick: () => setIsUnassignModalOpen(false) },
                    { variant: 'red', onClick: handleUnassign, children: unassigning ? 'Отказ...' : 'Отказаться', disabled: unassigning }
                ]}
            />
        </PlatformModal>

        <PlatformModal isOpen={isCloseModalOpen} onClose={() => setIsCloseModalOpen(false)}>
            <PlatformModalConfirmation
                title='Закрыть тикет'
                description='Тикет будет закрыт. После закрытия отправка сообщений будет невозможна.'
                actions={[
                    { children: 'Отмена', variant: 'light', onClick: () => setIsCloseModalOpen(false) },
                    { variant: 'red', onClick: handleClose, children: closing ? 'Закрытие...' : 'Закрыть', disabled: closing }
                ]}
            />
        </PlatformModal>
        </>
    );
}