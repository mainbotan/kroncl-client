import { LogoFull } from '@/assets/ui-kit/logo/full/full';
import styles from './slide.module.scss';
import { LogoText } from '@/assets/ui-kit/logo/text/text';
import clsx from 'clsx';
import { LogoIco } from '@/assets/ui-kit/logo/ico/ico';
import Button from '@/assets/ui-kit/button/button';
import { Tile } from './tile/tile';
import Link from 'next/link';
import { authLinks } from '@/config/links.config';

export function StartSlide() {
    return (
        <div className={styles.slide}>
            <div className={styles.focus}>
                <div className={styles.col}>
                    <div className={styles.slogan}>
                        Учётная система <span className={styles.brand}>#1</span><br />
                        малого бизнеса.
                    </div>
                    <div className={styles.description}>
                        Мы всей душой ненавидим 1с и Битрикс24 и показываем как <span className={styles.brand}>малый</span> и <span className={styles.brand}>средний</span> бизнес может вести учёт и планирование в России.
                    </div>
                    <div className={styles.actions}>
                        <Link href={authLinks.registration} className={styles.link}><Button className={styles.action} variant='contrast'>Начать бесплатно</Button></Link>
                        <Link href={authLinks.login} className={styles.link}><Button className={styles.action} variant='glass'>Войти</Button></Link>
                    </div>
                    <div className={styles.note}>
                        *Финансы, клиенты, сотрудники, склад и многое другое в облаке Kroncl.
                    </div>
                </div>
                {/* <LogoIco className={styles.icon} /> */}
            </div>
            <Tile />
        </div>
    )
}