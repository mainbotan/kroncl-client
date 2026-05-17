'use client';

import { PageBlockProps } from "@/app/(external)/_types";
import clsx from "clsx";
import styles from './pin.module.scss';
import Button from "@/assets/ui-kit/button/button";
import Link from "next/link";
import { DOCS_LINK } from "@/app/docs/(v1)/internal.config";

export function Pin({className}: PageBlockProps) {
    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.grid}>
                <div className={styles.text}>
                    Платформа работает в Beta-режиме. <span className={styles.underline}>30 дней</span> каждой новой организации.
                </div>
            </div>
        </div>
    )
}