import { LogoFull } from '@/assets/ui-kit/logo/full/full';
import styles from './slide.module.scss';
import { LogoText } from '@/assets/ui-kit/logo/text/text';
import clsx from 'clsx';
import Cross from '@/assets/ui-kit/svgs/cross/cross';
import Arrow from '@/assets/ui-kit/icons/arrow';

export function GridSlide() {
    return (
        <div className={styles.slide}>
            <div className={styles.focus}>
                <div className={styles.line}>
                    <div className={styles.col}>
                        <section className={styles.counter}>
                            <span className={styles.value}>45</span> <span className={styles.ghost}>часов/месяц</span>
                        </section>
                        <section><span className={styles.brand}>Экономьте время</span> менеджера на ведении учёта.</section>
                    </div>
                    <div className={styles.col}></div>
                    <div className={styles.col}></div>
                    <Cross className={styles.cross} />
                </div>
                <div className={styles.line}>
                    <div className={styles.col}></div>
                    <div className={styles.col}></div>
                    <Cross className={styles.cross} />
                </div>
                <div className={styles.line}>
                    <div className={styles.col}></div>
                    <div className={styles.col}></div>
                    <div className={styles.col}></div>
                    <Cross className={styles.cross} />
                </div>
            </div>
        </div>
    )
}