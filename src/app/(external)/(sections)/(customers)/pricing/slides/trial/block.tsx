'use client';

import { PageBlockProps } from "@/app/(external)/_types";
import clsx from "clsx";
import styles from './block.module.scss';
import Button from "@/assets/ui-kit/button/button";
import { linksConfig } from "@/config/links.config";

export function TrialPeriodBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.col}>
                <span className={styles.capture}>
                    30 <span className={styles.secondary}>дней</span>
                </span>
            </div>
            <div className={styles.col}>
                <div className={styles.capture}>Бесплатного доступа ко всем возможностям новым организациям</div>
            </div>
            <div className={styles.col}>
                <Button className={styles.action} href={linksConfig.createCompany} as='link' variant="contrast">Забрать</Button>
            </div>
        </div>
    )
}