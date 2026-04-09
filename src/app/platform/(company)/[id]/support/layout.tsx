'use client';

import React from 'react';
import styles from './layout.module.scss';
import { TicketCard } from './components/ticket-card/card';
import Button from '@/assets/ui-kit/button/button';
import Edit from '@/assets/ui-kit/icons/edit';
import { useParams } from 'next/navigation';
import { Panel } from './components/panel/panel';
import { usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';

export default function Layout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.SUPPORT_TICKETS);
    const ALLOW_CREATE_TICKET = usePermission(PERMISSIONS.SUPPORT_TICKETS_CREATE);
    
    if (ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    )

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.SUPPORT_TICKETS} />
    )

    return (
        <div className={styles.container}>
            <Panel className={styles.panel} />
            <div className={styles.content}>{children}</div>
        </div>
    )
}