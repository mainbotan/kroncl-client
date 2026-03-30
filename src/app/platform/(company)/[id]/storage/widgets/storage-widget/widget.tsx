'use client';

import clsx from 'clsx';
import styles from './widget.module.scss';
import { Remained } from '@/assets/ui-kit/remained/remained';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export interface StorageWidgetProps {
    className?: string;
    variant?: 'compact' | 'default';
}

export function StorageWidget({
    className,
    variant = 'default'
}: StorageWidgetProps) {
    const params = useParams();
    const companyId = params.id;
    
    return (
        <Link href={`/platform/${companyId}/storage`} className={clsx(styles.widget, styles[variant], className)}>
            {variant === 'default' && (
                <>
                <div className={styles.title}>
                    Использование хранилища
                </div>
                <Remained value={2} limit={5}>Данные</Remained>
                <Remained value={40} limit={50}>Медиа/документы</Remained>
                </>
            )}
            {variant === 'compact' && (
                <>
                <div className={styles.line}><span /></div>
                <div className={styles.text}>
                    Использовано 115КБ/1ГБ хранилища
                </div>
                </>
            )}
        </Link>
    )
}