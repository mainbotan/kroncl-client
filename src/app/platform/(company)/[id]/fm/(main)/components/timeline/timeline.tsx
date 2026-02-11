'use client';

import clsx from 'clsx';
import styles from './timeline.module.scss';
import { useState, useRef, useEffect } from 'react';

export interface TimelineProps {
    className?: string;
    onPositionChange?: (position: number) => void;
    itemHeight?: number; // высота одной транзакции
}

export function Timeline({
    className,
    onPositionChange,
    itemHeight = 60 // примерная высота TransactionCard
}: TimelineProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState(0); // позиция в пикселях
    const timelineRef = useRef<HTMLDivElement>(null);
    const startYRef = useRef(0);
    const startPositionRef = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        startYRef.current = e.clientY;
        startPositionRef.current = position;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !timelineRef.current) return;

        const deltaY = e.clientY - startYRef.current;
        const parentElement = timelineRef.current.parentElement;
        
        if (!parentElement) return;
        
        const parentRect = parentElement.getBoundingClientRect();
        const maxPosition = parentRect.height;
        
        let newPosition = startPositionRef.current + deltaY;
        newPosition = Math.max(0, Math.min(maxPosition, newPosition));
        
        // Привязываем к сетке (между транзакциями)
        const snappedPosition = snapToGrid(newPosition, itemHeight);
        
        const percentage = (snappedPosition / maxPosition) * 100;
        
        setPosition(snappedPosition);
        onPositionChange?.(percentage);
    };

    const snapToGrid = (position: number, gridSize: number): number => {
        // Привязываем к границам между элементами (не в середине)
        const gridPosition = Math.round(position / gridSize) * gridSize;
        return Math.max(0, gridPosition - gridSize ); // смещаем между элементами
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    useEffect(() => {
        if (isDragging) {
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        } else {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    }, [isDragging]);

    return (
        <div 
            ref={timelineRef}
            className={clsx(styles.timeline, className)}
            style={{
                position: 'absolute',
                top: `${position}px`,
                width: '100%',
                cursor: isDragging ? 'grabbing' : 'default',
                zIndex: 10
            }}
        >
            <div 
                className={clsx(styles.trigger, { [styles.dragging]: isDragging })}
                onMouseDown={handleMouseDown}
                onDragStart={(e) => e.preventDefault()}
            />
        </div>
    );
}