'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from './page.module.scss';
import { FieldsBlock } from "@/app/tech/components/fields-block/block";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { adminCompaniesApi } from "@/apps/admin/companies/api";
import { AdminCompany, CompanyAccount } from "@/apps/admin/companies/types";
import { useAdminLevel } from "@/apps/admin/auth/hook";
import { ADMIN_LEVEL_3 } from "@/apps/admin/auth/types";
import { ActionsBlock } from "@/app/tech/components/actions-block/block";
import { CompanyMemberCard } from "../components/company-member-card/card";
import { PlatformPagination } from "@/app/platform/components/lib/pagination/pagination";
import { PlatformEmptyCanvas } from "@/app/platform/components/lib/empty-canvas/canvas";
import { usePagination } from "@/apps/shared/pagination/hooks/usePagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function CompanyPage() {
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const companyId = params.companyId as string;
    
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const allowPage = useAdminLevel(ADMIN_LEVEL_3);
    const [company, setCompany] = useState<AdminCompany | null>(null);
    const [members, setMembers] = useState<CompanyAccount[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!allowPage.allowed) return;
        
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const page = parseInt(searchParams.get('page') || '1');
                const limit = parseInt(searchParams.get('limit') || '20');

                const [companyResponse, membersResponse] = await Promise.all([
                    adminCompaniesApi.getCompanyById(companyId),
                    adminCompaniesApi.getCompanyAccounts(companyId, { page, limit })
                ]);

                if (companyResponse.status && companyResponse.data) {
                    setCompany(companyResponse.data);
                } else {
                    setError('Не удалось загрузить компанию');
                    return;
                }

                if (membersResponse.status && membersResponse.data) {
                    setMembers(membersResponse.data.accounts);
                    setTotal(membersResponse.data.pagination.total);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [companyId, allowPage.allowed, searchParams]);

    if (allowPage.isLoading || loading) return <PlatformLoading />;
    
    if (error) return <PlatformError error={error} />;

    if (!allowPage.allowed) return <PlatformError error="Доступ запрещён" />;

    if (!company) return <PlatformError error="Компания не найдена" />;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const pages = Math.ceil(total / limit);

    const fields = [
        { label: 'ID', value: company.id },
        { label: 'Slug', value: company.slug },
        { label: 'Название', value: company.name },
        { label: 'Описание', value: company.description || '—' },
        { label: 'Avatar URL', value: company.avatar_url || '—' },
        { label: 'Публичная', value: company.is_public ? 'Да' : 'Нет' },
        { label: 'Email', value: company.email || '—' },
        { label: 'Регион', value: company.region },
        { label: 'Сайт', value: company.site || '—' },
        { label: 'Статус хранилища', value: company.storage_status },
        { label: 'Хранилище готово', value: company.storage_ready ? 'Да' : 'Нет' },
        { label: 'Имя схемы', value: company.schema_name || '—' },
        { label: 'Создана', value: new Date(company.created_at).toLocaleString() },
        { label: 'Обновлена', value: new Date(company.updated_at).toLocaleString() },
    ];

    return (
        <>
            <PlatformHead
                title={company.name}
                description={company.slug}
            />
            <div className={styles.container}>
                <ActionsBlock
                    className={styles.actions}
                    actions={[
                        {
                            title: 'Открыть хранилище',
                            about: 'Просмотр схемы организации',
                            action: {
                                children: 'Открыть',
                                as: 'link',
                                href: `/tech/db/schemas/${company.schema_name}`
                            }
                        }
                    ]}
                />
                <div className={styles.members}>
                    <h3 className={styles.membersTitle}>Участники компании</h3>
                    {members.length === 0 ? (
                        <PlatformEmptyCanvas title="Нет участников" />
                    ) : (
                        <>
                            <div className={styles.items}>
                                {members.map((account) => (
                                    <CompanyMemberCard 
                                        key={account.account_id} 
                                        account={account} 
                                        className={styles.item} 
                                    />
                                ))}
                            </div>
                            {pages > 1 && (
                                <div className={styles.pagination}>
                                    <PlatformPagination
                                        meta={{
                                            total,
                                            page,
                                            limit,
                                            pages,
                                        }}
                                        baseUrl={pathname}
                                        onPageChange={(page) => handlePageChange(page)}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
                <FieldsBlock
                    className={styles.fields}
                    fields={fields}
                />
            </div>
        </>
    );
}