import { CompanyPricingPlan, PricingTransaction } from '@/apps/company/modules/pricing/types';
import styles from './block.module.scss';
import { PricingPlan } from '@/apps/pricing/types';
import clsx from 'clsx';
import Button from '@/assets/ui-kit/button/button';
import { useState } from 'react';
import { pluralizeDays } from '@/assets/utils/date';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import { usePricing } from '@/apps/company/modules';
import { useParams } from 'next/navigation';
import Spinner from '@/assets/ui-kit/spinner/spinner';

export interface PayBlockProps {
    className?: string;
    companyPlan: CompanyPricingPlan;
    goalPlan: PricingPlan;
    onSuccess?: (transaction: PricingTransaction) => void;
    onError?: (error: string) => void;
}

export function PayBlock({
    className,
    companyPlan,
    goalPlan,
    onSuccess,
    onError
}: PayBlockProps) {
    const params = useParams();
    const companyId = params.id as string;
    const pricingModule = usePricing();
    
    const [period, setPeriod] = useState<'month' | 'year'>('month');
    const [loading, setLoading] = useState(false);

    const isCurrentPlan = companyPlan.current_plan.code === goalPlan.code;
    const daysLeft = companyPlan.days_left;
    const currentPlanLvl = companyPlan.current_plan.lvl;
    const goalPlanLvl = goalPlan.lvl;

    // Определяем, почему показывается PayBlock
    const isExpired = daysLeft === 0;
    const isUpgrade = !isExpired && !isCurrentPlan;
    
    // Переход на тариф с меньшим lvl (с даунгрейдом) И есть остаток дней
    const isDowngradeWithRemaining = !isExpired && !isCurrentPlan && goalPlanLvl > currentPlanLvl;

    // Вычисляем цену
    const price = period === 'month' ? goalPlan.price_per_month : goalPlan.price_per_year;
    
    // Вычисляем дату окончания
    const months = period === 'month' ? 1 : 12;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);
    const expiresDate = expiresAt.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

    // Текст в мета
    const daysCount = months === 1 ? 30 : 365;
    const daysWord = pluralizeDays(daysCount);

    let metaText = '';
    if (isExpired) {
        metaText = `Тариф «${goalPlan.name}» на ${daysCount} ${daysWord} (до ${expiresDate})`;
    } else if (isUpgrade) {
        metaText = `Переход с тарифа «${companyPlan.current_plan.name}» на «${goalPlan.name}» (до ${expiresDate})`;
    } else {
        metaText = `Продление тарифа «${goalPlan.name}» на ${daysCount} ${daysWord} (до ${expiresDate})`;
    }

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await pricingModule.migrate({
                plan_code: goalPlan.code,
                period: period
            });
            
            if (response.status && response.data) {
                onSuccess?.(response.data);
            } else {
                onError?.(response.message || 'Ошибка при оплате');
            }
        } catch (error) {
            onError?.(error instanceof Error ? error.message : 'Ошибка при оплате');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={clsx(styles.block, className)}>
            <div className={styles.base}>
                <div className={styles.info}>
                    <div className={styles.title}>Оплата тарифа</div>
                    <div className={styles.meta}>
                        {metaText}
                    </div>
                </div>
                <div className={styles.period}>
                    <div className={styles.choose}>
                        <button 
                            className={clsx(styles.button, period === 'month' && styles.selected)}
                            onClick={() => setPeriod('month')}
                            disabled={loading}
                        >
                            Месяц
                        </button>
                        <button 
                            className={clsx(styles.button, period === 'year' && styles.selected)}
                            onClick={() => setPeriod('year')}
                            disabled={loading}
                        >
                            Год <span className={styles.accent}>-10%</span>
                        </button>
                    </div>
                </div>
                <div className={styles.amount}>
                    {price.toLocaleString('ru-RU')} <span className={styles.secondary}>&#8381;</span>
                </div>
                <div className={styles.actions}>
                    <Button 
                        className={styles.action} 
                        variant='accent'
                        onClick={handlePayment}
                        disabled={loading}
                        children='Начать оплату'
                        loading={loading}
                    />
                </div>
            </div>
            {isDowngradeWithRemaining && (
                <div className={styles.bottom}>
                    Рекомендуем дождаться окончания {companyPlan.is_trial ? 'тестового периода' : 'текущего тарифного плана'} ({daysLeft} {pluralizeDays(daysLeft)}) - <ModalTooltip content='Миграция с большего по приоритету тарифа на меньший. При остатке дней в текущем - невыгодно.'><span className={styles.accent}>даунгрейд.</span></ModalTooltip>
                </div>
            )}
        </div>
    );
}