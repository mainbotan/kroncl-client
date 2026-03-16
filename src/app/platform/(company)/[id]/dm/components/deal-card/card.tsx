'use client';

import clsx from "clsx";
import styles from './card.module.scss';
import { EmployeeCard } from "../../../hrm/components/employee-card/card";
import { ClientCard } from "../../../crm/components/client-card/card";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Deal } from "@/apps/company/modules/dm/types";
import { formatDate } from "@/assets/utils/date";
import { TypeCard } from "../type-card/card";
import { useRef } from "react";
import Button from "@/assets/ui-kit/button/button";

export interface DealCardProps {
    deal: Deal;
    className?: string;
    compact?: boolean;
    disableLinks?: boolean;
    draggable?: boolean;
    onDragStart?: (e: React.DragEvent) => void;
    onDragEnd?: (e: React.DragEvent) => void;
}

export function DealCard({
    deal,
    className,
    compact = false,
    disableLinks = false,
    draggable = false,
    onDragStart,
    onDragEnd
}: DealCardProps) {
    const params = useParams();
    const companyId = params.id as string;
    const cardRef = useRef<HTMLDivElement>(null);

    const getDisplayId = () => {
        const shortId = deal.id.split('-')[0].toUpperCase();
        return `СД-${shortId}`;
    };

    const renderEmployeeLink = (employee: any) => {
        if (disableLinks) {
            return (
                <span className={styles.text}>
                    {employee.first_name} {employee.last_name || ''}
                </span>
            );
        }
        return (
            <Link 
                href={`/platform/${companyId}/hrm/${employee.id}`} 
                className={styles.link}
            >
                {employee.first_name} {employee.last_name || ''}
            </Link>
        );
    };

    const handleDragStart = (e: React.DragEvent) => {
        if (!draggable) return;
        
        // Устанавливаем прозрачность при перетаскивании
        e.dataTransfer.setDragImage(cardRef.current!, 0, 0);
        e.dataTransfer.effectAllowed = 'move';
        
        onDragStart?.(e);
    };

    return (
        <div 
            ref={cardRef}
            className={clsx(styles.deal, className)}
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
        >
            <div className={styles.info}>
                <div className={styles.date}>от {formatDate(deal.created_at)}</div>
                <div className={styles.title}>{getDisplayId()}</div>
            </div>

            {deal.comment && (
                <div className={styles.comment}>
                    {deal.comment}
                </div>
            )}
            
            {deal.type && (
                <TypeCard
                    variant='tag'
                    type={deal.type}
                    className={styles.type}
                />
            )}

            {deal.client && (
                <ClientCard 
                    className={styles.client}
                    variant="minimalistic"
                    client={deal.client}
                    disableLink={true}
                />
            )}

            {deal.employees && deal.employees.length > 0 && (
                <div className={styles.employees}>
                    <div className={styles.capture}>Ответственные</div>
                    <div className={styles.items}>
                        {deal.employees.map((employee) => (
                            <div key={employee.id}>
                                {renderEmployeeLink(employee)}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Button
                as='link'
                variant="accent"
                href={`/platform/${companyId}/dm/${deal.id}`}
                children='Открыть'
                className={styles.action}
            />
        </div>
    );
}