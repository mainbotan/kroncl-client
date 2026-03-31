'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './block.module.scss';
import { PricingPlan as PricingPlanComponent } from '../pricing-plan/card';
import { pricingApi } from '@/apps/pricing/api';
import type { PricingPlan } from '@/apps/pricing/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';

export interface SelectPlanBlockProps {
    className?: string;
    onSelect?: (planCode: string) => void;
    initialPlanCode?: string;
}

export function SelectPlanBlock({
    className,
    onSelect,
    initialPlanCode
}: SelectPlanBlockProps) {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [selectedCode, setSelectedCode] = useState<string | null>(initialPlanCode || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await pricingApi.getPlans();
                if (response.status && response.data) {
                    setPlans(response.data.plans);
                    // Если нет выбранного, выбираем первый
                    if (!selectedCode && response.data.plans.length > 0) {
                        setSelectedCode(response.data.plans[0].code);
                        onSelect?.(response.data.plans[0].code);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch plans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleSelect = (code: string) => {
        setSelectedCode(code);
        onSelect?.(code);
    };

    if (loading) {
        return <div className={clsx(styles.empty, className)}><Spinner variant='accent' /></div>;
    }

    return (
        <div className={clsx(styles.block, className)}>
            {plans.map((plan) => (
                <PricingPlanComponent
                    key={plan.code}
                    plan={plan}
                    className={clsx(
                        styles.item,
                        selectedCode === plan.code && styles.selected
                    )}
                    onClick={() => handleSelect(plan.code)}
                />
            ))}
        </div>
    );
}