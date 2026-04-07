'use client';

import { PageBlockProps } from "@/app/(external)/_types";
import styles from './block.module.scss';
import clsx from "clsx";
import React from "react";

export interface MiniBlockProps extends PageBlockProps {
    title?: string;
    description?: string;
    img?: string;
    icon?: React.ReactNode;
}

export function MiniBlock({
    className,
    title,
    description,
    img,
    icon
}: MiniBlockProps) {
    return (
        <div className={clsx(styles.container, className)}>
            {(title || description) && (
                <div className={styles.about}>
                    <div className={styles.capture}>{title}</div>
                    <div className={styles.description}>{description}</div>
                </div>
            )}
            {img && (
                <img src={img} className={styles.mockUp} />
            )}
            {icon && (
                <span className={styles.icon}>{icon}</span>
            )}
        </div>
    )
}