import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import { TariffCard } from './card/card';

export function TariffsBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            <div className={styles.grid}>
                <TariffCard variant='accent' />
                <TariffCard />
                <TariffCard />
                <TariffCard />
            </div>
        </div>
    )
}