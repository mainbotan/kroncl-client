'use client';

import clsx from 'clsx';
import styles from './block.module.scss';
import { label } from 'framer-motion/client';

export interface Field {
    label: string;
    value?: string | number | boolean;
}

export interface FieldsBlockProps {
    className?: string;
    fields?: Field[];
}

export function FieldsBlock({
    className,
    fields
}: FieldsBlockProps) {
    return (
        <div className={clsx(styles.container, className)}>
            {fields?.map((field, index) => (
                <div key={index} className={styles.row}>
                    <div className={styles.label}>{field.label}</div>
                    <div className={styles.value}>{field.value ? field.value : 'Без значения'}</div>
                </div>
            ))}
        </div>
    )
}