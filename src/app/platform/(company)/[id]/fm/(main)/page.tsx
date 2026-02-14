'use client';

import Button from '@/assets/ui-kit/button/button';
import styles from './page.module.scss';
import { IndicatorWidget } from './components/indicator-widget/widget';
import { TransactionCard } from './components/transaction-card/card';
import { Timeline } from './components/timeline/timeline';
import { useState, useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';
import Wallet from '@/assets/ui-kit/icons/wallet';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useFm } from '@/apps/company/modules';
import { TransactionsResponse, AnalysisSummary } from '@/apps/company/modules/fm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { motion } from 'framer-motion';
import { transactionVariants } from './_animations';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import { formatDate } from '@/assets/utils/date';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const fmModule = useFm();
    const pathname = usePathname();
    const { showMessage } = useMessage();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const [timelinePosition, setTimelinePosition] = useState<number | null>(null);
    const [itemHeight, setItemHeight] = useState(60);
    const transactionRef = useRef<HTMLDivElement>(null);
    
    const [data, setData] = useState<TransactionsResponse | null>(null);
    const [summary, setSummary] = useState<AnalysisSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
        loadSummary();
    }, [searchParams]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');
            const start_date = searchParams.get('start_date') || undefined;
            const end_date = searchParams.get('end_date') || undefined;
            const direction = searchParams.get('direction') as 'income' | 'expense' | undefined;
            const status = searchParams.get('status') as 'pending' | 'completed' | 'failed' | 'cancelled' | undefined;
            const category_id = searchParams.get('category_id') || undefined;
            const employee_id = searchParams.get('employee_id') || undefined;
            const search = searchParams.get('search') || undefined;

            const response = await fmModule.getTransactions({
                page,
                limit,
                start_date,
                end_date,
                direction,
                status,
                category_id,
                employee_id,
                search
            });
            
            if (response.status) {
                setData(response.data);
            } else {
                setError("Не удалось загрузить транзакции");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadSummary = async () => {
        setSummaryLoading(true);
        try {
            const start_date = searchParams.get('start_date') || undefined;
            const end_date = searchParams.get('end_date') || undefined;

            const response = await fmModule.getAnalysisSummary({
                start_date,
                end_date
            });
            
            if (response.status) {
                setSummary(response.data);
            }
        } catch (err) {
            console.error('Error loading summary:', err);
        } finally {
            setSummaryLoading(false);
        }
    };

    // Получаем реальную высоту транзакции
    useEffect(() => {
        const updateItemHeight = () => {
            if (transactionRef.current) {
                const rect = transactionRef.current.getBoundingClientRect();
                setItemHeight(rect.height);
            }
        };

        updateItemHeight();
        window.addEventListener('resize', updateItemHeight);
        
        return () => window.removeEventListener('resize', updateItemHeight);
    }, [data]);

    const transactions = data?.transactions || [];
    const pagination = data?.pagination;

    // Определяем индекс разделения на основе позиции таймлайна
    const splitIndex = useMemo(() => {
        if (timelinePosition === null) return -1;
        
        const total = transactions.length;
        const index = Math.floor((timelinePosition / 100) * (total + 1));
        return Math.max(-1, Math.min(total, index));
    }, [timelinePosition, transactions]);

    const handleTimelinePositionChange = (position: number) => {
        setTimelinePosition(position);
    };

    
    // Состояние для глобальной модалки реверса
    const [reverseModal, setReverseModal] = useState<{
        isOpen: boolean;
        transactionId: string | null;
    }>({ isOpen: false, transactionId: null });
    
    const [isReversing, setIsReversing] = useState(false);

    const handleCreateReverse = async () => {
        if (!reverseModal.transactionId) return;
        
        setIsReversing(true);
        try {
            const response = await fmModule.createReverseTransaction(reverseModal.transactionId);
            
            if (response.status) {
                showMessage({
                    label: 'Реверс-операция успешно создана',
                    variant: 'success'
                });
                setReverseModal({ isOpen: false, transactionId: null });
                // Обновить список транзакций и сводку
                loadData();
                loadSummary();
            } else {
                throw new Error(response.message || 'Ошибка создания реверс-операции');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось создать реверс-операцию',
                variant: 'error',
                about: error.message
            });
            setReverseModal({ isOpen: false, transactionId: null });
        } finally {
            setIsReversing(false);
        }
    };

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    const directionParam = searchParams.get('direction');
    if (directionParam) queryParams.direction = directionParam;
    const statusParam = searchParams.get('status');
    if (statusParam) queryParams.status = statusParam;
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;

    if (loading || (summaryLoading && !summary)) return (
        <div style={{
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: ".7em", 
            color: "var(--color-text-description)", 
            minHeight: "10rem"
        }}>
            <Spinner />
        </div>
    );
    
    if (error) return (
        <div style={{
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: ".7em", 
            color: "var(--color-text-description)", 
            minHeight: "10rem"
        }}>
            {error}
        </div>
    );

    return (
        <>
            <div className={styles.head}>
                <div className={styles.base}>
                    <div className={styles.metaLine}>
                        <div className={styles.grid}>
                            <span className={styles.date}>
                                {formatDate(new Date().toISOString())}
                            </span>
                        </div>
                    </div>
                    <div className={styles.indicators}>
                        <IndicatorWidget 
                            value={summary ? {
                                amount: summary.net_balance,
                                unit: '₽',
                            } : undefined}
                            loading={summaryLoading}
                            legend='Ресурсы предприятия'
                            about='Казна организации - общий объём финансов, доступных для операций.'
                        />
                        
                        <IndicatorWidget 
                            value={summary ? {
                                amount: summary.transaction_count
                            } : undefined}
                            loading={summaryLoading}
                            legend='Операций'
                            size='sm'
                            variant='secondary'
                        />

                        <IndicatorWidget 
                            value={summary ? {
                                amount: summary.avg_transaction,
                                unit: '₽',
                            } : undefined}
                            loading={summaryLoading}
                            legend='Средний чек'
                            size='sm'
                            variant='secondary'
                        />
                    </div>
                </div>
                <div className={styles.actions}>
                    <Button 
                        className={styles.action} 
                        variant='light'
                        children='Расход'
                        as='link'
                        href={`/platform/${companyId}/fm/new-operation?direction=expense`}
                    />
                    <Button 
                        icon={<Wallet />} 
                        className={styles.action} 
                        variant='accent'
                        children='Доход'
                        as='link'
                        href={`/platform/${companyId}/fm/new-operation?direction=income`}
                    />
                </div>
            </div>
            
            <div className={styles.cards}>
                <Link href={`/platform/${companyId}/fm/categories`} className={clsx(styles.card, styles.accent)}>
                    <div className={styles.name}>Категории</div>
                    <div className={styles.description}>Категории расходов/доходов</div>
                </Link>
                <Link href={`/platform/${companyId}/fm/e2e`} className={styles.card}>
                    <div className={styles.name}>Сквозная аналитика</div>
                    <div className={styles.description}>E2E анализ доходности</div>
                </Link>
                <Link href={`/platform/${companyId}/fm/debts`} className={styles.card}>
                    <div className={styles.name}>Долги</div>
                    <div className={styles.description}>Управление долговыми обязательствами</div>
                </Link>
            </div>

            <div className={styles.body} style={{ position: 'relative' }}>
                <Timeline 
                    onPositionChange={handleTimelinePositionChange}
                    itemHeight={itemHeight}
                />
                
                {transactions.length === 0 ? (
                    <div style={{
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        fontSize: ".7em", 
                        color: "var(--color-text-description)", 
                        minHeight: "10rem",
                        width: "100%"
                    }}>
                        Нет операций
                    </div>
                ) : (
                    <>
                        {transactions.map((transaction, index) => (
                            <motion.div 
                                key={transaction.id} 
                                ref={index === 0 ? transactionRef : null}
                                style={{
                                    position: 'relative',
                                    zIndex: splitIndex === index ? 5 : 1
                                }}
                                variants={transactionVariants}
                                initial="hidden"
                                animate="visible"
                                custom={index}
                            >
                                <TransactionCard 
                                    transaction={transaction}
                                    className={clsx(styles.transaction, {
                                        [styles.beforeSplit]: splitIndex !== -1 && index < splitIndex,
                                        [styles.afterSplit]: splitIndex !== -1 && index >= splitIndex
                                    })}
                                    onReverse={() => setReverseModal({ 
                                        isOpen: true, 
                                        transactionId: transaction.id 
                                    })}
                                />
                            </motion.div>
                        ))}
                    </>
                )}
            </div>
            {pagination && pagination.pages > 1 && (
                <div className={styles.pagination}>
                    <PlatformPagination
                        meta={pagination}
                        baseUrl={pathname}
                        queryParams={queryParams}
                        onPageChange={(page) => handlePageChange(page)}
                    />
                </div>
            )}

            
            {/* Глобальная модалка реверса — одна на всю страницу */}
            <PlatformModal
                isOpen={reverseModal.isOpen}
                onClose={() => setReverseModal({ isOpen: false, transactionId: null })}
                className={styles.modal}
            >
                <PlatformModalConfirmation
                    title='Создать реверс-операцию?'
                    description='Удалять уже существующие операции нельзя, поэтому единственный способ отменить операцию - создать обратную.'
                    actions={[
                        {
                            children: 'Отмена', 
                            variant: 'light', 
                            onClick: () => setReverseModal({ isOpen: false, transactionId: null }),
                            disabled: isReversing
                        },
                        {
                            variant: "accent", 
                            onClick: handleCreateReverse,
                            children: isReversing ? 'Создание...' : 'Создать',
                            disabled: isReversing
                        }
                    ]}
                />
            </PlatformModal>
        </>
    );
}