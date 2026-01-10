import { LogoFull } from '@/assets/ui-kit/logo/full/full';
import styles from './slide.module.scss';
import { LogoText } from '@/assets/ui-kit/logo/text/text';
import clsx from 'clsx';
import Cross from '@/assets/ui-kit/svgs/cross/cross';

export function GridSlide() {
    return (
        <div className={styles.slide}>
            <div className={styles.focus}>
                <div className={styles.line}>
                    <div className={styles.col}></div>
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