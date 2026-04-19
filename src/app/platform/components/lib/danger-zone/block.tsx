'use client';

import Button, { ButtonProps } from '@/assets/ui-kit/button/button';
import styles from './block.module.scss';
import clsx from 'clsx';

export interface PlatformDangerZoneItem {
    title: string;
    description?: string;
    actions: ButtonProps[];
}

export interface PlatformDangerZoneProps {
    className?: string;
    title?: string;
    description?: string;
    items: PlatformDangerZoneItem[];
}

export function PlatformDangerZone({
    className,
    title = 'Красная зона',
    description,
    items
}: PlatformDangerZoneProps) {
    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.head}>
                <div className={styles.title}>{title}</div>
                {description && (<div className={styles.description}>{description}</div>)}
            </div>
            <div className={styles.sections}>
                {items.map((item, index) => (
                    <div className={styles.section} key={index}>
                        <div className={styles.info}>
                            <div className={styles.name}>{item.title}</div>
                            {item.description && (<div className={styles.description}>{item.description}</div>)}
                        </div>
                        <div className={styles.actions}>
                            {item.actions.map((action, index) => (
                                <Button className={clsx(styles.action, action.className)} {...action} key={index} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.footer}>Будьте осторожны, действия могут быть необратимы.</div>
        </div>
    )
}