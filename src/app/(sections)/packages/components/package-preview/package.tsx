import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './package.module.scss';
import Package from '@/assets/ui-kit/icons/package';
import Link from 'next/link';

export interface PackagePreviewProps {
    variant?: 'default' | 'compact';
}

export function PackagePreview({ variant = 'default' }: PackagePreviewProps) {
    const isCompact = variant === 'compact';
    
    return (
        <Link href='/packages/58ca15159db84d39' className={clsx(
            styles.container,
            isCompact && styles.compact
        )}>
            <div className={styles.icon}>
                <Package className={styles.svg} />
            </div>
            <div className={styles.info}>
                <div className={styles.name}>Автосервис РФ</div>
                <div className={styles.description}>Марки, модели, воронка продаж, спецификация товаров.</div>
            </div>
            <div className={styles.tags}>
                <span className={styles.tag}>RU</span>
            </div>
        </Link>
    )
}