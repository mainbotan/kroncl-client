'use client';

import { useEffect, useState, useCallback, memo, useRef } from 'react';
import clsx from 'clsx';
import styles from './block.module.scss';
import { PricingPlan as PricingPlanComponent } from '../pricing-plan/card';
import { pricingApi } from '@/apps/pricing/api';
import type { PricingPlan } from '@/apps/pricing/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { useSearchParams } from 'next/navigation';

export interface SelectPlanBlockProps {
    className?: string;
    onSelect?: (planCode: string) => void;
    initialPlanCode?: string;
    disabled?: boolean;
}

export const SelectPlanBlock = memo(function SelectPlanBlock({
    className,
    onSelect,
    initialPlanCode,
    disabled
}: SelectPlanBlockProps) {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    
    const searchParams = useSearchParams();
    const urlPlanCode = searchParams.get('plan');
    
    // Используем ref для onSelect, чтобы не вызывать эффект при его изменении
    const onSelectRef = useRef(onSelect);
    useEffect(() => {
        onSelectRef.current = onSelect;
    }, [onSelect]);

    // Отдельный эффект для выбора начального плана (один раз)
    const [initialized, setInitialized] = useState(false);
    
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await pricingApi.getPlans();
                if (response.status && response.data) {
                    const plansData = response.data.plans;
                    setPlans(plansData);
                    
                    // Выбираем план только один раз при загрузке
                    if (!initialized && plansData.length > 0) {
                        let planToSelect: string | null = null;
                        
                        if (urlPlanCode && plansData.some((plan: PricingPlan) => plan.code === urlPlanCode)) {
                            planToSelect = urlPlanCode;
                        } else if (initialPlanCode && plansData.some((plan: PricingPlan) => plan.code === initialPlanCode)) {
                            planToSelect = initialPlanCode;
                        } else {
                            planToSelect = plansData[0].code;
                        }
                        
                        if (planToSelect) {
                            setSelectedCode(planToSelect);
                            onSelectRef.current?.(planToSelect);
                            setInitialized(true);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch plans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, [urlPlanCode, initialPlanCode, initialized]);

    const handleSelect = useCallback((code: string) => {
        if (disabled) return;
        
        setSelectedCode(code);
        onSelectRef.current?.(code);
        
        // Обновляем URL без перезагрузки страницы
        const url = new URL(window.location.href);
        url.searchParams.set('plan', code);
        window.history.pushState({}, '', url.toString());
    }, [disabled]);

    if (loading) {
        return <div className={clsx(styles.empty, className)}><Spinner variant='accent' /></div>;
    }

    if (plans.length === 0) {
        return null;
    }

    return (
        <div className={clsx(styles.block, className)}>
            {plans.map((plan) => (
                <PricingPlanComponent
                    key={plan.code}
                    plan={plan}
                    className={clsx(
                        styles.item,
                        selectedCode === plan.code && styles.selected,
                        disabled && styles.disabled
                    )}
                    onClick={() => handleSelect(plan.code)}
                />
            ))}
        </div>
    );
});