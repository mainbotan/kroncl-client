'use client';

import clsx from "clsx";
import styles from './block.module.scss';
import { DailyStatus, Incident } from '@/apps/status/types';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import { formatDate, formatTime } from "@/assets/utils/date";

export interface GridBlockProps {
    className?: string;
    title: string;
    days: DailyStatus[];
    selectedDay?: DailyStatus | null;
    onDayClick?: (day: DailyStatus) => void;
}

export const statusColors: Record<string, string> = {
    operational: styles.normal,
    degraded: styles.minor,
    partial_outage: styles.major,
    major_outage: styles.critical,
};

export const statusLabels: Record<string, string> = {
    operational: 'Система стабильна',
    degraded: 'Деградация',
    partial_outage: 'Частичный сбой',
    major_outage: 'Крупный сбой',
};

export function GridBlock({
    className,
    title,
    days,
    selectedDay,
    onDayClick
}: GridBlockProps) {
    const today = new Date().toISOString().split('T')[0];

    const getDayStatusColor = (day: DailyStatus): string => {
        return statusColors[day.status] || styles.normal;
    };

    const getTooltipText = (day: DailyStatus): string => {
        if (!day.incidents || day.incidents.length === 0) {
            return statusLabels[day.status];
        }
        return day.incidents.map(i => i.title).join('\n');
    };

    const displayedDay = selectedDay || (days.length > 0 ? days[days.length - 1] : null);

    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.title}>{title}</div>
            <div className={styles.grid}>
                {days.map((day, idx) => (
                    <ModalTooltip key={idx} content={getTooltipText(day)}>
                        <span
                            className={clsx(
                                styles.col,
                                getDayStatusColor(day),
                                day.date === today && styles.today
                            )}
                            onClick={() => onDayClick?.(day)}
                            style={{ cursor: onDayClick ? 'pointer' : 'default' }}
                        />
                    </ModalTooltip>
                ))}
            </div>

            {displayedDay && (
                <div className={styles.block}>
                    <div className={styles.head}>
                        {new Date(displayedDay.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className={styles.items}>
                        <div className={clsx(styles.item, statusColors[displayedDay.status])}>
                            {statusLabels[displayedDay.status]}
                        </div>
                        {displayedDay.incidents?.map((incident: Incident) => (
                            <div key={incident.id} className={clsx(styles.item, statusColors[incident.severity === 'major' ? 'major_outage' : 'degraded'])}>
                                <div className={styles.id}>{incident.id}</div>
                                <div className={styles.time}>{formatTime(incident.start_time, true)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}