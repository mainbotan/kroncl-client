'use client';

import Button, { ButtonProps } from '@/assets/ui-kit/button/button';
import styles from './block.module.scss';
import clsx from 'clsx';

export interface Action {
    className?: string;
    icon?: React.ReactNode;
    title?: string;
    about?: string;
    action?: ButtonProps;
}

export interface ActionsBlockProps {
    className?: string;
    actions?: Action[];
}

export function ActionsBlock({
    className,
    actions
}:ActionsBlockProps) {
    return (
        <div className={clsx(styles.container, className)}>
            {actions?.map((action, index) => (
                <div key={index} className={styles.row}>
                    {action.icon && (<div className={styles.icon}>{action.icon}</div>)}
                    <div className={styles.info}>
                        {action.title && (<div className={styles.title}>{action.title}</div>)}
                        {action.about && (<div className={styles.about}>{action.about}</div>)}
                    </div>
                    <div className={styles.actions}>
                        {action.action && (
                            <Button className={clsx(styles.action, action.action.className)} {...action.action} />
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}