'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Button from "@/assets/ui-kit/button/button";
import Input from "@/assets/ui-kit/input/input";
import { useParams, useSearchParams, usePathname, useRouter } from "next/navigation";
import styles from './layout.module.scss';
import { useEffect, useState } from "react";
import { usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";

interface PlatformLayoutProps {
  children: React.ReactNode;
}

export default function AnalysisLayout({ children }: PlatformLayoutProps) {
    const params = useParams();
    const companyId = params.id as string;
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.DM_ANALYSIS)
    
    const [localStartDate, setLocalStartDate] = useState(searchParams.get('start_date') || '');
    const [localEndDate, setLocalEndDate] = useState(searchParams.get('end_date') || '');

    useEffect(() => {
        setLocalStartDate(searchParams.get('start_date') || '');
        setLocalEndDate(searchParams.get('end_date') || '');
    }, [searchParams]);

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (localStartDate) {
            params.set('start_date', localStartDate);
        } else {
            params.delete('start_date');
        }
        if (localEndDate) {
            params.set('end_date', localEndDate);
        } else {
            params.delete('end_date');
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const buildSectionLink = (baseLink: string): string => {
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');
        
        const params = new URLSearchParams();
        if (startDate) params.set('start_date', startDate);
        if (endDate) params.set('end_date', endDate);
        
        const queryString = params.toString();
        return queryString ? `${baseLink}?${queryString}` : baseLink;
    };

    if (ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    )

    if (!ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.DM_ANALYSIS} />
    )

    return (
        <>
            <PlatformHead
                title='Анализ сделок'
                description='Распределение по сотрудникам, типам, статусам, дням, основные счётчики заказов. Доходы/расходы сделок.'
                sections={[
                    {
                        label: 'Главная',
                        exact: true,
                        href: buildSectionLink(`/platform/${companyId}/dm/analysis`)
                    },
                    {
                        label: 'По сотрудникам',
                        href: buildSectionLink(`/platform/${companyId}/dm/analysis/employees`)
                    },
                    {
                        label: 'По типам',
                        href: buildSectionLink(`/platform/${companyId}/dm/analysis/types`)
                    },
                    {
                        label: 'По клиентам',
                        href: buildSectionLink(`/platform/${companyId}/dm/analysis/clients`)
                    }
                ]}
            >
                <div className={styles.control}>
                    <Input
                        className={styles.input} 
                        type='date' 
                        placeholder='Начало анализа' 
                        value={localStartDate}
                        onChange={(e) => setLocalStartDate(e.target.value)}
                    />
                    <Input 
                        className={styles.input} 
                        type='date' 
                        placeholder='Конец периода'
                        value={localEndDate}
                        onChange={(e) => setLocalEndDate(e.target.value)}
                    />
                    <Button className={styles.action} variant='accent' onClick={handleApply}>
                        Применить
                    </Button>
                </div>    
            </PlatformHead>
            {children}
        </>
    );
}