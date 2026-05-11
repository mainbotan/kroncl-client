'use client';

import clsx from 'clsx';
import styles from './panel.module.scss';
import { useDevSidebar } from './context/context';

export interface DevPanelProps {
    className?: string;
}

export function DevPanel({
    className
}: DevPanelProps) {
    const { isOpen, close } = useDevSidebar();

    return (
        <div className={clsx(styles.container, isOpen && styles.opened, className)}>
            
        </div>
    )
}