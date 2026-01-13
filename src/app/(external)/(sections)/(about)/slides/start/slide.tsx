import { LogoFull } from '@/assets/ui-kit/logo/full/full';
import styles from './slide.module.scss';
import { LogoText } from '@/assets/ui-kit/logo/text/text';
import clsx from 'clsx';

export function StartSlide() {
    return (
        <div className={styles.slide}>
            <div className={styles.focus}>
                <div className={styles.col}>
                    <div className={clsx(styles.logo, styles.brand)}><LogoText animate /></div>
                    <div className={styles.slogan}>
                        бля, я разминаюсь
                    </div>
                    <div className={styles.description}>
                        Stripe — ирландско-американская транснациональная компания, предоставляющая финансовые услуги и программное обеспечение как услуга (SaaS).
                    </div>
                </div>
            </div>
        </div>
    )
}