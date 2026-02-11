'use client';

import Button from '@/assets/ui-kit/button/button';
import styles from './page.module.scss';
import { IndicatorWidget } from './components/indicator-widget/widget';
import { TransactionCard } from './components/transaction-card/card';
import { transactionsMock } from './_transactions';
import { Timeline } from './components/timeline/timeline';
import { useState, useMemo, useEffect, useRef } from 'react';
import clsx from 'clsx';

export default function Page() {
    const [timelinePosition, setTimelinePosition] = useState<number | null>(null);
    const [itemHeight, setItemHeight] = useState(60); // начальная высота
    const transactionRef = useRef<HTMLDivElement>(null);

    // Сортируем транзакции от новых к старым
    const sortedTransactions = useMemo(() => {
        return [...transactionsMock].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, []);

    // Получаем реальную высоту транзакции
    useEffect(() => {
        const updateItemHeight = () => {
            if (transactionRef.current) {
                const rect = transactionRef.current.getBoundingClientRect();
                setItemHeight(rect.height);
            }
        };

        updateItemHeight();
        window.addEventListener('resize', updateItemHeight);
        
        return () => window.removeEventListener('resize', updateItemHeight);
    }, []);

    // Определяем индекс разделения на основе позиции таймлайна
    const splitIndex = useMemo(() => {
        if (timelinePosition === null) return -1;
        
        const total = sortedTransactions.length;
        // Позиционируем таймлайн между элементами
        const index = Math.floor((timelinePosition / 100) * (total + 1));
        return Math.max(-1, Math.min(total, index)); // -1 означает перед всеми
    }, [timelinePosition, sortedTransactions]);

    const handleTimelinePositionChange = (position: number) => {
        setTimelinePosition(position);
        console.log('Timeline position:', position, 'Split index:', splitIndex);
    };

    return (
        <>
            <div className={styles.head}>
                <div className={styles.base}>
                    <div className={styles.metaLine}>
                        <div className={styles.grid}>
                            <span className={styles.date}>
                                11 февраля 2026
                                {/* {timelinePosition !== null && (
                                    <span style={{ 
                                        width: '.4em', 
                                        height: '.4em', 
                                        borderRadius: '50%', 
                                        backgroundColor: 'var(--color-accent)',
                                        display: 'inline-block',
                                        marginLeft: '0.5em'
                                    }} />
                                )} */}
                            </span>
                        </div>
                    </div>
                    <div className={styles.indicators}>
                        <IndicatorWidget 
                            value={{
                                amount: 100290,
                                unit: '₽',
                            }}
                            legend='Ресурсы предприятия'
                            about='Казна организации - общий объём финансов, доступных для операций.'
                        />
                        <IndicatorWidget 
                            value={{
                                amount: 0,
                                unit: '₽',
                            }}
                            legend='Кредитная нагрузка'
                            size='sm'
                            variant='secondary'
                        />
                        <IndicatorWidget 
                            value={{
                                amount: 0
                            }}
                            legend='Операций'
                            size='sm'
                            variant='secondary'
                        />
                    </div>
                    <div className={styles.quickActions}>
                        <Button className={styles.action} variant='light'>
                            Расход
                        </Button>
                        <Button className={styles.action} variant='accent'>
                            Приход
                        </Button>
                    </div>
                </div>
                <div className={styles.actions}></div>
            </div>
            <div className={styles.body} style={{ position: 'relative' }}>
                <Timeline 
                    onPositionChange={handleTimelinePositionChange}
                    itemHeight={itemHeight}
                />
                
                {sortedTransactions.map((transaction, index) => (
                    <div 
                        key={index} 
                        ref={index === 0 ? transactionRef : null}
                        style={{
                            position: 'relative',
                            zIndex: splitIndex === index ? 5 : 1
                        }}
                    >
                        <TransactionCard 
                            {...transaction} 
                            className={clsx(styles.transaction, {
                                [styles.beforeSplit]: splitIndex !== -1 && index < splitIndex,
                                [styles.afterSplit]: splitIndex !== -1 && index >= splitIndex
                            })}
                        />
                        
                        {/* Визуальная линия при ховере таймлайна */}
                        {splitIndex === index && (
                            <div style={{
                                position: 'absolute',
                                top: '-1px',
                                left: 0,
                                right: 0,
                                height: '2px',
                                backgroundColor: 'transparent',
                                zIndex: 10,
                                pointerEvents: 'none'
                            }} />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}