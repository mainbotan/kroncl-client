'use client';

import clsx from "clsx";
import styles from './block.module.scss';

export interface GridBlockProps {
    className?: string;
    title: string;
}

export function GridBlock({
    className,
    title
}: GridBlockProps) {
    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.title}>{title}</div>
            <div className={styles.grid}>
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.critical)} />
                <span className={clsx(styles.col, styles.critical)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.critical)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal)} />
                <span className={clsx(styles.col, styles.normal, styles.today)} />
                {/* <span className={clsx(styles.col, styles.minor)} />
                <span className={clsx(styles.col, styles.major)} />
                <span className={clsx(styles.col, styles.critical)} /> */}
            </div>

            {/* конкретный день */}
            <div className={styles.block}>
                <div className={styles.head}>[7 мая, 2026]</div>
                <div className={styles.items}>
                    <div className={clsx(styles.item, styles.normal)}>no incidents</div>
                    <div className={clsx(styles.item, styles.critical)}>incompleteness of tenant migrations</div>
                </div>
            </div>
        </div>
    )
}