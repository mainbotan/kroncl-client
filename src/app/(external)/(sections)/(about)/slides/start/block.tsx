import { LogoFull } from '@/assets/ui-kit/logo/full/full';
import styles from './block.module.scss';
import { LogoText } from '@/assets/ui-kit/logo/text/text';
import clsx from 'clsx';
import { LogoIco } from '@/assets/ui-kit/logo/ico/ico';
import Button from '@/assets/ui-kit/button/button';
import Link from 'next/link';
import { authLinks } from '@/config/links.config';
import { PageBlockProps } from '@/app/(external)/_types';
import ArtGrid from '../../components/art-grid/grid';

export function StartBlock({className}: PageBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            <div className={styles.content}>
                <div className={styles.slogan}>
                    Учётная система <span className={styles.brand}>#1</span> малого бизнеса.
                </div>
                <div className={styles.description}>
                    Мы всей душой ненавидим 1с и Битрикс24 и показываем как <span className={styles.brand}>малый</span> и <span className={styles.brand}>средний</span> бизнес может вести учёт и планирование в России.
                </div>
                <div className={styles.actions}>
                    <Link href={authLinks.registration} className={styles.link}><Button className={styles.action} variant='accent'>Начать бесплатно</Button></Link>
                    <Link href={authLinks.login} className={styles.link}><Button className={styles.action} variant='glass'>Войти</Button></Link>
                </div>
            </div>
            <span className={styles.shadow} />
            <ArtGrid className={styles.art} />
        </div>
    )
}