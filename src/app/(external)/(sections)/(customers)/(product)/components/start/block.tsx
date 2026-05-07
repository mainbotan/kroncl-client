'use client';

import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import Button from '@/assets/ui-kit/button/button';
import Question from '@/assets/ui-kit/icons/question';
import Wallet from '@/assets/ui-kit/icons/wallet';
import { authLinks } from '@/config/links.config';
import React from 'react';

export interface StartBlockProps extends PageBlockProps {
    title: string;
    description: React.ReactNode;
    showActions?: boolean;
    showStats?: boolean;
}

export function StartBlock({
    className,
    title,
    description,
    showActions = true,
    showStats = true
}: StartBlockProps) {
    const isIncreaseTitle = title.length < 7;

    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.content}>    
                <div className={styles.info}>
                    <div className={clsx(styles.title, isIncreaseTitle && styles.increased)}>{title}</div>
                    <div className={styles.description}>{description}</div>
                </div>
                {showActions && (<div className={styles.actions}>
                    <Button 
                        className={styles.action} 
                        variant='contrast'
                        as='link'
                        href={authLinks.registration}
                        children='Начать работу'
                    />
                </div>)}
                {showStats && (<div className={styles.stats}>
                    <span className={styles.item}>
                        <span className={styles.primary}>∞</span> организаций
                    </span>
                    <span className={styles.item}>
                        <span className={styles.primary}>30 дней</span> бесплатно 
                    </span>
                    <span className={styles.item}>
                        <span className={styles.primary}>∞</span> сотрудников
                    </span>
                </div>)}
            </div>
            <svg className={styles.art} viewBox="0 0 708 231" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="84.286" y1="230.5" x2="353.286" y2="229.5" stroke="white"/>
            <line x1="353.286" y1="229.5" x2="622.286" y2="228.5" stroke="white"/>
            <line x1="353.016" y1="229.419" x2="62.0156" y2="40.4193" stroke="white"/>
            <line x1="353.016" y1="228.29" x2="644.205" y2="39.5804" stroke="white"/>
            <line x1="353.5" y1="229.709" x2="0.143952" y2="123.479" stroke="white"/>
            <line x1="353.127" y1="229.526" x2="707.127" y2="109.526" stroke="white"/>
            <line x1="352.788" y1="229" x2="352.788" y2="1" stroke="white"/>
            <line x1="352.866" y1="229.269" x2="206.866" y2="0.268795" stroke="white"/>
            <line x1="352.876" y1="228.361" x2="506.954" y2="4.71633" stroke="white"/>
            </svg>
        </div>
    )
}