'use client';

import clsx from 'clsx';
import styles from './widget.module.scss';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Remained } from '@/assets/ui-kit/remained/remained';

export interface PricingWidgetProps {
    className?: string;
}

export function PricingWidget({
    className
}: PricingWidgetProps) {
    const params = useParams();
    const companyId = params.id as string;

    return (
        <Link href={`/platform/${companyId}/pricing`} className={clsx(styles.widget, className)}>
            <div className={styles.title}>Тестовый период</div>
            <div className={styles.description}>Тарификация организации</div>
            <Remained className={styles.remained} value={28} limit={30}><span className={styles.primary}>30 дней</span> осталось</Remained>
            <span className={styles.mark} />
        </Link>
    )
}