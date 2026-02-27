'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useCrm } from "@/apps/company/modules";
import { ClientSource } from "@/apps/company/modules/crm/types";
import Edit from "@/assets/ui-kit/icons/edit";
import Exit from "@/assets/ui-kit/icons/exit";
import Spinner from "@/assets/ui-kit/spinner/spinner";
import { formatDate } from "@/assets/utils/date";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PlatformModal } from "@/app/platform/components/lib/modal/modal";
import { PlatformModalConfirmation } from "@/app/platform/components/lib/modal/confirmation/confirmation";
import { useMessage } from "@/app/platform/components/lib/message/provider";
import { motion } from 'framer-motion';
import { getSourceTypeLabel } from "./_utils";
import styles from './page.module.scss';
import { ClientCard } from "../../components/client-card/card";
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { ClientsResponse, ClientDetail } from '@/apps/company/modules/crm/types';
import { sectionsList } from "../_sections";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const sourceId = params.sourceId as string;
    const crmModule = useCrm();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { showMessage } = useMessage();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const [source, setSource] = useState<ClientSource | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalDeactivateOpen, setIsModalDeactivateOpen] = useState(false);
    const [isModalActivateOpen, setIsModalActivateOpen] = useState(false);
    
    // данные клиентов
    const [clientsData, setClientsData] = useState<ClientsResponse | null>(null);
    const [clientsLoading, setClientsLoading] = useState(true);

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

    // загрузка данных источника
    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!sourceId) return;
            
            setLoading(true);
            setError(null);
            try {
                const response = await crmModule.getSource(sourceId);
                
                if (!isMounted) return;
                
                if (response.status) {
                    setSource(response.data);
                } else {
                    setError("Не удалось загрузить данные источника");
                }
            } catch (err) {
                if (!isMounted) return;
                
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error(`Error loading source ${sourceId}:`, err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        
        fetchData();
        
        return () => {
            isMounted = false;
        };
    }, [sourceId]);

    // загрузка клиентов источника
    useEffect(() => {
        const loadClients = async () => {
            if (!sourceId) return;
            
            setClientsLoading(true);
            try {
                const page = parseInt(searchParams.get('page') || '1');
                const limit = parseInt(searchParams.get('limit') || '20');
                const search = searchParams.get('search') || undefined;
                const type = searchParams.get('type') as any;
                const status = searchParams.get('status') as any;

                const response = await crmModule.getClients({
                    page,
                    limit,
                    search,
                    type,
                    status,
                    sourceId    // привязываемся к источнику
                });
                
                if (response.status) {
                    setClientsData(response.data);
                }
            } catch (err) {
                console.error('Error loading clients:', err);
            } finally {
                setClientsLoading(false);
            }
        };

        loadClients();
    }, [sourceId, searchParams]);

    const handleDeactivate = async () => {
        try {
            await crmModule.deactivateSource(source!.id);
            showMessage({
                label: 'Источник деактивирован.',
                variant: 'success'
            });
            setIsModalDeactivateOpen(false);
            // Обновляем данные источника
            const response = await crmModule.getSource(sourceId);
            if (response.status) {
                setSource(response.data);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Внутренняя ошибка системы.';
            showMessage({
                label: 'Не удалось деактивировать источник.',
                variant: 'error',
                about: errorMessage
            });
        }
    };

    const handleActivate = async () => {
        try {
            await crmModule.activateSource(source!.id);
            showMessage({
                label: 'Источник активирован.',
                variant: 'success'
            });
            setIsModalActivateOpen(false);
            // Обновляем данные источника
            const response = await crmModule.getSource(sourceId);
            if (response.status) {
                setSource(response.data);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Внутренняя ошибка системы.';
            showMessage({
                label: 'Не удалось активировать источник.',
                variant: 'error',
                about: errorMessage
            });
        }
    };

    if (loading) return (
        <motion.div 
            style={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: ".7em", 
                color: "var(--color-text-description)", 
                minHeight: "10rem"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Spinner />
        </motion.div>
    );
    
    if (error) return (
        <motion.div 
            style={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: ".7em", 
                color: "var(--color-text-description)", 
                minHeight: "10rem"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {error}
        </motion.div>
    );

    if (!source) return (
        <motion.div 
            style={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: ".7em", 
                color: "var(--color-text-description)", 
                minHeight: "10rem"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            Не удалось загрузить источник
        </motion.div>
    );

    const isActive = source.status === 'active';
    const typeLabel = getSourceTypeLabel(source.type);

    const actions = [
        {
            children: 'Редактировать',
            icon: <Edit />,
            variant: 'accent' as const,
            as: 'link' as const,
            href: `/platform/${companyId}/crm/sources/${sourceId}/edit`
        }
    ];

    if (isActive) {
        actions.push({
            children: 'Деактивировать',
            icon: <Exit />,
            variant: 'light',
            onClick: () => setIsModalDeactivateOpen(true)
        });
    } else {
        actions.push({
            children: 'Активировать',
            icon: <Exit />,
            variant: 'accent',
            onClick: () => setIsModalActivateOpen(true)
        });
    }

    const clients = clientsData?.clients || [];
    const pagination = clientsData?.pagination;

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;
    const typeParam = searchParams.get('type');
    if (typeParam) queryParams.type = typeParam;
    const statusParam = searchParams.get('status');
    if (statusParam) queryParams.status = statusParam;

    return (
        <>
            <PlatformHead
                title={source.name}
                description={`Источник трафика. Создан ${formatDate(source.created_at)} Статус: ${isActive ? 'активен' : 'неактивен'}.`}
                actions={actions}
                searchProps={{
                    placeholder: 'Поиск по клиентам источника',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                showSearch
            />

            {clientsLoading ? (
                <div style={{
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: ".7em", 
                    color: "var(--color-text-description)", 
                    minHeight: "10rem"
                }}>
                    <Spinner />
                </div>
            ) : clients.length === 0 ? (
                <div style={{
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: ".7em", 
                    color: "var(--color-text-description)", 
                    minHeight: "10rem"
                }}>
                    Источник пока не привлёк ни одного клиента
                </div>
            ) : (
                <>
                    <div className={styles.grid}>
                        {clients.map((client: ClientDetail) => (
                            <ClientCard key={client.id} client={client} />
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

            {/* modal deactivate */}
            <PlatformModal
                isOpen={isModalDeactivateOpen}
                onClose={() => setIsModalDeactivateOpen(false)}
            >
                <PlatformModalConfirmation
                    title='Деактивировать источник?'
                    description='Источник будет деактивирован. Клиенты, привязанные к этому источнику, сохранят свои данные, но новые клиенты не смогут быть привязаны.'
                    actions={[
                        {
                            children: 'Отмена', 
                            variant: 'light', 
                            onClick: () => setIsModalDeactivateOpen(false)
                        },
                        {
                            variant: "accent", 
                            onClick: handleDeactivate,
                            children: 'Деактивировать'
                        }
                    ]}
                />
            </PlatformModal>

            {/* modal activate */}
            <PlatformModal
                isOpen={isModalActivateOpen}
                onClose={() => setIsModalActivateOpen(false)}
            >
                <PlatformModalConfirmation
                    title='Активировать источник?'
                    description='Источник будет активирован. Клиенты смогут привязываться к этому источнику.'
                    actions={[
                        {
                            children: 'Отмена', 
                            variant: 'light', 
                            onClick: () => setIsModalActivateOpen(false)
                        },
                        {
                            variant: "accent", 
                            onClick: handleActivate,
                            children: 'Активировать'
                        }
                    ]}
                />
            </PlatformModal>
        </>
    );
}