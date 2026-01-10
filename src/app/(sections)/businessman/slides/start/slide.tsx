import { LogoText } from '@/assets/ui-kit/logo/text/text';
import styles from './slide.module.scss';
import PulsingSquare from './pulsing-circles/pulsing-circles';
import Link from 'next/link';
import Arrow from '@/assets/ui-kit/icons/arrow';
import { linksConfig } from '@/config/links.config';

export function StartSlide() {
    return (
        <div className={styles.slide}>
            <div className={styles.focus}>
                <div className={styles.col}>
                    <Link 
                    href={linksConfig.login} 
                    className={styles.topic}
                    >
                    <span className={styles.marker}></span>
                    <span className={styles.text}>Начать бесплатно</span>
                    <span className={styles.indicator}>
                        <Arrow className={styles.svg} />
                    </span>
                    </Link>
                    <div className={styles.capture}>
                        Предпринимателям<br />
                        от <span className={styles.brand}>предпринимателей.</span>
                    </div>
                    <div className={styles.description}>
                        Мы разрабатываем <LogoText />, руководствуясь собственным опытом в построении малого бизнеса. <br />
                        Мы знаем ваши боли и стремимся к автоматизации <span className={styles.brand}>100%</span> рутинного учёта.
                    </div>
                </div>
                <div className={styles.col}>

                </div>
            </div>
        </div>
    )
}