import Heart from '@/assets/ui-kit/svgs/heart/heart';
import styles from './new.module.scss';
import Button from '@/assets/ui-kit/button/button';
import Link from 'next/link';
import { linksConfig } from '@/config/links.config';

export function New() {
    return (
        <div className={styles.container}>
            <div className={styles.focus}>
                <div className={styles.col}>
                    <div className={styles.capture}>
                        30 дней бесплатно <br />
                        <span className={styles.secondary}>
                            для каждой новой организации.
                        </span>
                    </div>
                </div>
                <div className={styles.col}>
                    <Link href={linksConfig.registration}><Button className={styles.action} variant='contrast' >Начать</Button></Link>
                </div>
                <div className={styles.col}>
                    <Heart className={styles.svg} />
                </div>
            </div>
        </div>
    )
}