'use client';

import clsx from "clsx";
import styles from './card.module.scss';
import { EmployeeCard } from "../../../hrm/components/employee-card/card";
import { ClientCard } from "../../../crm/components/client-card/card";
import Link from "next/link";

export interface DealCardProps {
    className?: string;
    compact?: boolean;
}

export function DealCard({
    className,
    compact = false
}: DealCardProps) {
    return (
        <div className={clsx(styles.deal, className)}>
            <div className={styles.info}>
                <div className={styles.date}>от 12 марта, 2026</div>
                <div className={styles.title}>СД-0323020</div>
            </div>
            <ClientCard className={styles.client}
                variant="minimalistic"
                client={{
                    phone: null,
                    status: 'active',
                    created_at: '2026-03-11T20:48:57.873634Z',
                    updated_at: '2026-03-11T20:48:57.873634Z',
                    metadata: null,
                    type: 'individual',
                    comment: null,
                    email: null,
                    patronymic: null,
                    first_name: 'Хуила',
                    last_name: 'Клиен aslkdjlakjsdlk jasdт',
                    id: 'c2bdb048-5a69-4dac-b429-97958ae5aebc',
                    source: {
                        id: 'c2bdb048-5a69-4dac-b429-97958ae5aebc',
                        created_at: '2026-03-11T20:48:57.873634Z',
                        comment: null,
                        name: 'Авито',
                        url: null,
                        type: 'organic',
                        system: false,
                        metadata: null,
                        updated_at: 'c2bdb048-5a69-4dac-b429-97958ae5aebc',
                        status: 'active'
                    }
                }}
            />
            <div className={styles.employees}>
                <div className={styles.capture}>Ответственные</div>
                <div className={styles.items}>
                    <Link href='/' className={styles.link}>Серафим Недошивин</Link>
                    <Link href='/' className={styles.link}>Виктор Большая залупа</Link>
                </div>
            </div>
            <div className={styles.comment}>
                No code of conduct
                No contribution guidelines
                No issue template
                No pull request template
            </div>
        </div>
    )
}