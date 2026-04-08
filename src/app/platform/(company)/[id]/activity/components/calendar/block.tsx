import clsx from 'clsx';
import styles from './block.module.scss';
import Button from '@/assets/ui-kit/button/button';
import { style } from 'framer-motion/client';

export interface CalendarProps {
    className?: string;
}

export function Calendar({
    className
}: CalendarProps) {
    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.base}>
                <div className={styles.area}>
                    <div className={styles.grid}>
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={clsx(styles.box, styles.mn)} />
                        <span className={clsx(styles.box, styles.md)} />
                        <span className={clsx(styles.box, styles.mx)} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={clsx(styles.box, styles.mn)} />
                        <span className={clsx(styles.box, styles.md)} />
                        <span className={clsx(styles.box, styles.mx)} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={clsx(styles.box, styles.mn)} />
                        <span className={clsx(styles.box, styles.md)} />
                        <span className={clsx(styles.box, styles.mx)} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={clsx(styles.box, styles.mn)} />
                        <span className={clsx(styles.box, styles.md)} />
                        <span className={clsx(styles.box, styles.mx)} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={clsx(styles.box, styles.mn)} />
                        <span className={clsx(styles.box, styles.md)} />
                        <span className={clsx(styles.box, styles.mx)} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={clsx(styles.box, styles.mn)} />
                        <span className={clsx(styles.box, styles.md)} />
                        <span className={clsx(styles.box, styles.mx)} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={clsx(styles.box, styles.active)} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={clsx(styles.box, styles.mn)} />
                        <span className={clsx(styles.box, styles.md)} />
                        <span className={clsx(styles.box, styles.mx)} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                        <span className={clsx(styles.box, styles.mn)} />
                        <span className={clsx(styles.box, styles.md)} />
                        <span className={clsx(styles.box, styles.mx)} />
                        <span className={styles.box} />
                        <span className={styles.box} />
                    </div>
                </div>
                <div className={styles.years}>
                    <Button className={clsx(styles.year)} variant='accent'>2026</Button>
                    <Button className={clsx(styles.year)}>2025</Button>
                </div>
            </div>
            <div className={styles.legend}>
                <div className={styles.item}>
                    <span className={clsx(styles.box)} />
                    <span className={styles.name}>Без активности</span>
                </div>
                <div className={styles.item}>
                    <span className={clsx(styles.box, styles.mn)} />
                    <span className={styles.name}>Минимальная: от 1 до 5 действий</span>
                </div>
                <div className={styles.item}>
                    <span className={clsx(styles.box, styles.md)} />
                    <span className={styles.name}>Средняя: от 5 до 25 действий</span>
                </div>
                <div className={styles.item}>
                    <span className={clsx(styles.box, styles.mx)} />
                    <span className={styles.name}>Минимальная: от 25 до ∞ действий</span>
                </div>
            </div>
        </div>
    )
}