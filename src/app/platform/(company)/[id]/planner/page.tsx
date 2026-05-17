'use client';

import clsx from 'clsx';
import styles from './page.module.scss';
import Time from '@/assets/ui-kit/icons/time';

export default function Page() {
    return (
        <div className={styles.canvas}>
            <div className={styles.grid}>
                <div className={styles.col}>
                    <div className={styles.head}>18 мая, Пон</div>
                </div>
                <div className={styles.col}>
                    <div className={styles.head}>19 мая, Вт</div>
                    <div className={styles.items}>
                        <div className={styles.item}>
                            <div className={styles.title}>
                                Написать хуиле
                            </div>
                            <div className={styles.about}>
                                Написать хуиле этому ебаному заебал уже гондон конченный
                            </div>
                            <div className={styles.time}>
                                <Time />
                                9:00
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.col}>
                    <div className={styles.head}>20 мая, Ср</div>
                </div>
                <div className={styles.col}>
                    <div className={styles.head}>21 мая, Чет</div>
                </div>
                <div className={styles.col}>
                    <div className={styles.head}>22 мая, Пят</div>
                </div>
                <div className={clsx(styles.col, styles.weekend)}>
                    <div className={styles.head}>23 мая, Суб</div>
                </div>
                <div className={clsx(styles.col, styles.weekend)}>
                    <div className={styles.head}>24 мая, Вос</div>
                </div>
                <div className={styles.col}>
                    <div className={styles.head}>25 мая, Пнд</div>
                </div>
                <div className={styles.col}>
                    <div className={styles.head}>26 мая, Вт</div>
                </div>
            </div>
        </div>
    )
}