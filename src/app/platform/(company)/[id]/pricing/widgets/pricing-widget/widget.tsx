'use client';

import clsx from 'clsx';
import styles from './widget.module.scss';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Remained } from '@/assets/ui-kit/remained/remained';
import { usePricing } from '@/apps/company/modules';
import { useEffect, useState } from 'react';
import { CompanyPricingPlan } from '@/apps/company/modules/pricing/types';

export interface PricingWidgetProps {
    className?: string;
}

export function PricingWidget({
    className
}: PricingWidgetProps) {
    const params = useParams();
    const companyId = params.id as string;

    const pricingModule = usePricing();

    const [companyPlan, setCompanyPlan] = useState<CompanyPricingPlan | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [companyPlan] = await Promise.all([
                pricingModule.getPlan()
            ]);
            
            if (companyPlan.status) {
                setCompanyPlan(companyPlan.data);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Ошибка загрузки");
            console.error('Error loading analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Link href={`/platform/${companyId}/pricing`} className={clsx(styles.widget, className)}>
            {error ? (
                <div className={styles.error}>
                    С виджетом <span className={styles.accent}>тарификации</span> что-то пошло не так...
                </div>
            ) : (
                <>
                <div className={styles.title}>Тестовый период</div>
                <div className={styles.description}>Тарификация организации</div>
                <Remained 
                    loading={loading}
                    value={companyPlan?.days_left}
                    limit={companyPlan?.days_total}
                    className={styles.remained}
                >
                    {companyPlan && (
                        <>
                        <span className={styles.primary}>{companyPlan.days_left} дней</span> осталось
                        </>
                    )}
                </Remained>
                <span className={styles.mark} />
                </>
            )}
        </Link>
    )
}