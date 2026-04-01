'use client';

import { PricingTransaction } from '@/apps/company/modules/pricing/types';
import styles from './block.module.scss';
import clsx from 'clsx';
import Button from '@/assets/ui-kit/button/button';
import { pluralizeDays } from '@/assets/utils/date';
import { useState } from 'react';
import { usePricing } from '@/apps/company/modules';
import { useParams } from 'next/navigation';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';

export interface PaymentBlockProps {
    className?: string;
    transaction: PricingTransaction;
    onSuccess?: () => void;
    onError?: (error: string) => void;
    onRevoke?: () => void;
}

export function PaymentBlock({
    className,
    transaction,
    onSuccess,
    onError,
    onRevoke
}: PaymentBlockProps) {
    const params = useParams();
    const companyId = params.id as string;
    const pricingModule = usePricing();
    const { showMessage } = useMessage();
    
    const [loading, setLoading] = useState(false);
    const [revokeLoading, setRevokeLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Получаем сумму
    const amount = transaction.amount?.toLocaleString('ru-RU') || '0';
    
    // Получаем название тарифа из plan_code
    const planName = transaction.plan_code === 'stoic' ? 'Стоик' 
        : transaction.plan_code === 'titan' ? 'Титан' 
        : transaction.plan_code === 'financier' ? 'Финансист' 
        : transaction.plan_code || 'тариф';
    
    // Вычисляем дату окончания
    const expiresDate = new Date(transaction.expires_at).toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Определяем текст операции
    let operationText = '';
    if (transaction.is_trial) {
        operationText = `Пробный период «${planName}»`;
    } else {
        operationText = `Оплата тарифа «${planName}»`;
    }
    
    // Вычисляем количество дней
    const daysLeft = Math.ceil((new Date(transaction.expires_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    const periodText = daysLeft > 0 ? `на ${daysLeft} ${pluralizeDays(daysLeft)}` : '';

    const handlePayment = () => {
        console.log('Pay for transaction:', transaction.id);
        onSuccess?.();
    };

    const handleRevoke = async () => {
        setRevokeLoading(true);
        try {
            const response = await pricingModule.revokeTransaction(transaction.id);
            if (response.status) {
                showMessage({
                    label: 'Транзакция успешно отменена',
                    variant: 'success'
                });
                setShowConfirmModal(false);
                onRevoke?.();
            } else {
                showMessage({
                    label: response.message || 'Не удалось отменить транзакцию',
                    variant: 'error'
                });
                onError?.(response.message || 'Не удалось отменить транзакцию');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка при отмене';
            showMessage({
                label: errorMessage,
                variant: 'error'
            });
            onError?.(errorMessage);
        } finally {
            setRevokeLoading(false);
        }
    };

    // Определяем контент в зависимости от статуса
    const getStatusContent = () => {
        switch (transaction.status) {
            case 'pending':
                return {
                    title: 'Ожидается оплата',
                    icon: null,
                    actions: (
                        <div className={styles.actions}>
                            <Button 
                                className={styles.action} 
                                children='Оплатить'
                                variant='contrast'
                                onClick={handlePayment}
                                disabled={loading}
                            />
                            <span className={styles.or}>или</span>
                            <Button 
                                className={styles.action}
                                variant='empty'
                                onClick={() => setShowConfirmModal(true)}
                                disabled={revokeLoading}
                                loading={revokeLoading}
                                children='Отменить'
                            />
                        </div>
                    )
                };
            
            case 'success':
                return {
                    title: 'Оплата подтверждена',
                    icon: <SuccessStatus className={styles.icon} />,
                    actions: null
                };
            
            case 'unsuccess':
                return {
                    title: 'Оплата не удалась',
                    icon: <ErrorStatus className={styles.icon} />,
                    actions: (
                        <div className={styles.actions}>
                            <Button 
                                className={styles.action} 
                                children='Попробовать снова'
                                variant='contrast'
                                onClick={handlePayment}
                                disabled={loading}
                            />
                        </div>
                    )
                };
            
            case 'revoked':
                return {
                    title: 'Транзакция отменена',
                    icon: <ErrorStatus className={styles.icon} />,
                    actions: (
                        <div className={styles.actions}>
                            <Button 
                                className={styles.action} 
                                children='Повторить оплату'
                                variant='contrast'
                                onClick={handlePayment}
                                disabled={loading}
                            />
                        </div>
                    )
                };
            
            default:
                return {
                    title: 'Статус неизвестен',
                    icon: null,
                    actions: null
                };
        }
    };

    const { title, icon, actions } = getStatusContent();
    
    return (
        <>
            <div className={clsx(styles.block, className, styles[transaction.status])}>
                <div className={styles.info}>
                    <div className={styles.titleWrapper}>
                        {icon && <span className={styles.iconWrapper}>{icon}</span>}
                        <div className={styles.title}>{title}</div>
                    </div>
                    <div className={styles.meta}>
                        {amount} ₽, {operationText} {periodText} (до {expiresDate})
                    </div>
                </div>
                {actions}
            </div>

            <PlatformModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
            >
                <PlatformModalConfirmation
                    title='Отменить оплату?'
                    description={`Вы уверены, что хотите отменить платеж на ${amount} ₽ для тарифа «${planName}»?`}
                    actions={[
                        {
                            children: 'Нет, оставить',
                            variant: 'light',
                            onClick: () => setShowConfirmModal(false),
                            disabled: revokeLoading
                        },
                        {
                            variant: 'accent',
                            onClick: handleRevoke,
                            children: revokeLoading ? 'Отмена...' : 'Да, отменить',
                            disabled: revokeLoading
                        }
                    ]}
                />
            </PlatformModal>
        </>
    );
}