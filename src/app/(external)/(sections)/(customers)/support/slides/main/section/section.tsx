import { PageBlockProps } from '@/app/(external)/_types';
import styles from './section.module.scss';
import clsx from 'clsx';
import Support from '@/assets/ui-kit/icons/support';
import Button, { ButtonProps } from '@/assets/ui-kit/button/button';
import React from 'react';
import { desc } from 'framer-motion/client';

export interface SectionProps extends PageBlockProps {
    icon?: React.ReactNode;
    capture: string;
    description?: string;
    actions?: ButtonProps[];
}

export function SectionCard({
    icon,
    capture,
    description,
    actions,
    className
}: SectionProps) {
    return (
        <div className={clsx(styles.card, className)}>
            <div className={styles.top}>
                {icon && (icon)}
                <span className={styles.capture}>{capture}</span>
            </div>
            {description && (
                <div className={styles.description}>
                    {description}
                </div>
            )}
            {actions && (
                <div className={styles.actions}>
                    {actions.map((action, index) => (
                        <Button 
                        variant='accent' 
                        className={styles.action} 
                        fullWidth 
                        key={index} 
                        {...action} />
                    ))}
                </div>
            )}
        </div>
    )
}