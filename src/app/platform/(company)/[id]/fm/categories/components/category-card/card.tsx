import clsx from 'clsx';
import styles from './card.module.scss';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TransactionCategory } from '@/apps/company/modules/fm/types';

interface CategoryCardProps {
    category: TransactionCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
    const params = useParams();
    const companyId = params.id as string;

    const directionLabel = category.direction === 'income' ? 'Доход' : 'Расход';

    return (
        <Link href={`/platform/${companyId}/fm/categories/${category.id}`} className={styles.card}>
            <div className={styles.info}>
                <div className={styles.name}>{category.name}</div>
                <div className={styles.tags}>
                    {category.system && (
                        <ModalTooltip content='Системная категория - удалить или обновить невозможно'>
                            <span className={clsx(styles.tag, styles.accent)}>Системная категория</span>
                        </ModalTooltip>
                    )}
                    <span className={styles.tag}>{directionLabel}</span>
                    {category.description && (
                        <span className={styles.tag}>{category.description}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}