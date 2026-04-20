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
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormTextarea, PlatformFormVariants } from '@/app/platform/components/lib/form';
import Button from '@/assets/ui-kit/button/button';
import clsx from 'clsx';

type TransactionDirection = 'income' | 'expense';

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
    const ALLOW_CREATE = usePermission(PERMISSIONS.DM_DEALS_TRANSACTIONS_CREATE);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
    const [summary, setSummary] = useState<DealTransactionsSummary | null>(null);
    const [pagination, setPagination] = useState<any>(null);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        direction: 'expense' as TransactionDirection,
        comment: ''
    });

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

    const handleAmountChange = (value: string) => {
        const cleaned = value.replace(/[^\d.]/g, '');
        const parts = cleaned.split('.');
        if (parts.length > 2) return;
        if (parts[1] && parts[1].length > 2) return;
        
        const num = parseFloat(cleaned);
        if (!isNaN(num) && num < 0) return;
        
        setFormData(prev => ({ ...prev, amount: cleaned }));
    };

    const handleCreateTransaction = async () => {
        const amount = parseFloat(formData.amount);
        if (isNaN(amount) || amount <= 0) {
            showMessage({ label: 'Введите корректную сумму', variant: 'error' });
            return;
        }

        setIsCreating(true);
        try {
            const response = await dmModule.createDealTransaction(dealId, {
                base_amount: amount,
                currency: 'RUB',
                direction: formData.direction,
                comment: formData.comment.trim() || undefined
            });

            if (response.status) {
                showMessage({
                    label: 'Операция создана',
                    variant: 'success'
                });
                setIsCreateModalOpen(false);
                setFormData({ amount: '', direction: 'expense', comment: '' });
                loadData();
            } else {
                throw new Error(response.message || 'Ошибка создания операции');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось создать операцию',
                variant: 'error'
            });
        } finally {
            setIsCreating(false);
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
            <DealBlock className={clsx(styles.page, className)} title='Финансы сделки' description='История трат/доходов в процессе заключения сделки.'>
                <div className={styles.grid}>
                    {isAllowed(ALLOW_CREATE) && (
                        <Button 
                            children='Новая операция'
                            variant='accent'
                            className={styles.createTransactionAction}
                            onClick={() => setIsCreateModalOpen(true)}
                        />
                    )}
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
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                className={styles.createTransactionModal}
            >
                <div className={styles.createTransactionContainer}>
                    <div className={styles.head}>
                        <div className={styles.title}>Новая операция</div>
                        <div className={styles.description}>Создание траты/дохода для сделки</div>
                    </div>
                    <div className={styles.formWrap}>
                        <PlatformFormBody className={styles.form}>
                            <PlatformFormSection title='Сумма операции'>
                                <PlatformFormInput
                                    value={formData.amount}
                                    onChange={handleAmountChange}
                                    placeholder='0.00'
                                    disabled={isCreating}
                                />
                            </PlatformFormSection>
                            <PlatformFormSection title='Тип'>
                                <PlatformFormVariants
                                    value={formData.direction}
                                    onChange={(v) => setFormData(prev => ({ ...prev, direction: v as TransactionDirection }))}
                                    disabled={isCreating}
                                    options={[
                                        {
                                            label: 'Доход',
                                            value: 'income',
                                            description: 'Приход в процессе реализации сделки.'
                                        },
                                        {
                                            label: 'Расход',
                                            value: 'expense',
                                            description: 'Дополнительные траты в процессе реализации сделки.'
                                        }
                                    ]}
                                />
                            </PlatformFormSection>
                            <PlatformFormSection title='Комментарий'>
                                <PlatformFormTextarea
                                    value={formData.comment}
                                    onChange={(v) => setFormData(prev => ({ ...prev, comment: v }))}
                                    disabled={isCreating}
                                    placeholder='Дополнительная информация...'
                                />
                            </PlatformFormSection>
                        </PlatformFormBody>
                    </div>
                    <div className={styles.actions}>
                        <Button 
                            children='Отменить'
                            variant='light'
                            className={styles.action}
                            onClick={() => setIsCreateModalOpen(false)}
                            disabled={isCreating}
                        />
                        <Button 
                            children={isCreating ? 'Создание...' : 'Создать'}
                            variant='accent'
                            className={styles.action}
                            onClick={handleCreateTransaction}
                            disabled={isCreating || !formData.amount}
                        />
                    </div>
                </div>
            </PlatformModal>

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