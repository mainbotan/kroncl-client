'use client';

import { isAllowed, usePermission } from '@/apps/permissions/hooks';
import { DealBlock } from '../block/block';
import styles from './block.module.scss';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { TransactionDetail } from '@/apps/company/modules/fm/types';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import { TransactionCard } from '@/app/platform/(company)/[id]/fm/(main)/components/transaction-card/card';
import { useDm, useFm } from '@/apps/company/modules';
import { useEffect, useState } from 'react';
import { DealTransactionsSummary } from '@/apps/company/modules/dm/types';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { usePathname, useSearchParams } from 'next/navigation';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import { useMessage } from '@/app/platform/components/lib/message/provider';

export interface FinanceBlockProps {
    className?: string;
    dealId: string;
}

export function FinanceBlock({ className, dealId }: FinanceBlockProps) {
    const dmModule = useDm();
    const fmModule = useFm();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { showMessage } = useMessage();
    const { handlePageChange } = usePagination({ baseUrl: pathname, defaultLimit: 80 });

    const ALLOW_PAGE = usePermission(PERMISSIONS.DM_DEALS_TRANSACTIONS);
    const ALLOW_SUMMARY = usePermission(PERMISSIONS.DM_DEALS_TRANSACTIONS_SUMMARY);
    const ALLOW_REVERSE = usePermission(PERMISSIONS.FM_TRANSACTIONS_REVERSE);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
    const [summary, setSummary] = useState<DealTransactionsSummary | null>(null);
    const [pagination, setPagination] = useState<any>(null);

    const [reverseModal, setReverseModal] = useState<{
        isOpen: boolean;
        transactionId: string | null;
    }>({ isOpen: false, transactionId: null });
    const [isReversing, setIsReversing] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '80');

            const [txRes, summaryRes] = await Promise.all([
                dmModule.getDealTransactions(dealId, { page, limit }),
                isAllowed(ALLOW_SUMMARY) ? dmModule.getDealTransactionsSummary(dealId) : Promise.resolve(null)
            ]);

            if (txRes.status) {
                setTransactions(txRes.data.transactions);
                setPagination(txRes.data.pagination);
            } else {
                setError(txRes.message || 'Ошибка загрузки транзакций');
            }

            if (summaryRes && summaryRes.status) {
                setSummary(summaryRes.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [dealId, searchParams]);

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
                loadData();
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

    const formatCurrency = (value: number): string => {
        return value.toLocaleString('ru-RU');
    };

    if (loading || ALLOW_PAGE.isLoading) {
        return <PlatformLoading />;
    }

    if (error) {
        return <PlatformError error={error} />;
    }

    if (!isAllowed(ALLOW_PAGE)) {
        return <PlatformNotAllowed permission={PERMISSIONS.DM_DEALS_TRANSACTIONS} />;
    }

    return (
        <>
            <DealBlock className={className} title='Финансы сделки' description='История трат/доходов в процессе заключения сделки.'>
                <div className={styles.grid}>
                    {isAllowed(ALLOW_SUMMARY) && summary && (
                        <div className={styles.final}>
                            <section className={styles.section}>
                                <div className={styles.value}>{formatCurrency(summary.total_amount)} &#8381;</div>
                                <div className={styles.name}>Итог</div>
                            </section>
                            <section className={styles.section}>
                                <div className={styles.value}>{formatCurrency(summary.income_amount)} &#8381;</div>
                                <div className={styles.name}>Доходы</div>
                            </section>
                            <section className={styles.section}>
                                <div className={styles.value}>{formatCurrency(summary.expense_amount)} &#8381;</div>
                                <div className={styles.name}>Расходы</div>
                            </section>
                            <section className={styles.section}>
                                <div className={styles.value}>{summary.total_count}</div>
                                <div className={styles.name}>Операций</div>
                            </section>
                        </div>
                    )}

                    {transactions === null ? (
                        <PlatformEmptyCanvas title='Для сделки не найдено операций.' />
                    ) : (
                        <>
                            <div className={styles.transactions}>
                                {transactions.map(tx => (
                                    <TransactionCard
                                        key={tx.id}
                                        transaction={tx}
                                        showReverse={isAllowed(ALLOW_REVERSE)}
                                        onReverse={() => setReverseModal({
                                            isOpen: true,
                                            transactionId: tx.id
                                        })}
                                    />
                                ))}
                            </div>
                            {pagination && pagination.pages > 1 && (
                                <div className={styles.pagination}>
                                    <PlatformPagination
                                        meta={pagination}
                                        baseUrl={pathname}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </DealBlock>

            <PlatformModal
                isOpen={reverseModal.isOpen}
                onClose={() => setReverseModal({ isOpen: false, transactionId: null })}
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