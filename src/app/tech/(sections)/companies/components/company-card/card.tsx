'use client';

import clsx from 'clsx';
import styles from './card.module.scss';
import Link from 'next/link';
import { AdminCompany } from '@/apps/admin/companies/types';
import { formatDate } from '@/assets/utils/date';
import { getColorFromString, getFirstLetter } from '@/assets/utils/avatars';

export interface CompanyCardProps {
    className?: string;
    company: AdminCompany;
}

export function CompanyCard({
    className,
    company
}: CompanyCardProps) {
    const firstLetter = getFirstLetter(company.name);
    const avatarColor = getColorFromString(company.name);

    return (
        <Link href={`/tech/companies/${company.id}`} className={clsx(styles.container, className)}>
            <div style={{background: `${avatarColor}`}} className={styles.icon}>{firstLetter}</div>
            <div className={styles.info}>
                <div className={styles.name}>{company.name}</div>
                <div className={styles.about}>
                    Статус хранилища (схемы): <span className={styles.accent}>{company.storage_status}</span> | {company.id}
                </div>
            </div>
            <div className={styles.tags}>
                <span className={clsx(styles.tag, styles.accent)}>{company.slug}</span>
                <span className={clsx(styles.tag)}>{formatDate(company.created_at)}</span>
            </div>
        </Link>
    )
}