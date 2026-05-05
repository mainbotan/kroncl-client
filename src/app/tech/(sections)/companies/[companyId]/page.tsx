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
import { CompanyPricingPlan } from "@/apps/company/modules/pricing/types";

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
    const [pricing, setPricing] = useState<CompanyPricingPlan | null>(null);
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

                const [companyResponse, membersResponse, pricingResponse] = await Promise.all([
                    adminCompaniesApi.getCompanyById(companyId),
                    adminCompaniesApi.getCompanyAccounts(companyId, { page, limit }),
                    adminCompaniesApi.getCompanyPricingPlan(companyId)
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

                if (pricingResponse.status && pricingResponse.data) {
                    setPricing(pricingResponse.data);
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

    const companyFields = [
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

    const pricingFields = pricing ? [
        { label: 'Тарифный план', value: pricing.current_plan.name },
        { label: 'Код тарифа', value: pricing.current_plan.code },
        { label: 'Уровень', value: pricing.current_plan.lvl },
        { label: 'Цена в месяц', value: `${pricing.current_plan.price_per_month} ₽` },
        { label: 'Цена в год', value: `${pricing.current_plan.price_per_year} ₽` },
        { label: 'Лимит БД (MB)', value: pricing.current_plan.limit_db_mb },
        { label: 'Лимит объектов (MB)', value: pricing.current_plan.limit_objects_mb },
        { label: 'Лимит объектов (шт)', value: pricing.current_plan.limit_objects_count },
        { label: 'Триальный период', value: pricing.is_trial ? 'Да' : 'Нет' },
        { label: 'Дней до окончания', value: pricing.days_left },
        { label: 'Истекает', value: new Date(pricing.expires_at).toLocaleString() },
        ...(pricing.next_plan ? [
            { label: 'Следующий план', value: pricing.next_plan.name },
            { label: 'Код следующего плана', value: pricing.next_plan.code },
        ] : [])
    ] : [];

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
                        fields={companyFields}
                    />
                
                {pricingFields.length > 0 && (
                    <FieldsBlock
                        className={styles.fields}
                        fields={pricingFields}
                    />
                )}
                
            </div>
        </>
    );
}