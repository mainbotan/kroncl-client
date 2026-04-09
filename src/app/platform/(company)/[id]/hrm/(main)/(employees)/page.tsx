'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Plus from "@/assets/ui-kit/icons/plus";
import styles from './page.module.scss';
import { EmployeeCard } from "../../components/employee-card/card";
import { useHrm } from '@/apps/company/modules';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { useEffect, useState } from 'react';
import { EmployeesResponse } from '@/apps/company/modules/hrm/types';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Employee } from '@/apps/company/modules/hrm/types';
import { sections } from "../_sections";
import { PlatformEmptyCanvas } from "@/app/platform/components/lib/empty-canvas/canvas";
import Team from "@/assets/ui-kit/icons/team";
import { usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";

export default function Page() {
    // meta
    const params = useParams();
    const companyId = params.id as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.HRM);
    const ALLOW_CREATE_EMPLOYEE = usePermission(PERMISSIONS.HRM_EMPLOYEES_CREATE);
    
    // hrm logic
    const hrmModule = useHrm();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const [data, setData] = useState<EmployeesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = (searchValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (searchValue.trim()) {
            params.set('search', searchValue);
            params.set('page', '1');
        } else {
            params.delete('search');
        }
        
        router.push(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        loadData();
    }, [searchParams]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');
            const search = searchParams.get('search');

            const response = await hrmModule.getEmployees({
                page,
                limit,
                search: search || undefined
            });
            
            if (response.status) {
                setData(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading employees:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.HRM} />
    )
    
    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );
    
    if (error) return (
        <PlatformError error={error} />
    );

    const employees = data?.employees || [];
    const pagination = data?.pagination;

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;

    return (
        <>
            <PlatformHead
                title="Сотрудники"
                description="Бизнес начинается с команды."
                actions={(ALLOW_CREATE_EMPLOYEE.allowed && !ALLOW_CREATE_EMPLOYEE.isLoading) ? [{
                    children: 'Создать',
                    variant: 'accent',
                    icon: <Plus />,
                    as: 'link',
                    href: `/platform/${companyId}/hrm/new`
                }] : undefined}
                sections={sections(companyId)}
                searchProps={{
                    placeholder: 'Поиск по сотрудникам',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                showSearch
            />
            {employees.length === 0 ? (
                <PlatformEmptyCanvas
                    title='В штате сотрудников пусто.'
                    icon={<Team />} />
            ) : (
                <>
                <div className={styles.grid}>
                    {employees.map((employee: Employee) => (
                        <EmployeeCard key={employee.id} employee={employee} />
                    ))}
                </div>
                {pagination && pagination.pages > 1 && (
                    <div className={styles.pagination}>
                        <PlatformPagination
                            meta={pagination}
                            baseUrl={pathname}
                            queryParams={queryParams}
                            onPageChange={(page) => handlePageChange(page)}
                        />
                    </div>
                )}
                </>
            )}
        </>
    );
}