import clsx from 'clsx';
import styles from './block.module.scss';
import { PricingPlan } from '../pricing-plan/card';

export interface SelectPlanBlockProps {
    className?: string;
}

export function SelectPlanBlock({
    className
}: SelectPlanBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            <PricingPlan className={clsx(styles.item, styles.selected)} />
            <PricingPlan className={styles.item} />
            <PricingPlan className={styles.item} />
        </div>
    )
}