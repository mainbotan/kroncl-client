import clsx from 'clsx';
import styles from './card.module.scss';
import Button, { ButtonProps } from '@/assets/ui-kit/button/button';
import { useParams } from 'next/navigation';
import { CatalogCategory } from '@/apps/company/modules/wm/types';
import { getStatusLabel, getStatusVariant } from './_utils';
import Link from 'next/link';

export interface CategoryCardProps {
    category: CatalogCategory;
    className?: string;
    compact?: boolean;
    showDefaultActions?: boolean;
    onClick?: (category: CatalogCategory) => void;
    href?: string;
    actions?: ButtonProps[];
}

export function CategoryCard({
    category,
    className,
    compact = false,
    showDefaultActions = true,
    onClick,
    href,
    actions
}: CategoryCardProps) {
    const params = useParams();
    const companyId = params.id as string;

    const defaultHref = `/platform/${companyId}/wm/${category.id}`;
    const linkHref = href || defaultHref;

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick(category);
        }
    };

    // const handleUnitsClick = (e: React.MouseEvent) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     // Переход к товарным позициям с фильтром по категории
    //     window.location.href = `/platform/${companyId}/wm/catalog/units?category_id=${category.id}`;
    // };

    const CardContent = (
        <>
            <div className={styles.info}>
                <div className={styles.name}>{category.name}</div>
                {category.comment && (
                    <div className={styles.comment}>{category.comment}</div>
                )}
                <div className={styles.tags}>
                    <span className={clsx(styles.tag, styles[getStatusVariant(category.status)])}>
                        {getStatusLabel(category.status)}
                    </span>
                    {category.parent_id && (
                        <span className={styles.tag}>Дочерняя категория</span>
                    )}
                </div>
            </div>
            {(showDefaultActions || actions) && (
                <div className={styles.actions}>
                    {showDefaultActions && (
                        <Button 
                            as='link'
                            href={defaultHref}
                            className={styles.action} 
                            variant='accent'
                        >
                            Открыть
                        </Button>
                    )}
                    {actions?.map((action, index) => (
                        <Button 
                            key={index} 
                            className={clsx(styles.action, action.className)} 
                            {...action} 
                        />
                    ))}
                </div>
            )}
        </>
    );

    if (onClick) {
        return (
            <div 
                onClick={handleClick}
                className={clsx(styles.card, className, compact ? styles.compact : styles.default)}
            >
                {CardContent}
            </div>
        );
    }

    return (
        <div 
            // href={linkHref} 
            className={clsx(styles.card, className, compact ? styles.compact : styles.default)}
            // onClick={handleClick}
        >
            {CardContent}
        </div>
    );
}