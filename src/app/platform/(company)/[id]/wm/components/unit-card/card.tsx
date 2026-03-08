import clsx from 'clsx';
import styles from './card.module.scss';
import Button, { ButtonProps } from '@/assets/ui-kit/button/button';
import { useParams } from 'next/navigation';
import { CatalogUnit } from '@/apps/company/modules/wm/types';
import Link from 'next/link';
import Arrow from '@/assets/ui-kit/icons/arrow';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';

export interface UnitCardProps {
    unit: CatalogUnit;
    className?: string;
    compact?: boolean;
    showDefaultActions?: boolean;
    onClick?: (unit: CatalogUnit) => void;
    href?: string;
    actions?: ButtonProps[];
}

export function UnitCard({
    unit,
    className,
    compact = false,
    showDefaultActions = true,
    onClick,
    href,
    actions
}: UnitCardProps) {
    const params = useParams();
    const companyId = params.id as string;

    const defaultHref = `/platform/${companyId}/wm/units/${unit.id}`;
    const linkHref = href || defaultHref;

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick(unit);
        }
    };

    const getTypeLabel = (type: string) => {
        return type === 'product' ? 'Товар' : 'Услуга';
    };

    const getInventoryLabel = (inventoryType: string) => {
        return inventoryType === 'tracked' ? 'Остатки отслеживаются' : 'Без учета';
    };

    const getStatusVariant = (status: string) => {
        return status === 'active' ? 'active' : 'inactive';
    };

    const CardContent = (
        <>
            <div className={styles.base}>
                <ModalTooltip content={unit.status === 'active' ? 'Товарная позиция активна' : 'Товарная позиция неактивна'}>
                    <span className={clsx(styles.indicator, styles[getStatusVariant(unit.status)])} />
                </ModalTooltip>
                <div className={styles.info}>
                    <span className={clsx(styles.section, styles.type, styles.secondary)}>{getTypeLabel(unit.type)}</span>
                    <span className={clsx(styles.section, styles.name)}>{unit.name}</span>
                    <span className={clsx(styles.section, styles.price)}>
                        {unit.purchase_price !== null && (
                            <ModalTooltip content='Базовая закупочная цена'>
                                <span className={styles.purchase}>{unit.purchase_price.toLocaleString()} &#8381;</span>
                            </ModalTooltip>
                        )}
                        {unit.purchase_price !== null && (
                            <span className={styles.icon}><Arrow className={styles.svg} /></span>
                        )}
                        <ModalTooltip content='Базовая цена продажи'>
                            <span className={styles.sale}>{unit.sale_price.toLocaleString()} &#8381;</span>
                        </ModalTooltip>
                    </span>
                    <ModalTooltip content={unit.inventory_type === 'tracked' ? 'Наличие единиц товарной позиции учитывается на складе' : 'Товарная позиция не учитывается на складе'}>
                        <span className={clsx(styles.section, styles.secondary, styles.stocks)}>{getInventoryLabel(unit.inventory_type)}</span>
                    </ModalTooltip>
                    <ModalTooltip content='Уникальный идентификатор товарной позиции'>
                        <span className={clsx(styles.section, styles.id)}>{unit.id.split('-')[0]}</span>
                    </ModalTooltip>
                </div>
            </div>
            {/* {(showDefaultActions || actions) && (
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
            )} */}
        </>
    );

    if (onClick) {
        return (
            <div 
                onClick={handleClick}
                className={clsx(styles.unit, className, compact ? styles.compact : styles.default)}
            >
                {CardContent}
            </div>
        );
    }

    return (
        <Link 
            href={linkHref} 
            className={clsx(styles.unit, className, compact ? styles.compact : styles.default)}
            onClick={handleClick}
        >
            {CardContent}
        </Link>
    );
}