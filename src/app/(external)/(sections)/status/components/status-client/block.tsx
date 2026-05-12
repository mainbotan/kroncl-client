'use client';

import { useEffect, useState } from 'react';
import styles from '../../page.module.scss';
import { GridBlock } from '../grid-block/block';
import { statusApi } from '@/apps/status/api';
import { SystemStatusResponse, DailyStatus } from '@/apps/status/types';
import clsx from 'clsx';
import Spinner from '@/assets/ui-kit/spinner/spinner';

export function StatusClient() {
    const [data, setData] = useState<SystemStatusResponse | null>(null);
    const [selectedAllDay, setSelectedAllDay] = useState<DailyStatus | null>(null);
    const [selectedServerDay, setSelectedServerDay] = useState<DailyStatus | null>(null);
    const [selectedStorageDay, setSelectedStorageDay] = useState<DailyStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await statusApi.getSystemStatus(30);
                if (response.status && response.data) {
                    setData(response.data);
                    
                    const allDays = response.data.components.all;
                    // всегда последний день, а не последний с инцидентами
                    if (allDays.length > 0) {
                        setSelectedAllDay(allDays[allDays.length - 1]);
                    }
                    
                    if (response.data.components.server.length > 0) {
                        setSelectedServerDay(response.data.components.server[response.data.components.server.length - 1]);
                    }
                    if (response.data.components.storage.length > 0) {
                        setSelectedStorageDay(response.data.components.storage[response.data.components.storage.length - 1]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch system status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    if (loading) {
        return (
            <div className={clsx(styles.block, styles.loading, styles.stat)}>
                <Spinner variant='accent' size='lg' />
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <>
            <GridBlock
                title='Все компоненты (30 дней)'
                className={clsx(styles.block, styles.stat)}
                days={data.components.all}
                selectedDay={selectedAllDay}
                onDayClick={setSelectedAllDay}
            />
            <GridBlock
                title='Сервер (30 дней)'
                className={clsx(styles.block, styles.stat)}
                days={data.components.server}
                selectedDay={selectedServerDay}
                onDayClick={setSelectedServerDay}
            />
            <GridBlock
                title='Хранилище данных (30 дней)'
                className={clsx(styles.block, styles.stat)}
                days={data.components.storage}
                selectedDay={selectedStorageDay}
                onDayClick={setSelectedStorageDay}
            />
        </>
    );
}