'use client';

import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import { TariffCard } from './card/card';
import Button from '@/assets/ui-kit/button/button';
import { useEffect, useState, useMemo } from 'react';
import { pricingApi } from '@/apps/pricing/api';
import { PricingPlan } from '@/apps/pricing/types';
import { getThesesByLvl } from './_meta';

export type BillingPeriod = 'monthly' | 'annual';

export function TariffsBlock({
    className
}: PageBlockProps) {
    const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await pricingApi.getPlans();
                if (response.status && response.data) {
                    const sorted = [...response.data.plans].sort((a, b) => b.lvl - a.lvl);
                    setPlans(sorted);
                }
            } catch (error) {
                console.error('Failed to fetch plans:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handlePeriodChange = (period: BillingPeriod) => {
        setBillingPeriod(period);
    };

    const minLvl = useMemo(() => {
        if (plans.length === 0) return 0;
        return Math.min(...plans.map(p => p.lvl));
    }, [plans]);

    return (
        <div className={clsx(styles.block, className)}>
            <div className={styles.control}>
                <Button 
                    className={styles.action} 
                    variant={billingPeriod === 'monthly' ? 'accent' : 'glass'}
                    onClick={() => handlePeriodChange('monthly')}
                >
                    Месяц
                </Button>
                <Button 
                    className={styles.action} 
                    variant={billingPeriod === 'annual' ? 'accent' : 'glass'}
                    onClick={() => handlePeriodChange('annual')}
                >
                    Год -10%
                </Button>
            </div>
            <div className={styles.wrap}>
                {loading || !plans ? (
                    <div className={styles.grid}>
                        {[1, 2, 3].map(i => (
                            <TariffCard key={i} className={clsx(styles.card, styles.skeleton)} />
                        ))}
                    </div>
                ) : (
                <div className={styles.grid}>
                    {plans.map((plan) => {
                        const isMinLvl = plan.lvl === minLvl;
                        const theses = getThesesByLvl(plan.lvl, true);
                        theses.push(
                            {about: `${plan.limit_db_mb / 1024}ГБ хранилища данных`},
                            {about: `${plan.limit_objects_mb / 1024}ГБ хранилища файлов`},
                            {about: `До ${plan.limit_objects_count.toLocaleString('ru-RU')} файлов`}
                        );
                        return (
                            <TariffCard 
                                key={plan.code}
                                className={styles.card}
                                billing_period={billingPeriod}
                                variant={isMinLvl ? 'accent' : 'default'}
                                shimmer={isMinLvl}
                                tariff={{
                                    code: plan.code,
                                    name: plan.name,
                                    trial: true,
                                    trial_days: 30,
                                    billing: [
                                        { period: 'annual', amount_rub: plan.price_per_year },
                                        { period: 'monthly', amount_rub: plan.price_per_month }
                                    ],
                                    description: plan.description,
                                    theses
                                }}
                            />
                        );
                    })}
                </div>
                )}
            </div>
        </div>
    );
}