'use client';

import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import { TariffCard } from './card/card';
import { tariffsList } from './_tariffs';
import Button from '@/assets/ui-kit/button/button';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export type BillingPeriod = 'monthly' | 'annual';

export function TariffsBlock({
    className
}: PageBlockProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(
        (searchParams.get('billing') as BillingPeriod) || 'monthly'
    );

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (billingPeriod === 'annual') {
            params.set('billing', 'annual');
        } else {
            params.delete('billing');
        }
        
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [billingPeriod, pathname, router, searchParams]);

    const handlePeriodChange = (period: BillingPeriod) => {
        setBillingPeriod(period);
    };

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
                    Год
                </Button>
            </div>
            <div className={styles.wrap}>
                <div className={styles.grid}>
                    {tariffsList.map((tariff, index) => (
                        <TariffCard 
                            className={styles.card} 
                            key={index} 
                            billing_period={billingPeriod}
                            {...tariff} 
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}