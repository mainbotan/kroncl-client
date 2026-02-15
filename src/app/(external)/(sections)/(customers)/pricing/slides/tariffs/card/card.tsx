import Button from '@/assets/ui-kit/button/button';
import styles from './card.module.scss';
import clsx from 'clsx';

export interface TariffCardProps {
    variant?: 'default' | 'accent';
}

export function TariffCard({
    variant = 'default'
}: TariffCardProps) {
    return (
        <div className={clsx(styles.card, styles[variant])}>
            <div className={styles.info}>
                <div className={styles.value}>
                    0$
                </div>
            </div>
            <div className={styles.actions}>
                <Button className={styles.action} variant='accent' fullWidth>Оформить</Button>
            </div>
        </div>
    )
}