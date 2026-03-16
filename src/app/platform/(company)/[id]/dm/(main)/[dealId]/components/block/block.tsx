'use client';

import Button, { ButtonProps } from '@/assets/ui-kit/button/button';
import styles from './block.module.scss';
import clsx from 'clsx';

export interface DealBlockProps {
    className?: string;
    title?: string;
    description?: string;
    children?: React.ReactNode;
    actions?: ButtonProps[];
}

export function DealBlock({
    className,
    title,
    description,
    children,
    actions
}: DealBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            {title && (<div className={styles.title}>{title}</div>)}
            {description && (<div className={styles.description}>{description}</div>)}
            {children && children}
            <div className={styles.actions}>
                {actions?.map((action, index) => (
                    <Button key={index} className={clsx(styles.action, action.className)} {...action} />
                ))}
            </div>
        </div>
    )
}