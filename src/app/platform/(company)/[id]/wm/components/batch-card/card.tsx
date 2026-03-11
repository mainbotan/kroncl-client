import clsx from 'clsx';
import styles from './card.module.scss';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { StockBatch } from '@/apps/company/modules/wm/types';
import { formatDate } from '@/assets/utils/date';

export interface BatchCardProps {
    batch: StockBatch;
    className?: string;
    onClick?: (batch: StockBatch) => void;
    href?: string;
}

export function BatchCard({
    batch,
    className,
    onClick,
    href
}: BatchCardProps) {
    const params = useParams();
    const companyId = params.id as string;

    const defaultHref = `/platform/${companyId}/wm/movement/${batch.id}`;
    const linkHref = href || defaultHref;

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick(batch);
        }
    };

    const getDirectionLabel = (direction: string) => {
        return direction === 'income' ? 'Поставка' : 'Отгрузка';
    };

    const CardContent = (
        <div className={styles.base}>
            <span className={clsx(styles.indicator, styles.active)} />
            <div className={styles.info}>
                <div className={clsx(styles.section, styles.type, styles.secondary)}>
                    {getDirectionLabel(batch.direction)}
                </div>
                <div className={clsx(styles.section, styles.name)}>
                    {batch.id.split('-')[0]}
                </div>
                <div className={clsx(styles.section, styles.date)}>
                    {formatDate(batch.created_at)}
                </div>
            </div>
        </div>
    );

    if (onClick) {
        return (
            <div 
                onClick={handleClick}
                className={clsx(styles.batch, className)}
            >
                {CardContent}
            </div>
        );
    }

    return (
        <Link 
            href={linkHref} 
            className={clsx(styles.batch, className)}
            onClick={handleClick}
        >
            {CardContent}
        </Link>
    );
}