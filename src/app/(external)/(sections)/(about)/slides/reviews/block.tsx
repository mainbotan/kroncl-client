'use client';

import { PageBlockProps } from "@/app/(external)/_types";
import styles from './block.module.scss';
import clsx from "clsx";
import { EasyServiceLogo } from "../partners/components/easy-service";
import Button from "@/assets/ui-kit/button/button";
import { authLinks } from "@/config/links.config";

export interface ReviewsBlockProps extends PageBlockProps {

}

export function ReviewsBlock({
    className
}: ReviewsBlockProps) {
    return (
        <div className={styles.container}>
            <div className={clsx(styles.col, className)}>
                <div className={styles.capture}>
                    <span className={styles.secondary}>Мнение</span> малого бизнеса
                </div>
                <div className={styles.description}>
                    Собираем мнение малого бизнеса и делаем платформу лучше каждый день.
                </div>
                <Button as='link' href={authLinks.registration} variant='contrast' className={styles.action}>Начать сейчас</Button>
            </div>
            <div className={clsx(styles.col, className)}>
                <div className={styles.text}>
                    Полтора года в поисках простой системы учёта финансов, склада и клиентов - безуспешно. До появления Kroncl, здесь 
                    объединено всё, что было нужно небольшой компании до 10 человек.
                    <br />
                    Прямая интеграция сделок с финансами даёт нам точное представление о тратах и доходах организации.
                </div>
                <div className={styles.meta}>
                    <div className={styles.info}>
                        <div className={styles.capture}>Easy Service</div>
                        <div className={styles.about}>Сфера автообслуживания</div>
                    </div>
                    <div className={styles.logo}><EasyServiceLogo color="var(--color-text-ghost)" className={styles.svg} /></div>
                </div>
            </div>
        </div>
    )
}