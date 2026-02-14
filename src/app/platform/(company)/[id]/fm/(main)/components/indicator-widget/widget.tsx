'use client';

import Upload from '@/assets/ui-kit/icons/upload';
import styles from './widget.module.scss';
import React from 'react';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import clsx from 'clsx';
import Spinner from '@/assets/ui-kit/spinner/spinner';

export interface IndicatorWidgetValue {
    amount: number;
    unit?: React.ReactNode;
    icon?: React.ReactNode;
}

export interface IndicatorWidgetProps {
    value?: IndicatorWidgetValue;
    legend?: string;
    about?: string;
    size?: 'sm' | 'md' | 'lg',
    variant?: 'normal' | 'empty' | 'accent' | 'secondary',
    loading?: boolean;
}

export function IndicatorWidget({
    value,
    legend,
    about,
    size = 'md',
    variant = 'normal',
    loading
}: IndicatorWidgetProps) {

    const renderContent = () => {
        return (
            <div className={clsx(styles.widget, styles[size], styles[variant])}>
                <div className={styles.value}>
                    {loading && (
                        <Spinner variant='accent' size='sm' />
                    )}
                    <span className={clsx(
                        styles.amount,
                        value?.amount && value.amount < 0 && styles.negative
                    )}>
                        {value?.amount?.toLocaleString('ru-RU')}
                    </span>
                    {value?.unit && <span className={styles.unit}>{value?.unit}</span>}
                    {value?.icon && <span className={styles.icon}>{value?.icon}</span>}
                </div>
                {loading ? (<div></div>) : legend && <div className={styles.legend}>{legend}</div>}
            </div>
        )
    }

    if (about) {
        return (
            <ModalTooltip side='bottom' content={about}>
                {renderContent()}
            </ModalTooltip>
        )
    }
    return renderContent();
}