'use client';

import { Permission } from '@/apps/permissions/types';
import styles from './block.module.scss';
import clsx from 'clsx';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export interface PlatformNotAllowedProps {
    className?: string;
    permission?: string;
}

export function PlatformNotAllowed({
    className,
    permission
}: PlatformNotAllowedProps) {
    const params = useParams();
    const companyId = params.id as string;

    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.code}>Доступ запрещён</div>   
            <div className={styles.capture}>
                Не хватает прав для просмотра страницы. {permission} 
                Такое бывает при окончании <Link href={`/platform/${companyId}/pricing`}>тарифного плана</Link>. Обратитесь к владельцу организации или в <Link href={`/platform/${companyId}/support`}>службу поддержки</Link>.
            </div>
     </div>
    )
}