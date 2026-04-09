'use client';

{/**
    это не оптимизированный пиздец
    с кучей n+1, молимся серверу на го    
*/}
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import Upload from '@/assets/ui-kit/icons/upload';
import { useParams, useSearchParams } from 'next/navigation';
import { EmployeesBlock } from './components/employees-block/block';
import { ClientBlock } from './components/client-block/block';
import { useState, useEffect } from 'react';
import { useDm, useHrm, useCrm } from '@/apps/company/modules';
import { Employee } from '@/apps/company/modules/hrm/types';
import { ClientDetail } from '@/apps/company/modules/crm/types';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';

export default function Page() {
    const params = useParams();
    const searchParams = useSearchParams();
    const companyId = params.id as string;
    const dealId = params.dealId as string;
    const section = searchParams.get('section');

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.DM_DEALS)
    const ALLOW_DEAL_UPDATE = usePermission(PERMISSIONS.DM_DEALS_UPDATE)
    const ALLOW_DEAL_DELETE = usePermission(PERMISSIONS.DM_DEALS_DELETE)

    const dmModule = useDm();
    const hrmModule = useHrm(); // Добавляем useHrm
    const crmModule = useCrm();
    const { showMessage } = useMessage();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deal, setDeal] = useState<any>(null);
    
    // Для сотрудников - ДВА стейта: ID и объекты
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]); // <- отдельный стейт для объектов
    
    // Для клиента
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [client, setClient] = useState<ClientDetail | null>(null);

    // Загружаем сделку
    useEffect(() => {
        const loadDeal = async () => {
            setLoading(true);
            try {
                const response = await dmModule.getDeal(dealId);
                
                if (response.status) {
                    setDeal(response.data);
                    
                    // Устанавливаем сотрудников из сделки
                    if (response.data.employees) {
                        const employeeList = response.data.employees;
                        setSelectedEmployeeIds(employeeList.map((e: Employee) => e.id));
                        setEmployees(employeeList); // <- сохраняем объекты
                    } else {
                        setSelectedEmployeeIds([]);
                        setEmployees([]);
                    }
                    
                    // Устанавливаем клиента из сделки
                    if (response.data.client) {
                        setSelectedClientId(response.data.client.id);
                        setClient(response.data.client);
                    } else {
                        setSelectedClientId(null);
                        setClient(null);
                    }
                }
            } catch (error) {
                showMessage({ label: 'Ошибка загрузки данных', variant: 'error' });
            } finally {
                setLoading(false);
            }
        };
        
        loadDeal();
    }, [dealId]);

    // Функция загрузки сотрудников по ID
    const loadEmployeesByIds = async (employeeIds: string[]) => {
        if (employeeIds.length === 0) {
            setEmployees([]);
            return;
        }

        try {
            // Загружаем всех сотрудников по IDs
            const employeePromises = employeeIds.map(id => hrmModule.getEmployee(id));
            const responses = await Promise.all(employeePromises);
            
            const validEmployees = responses
                .filter(res => res.status && res.data)
                .map(res => res.data!);
            
            setEmployees(validEmployees);
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    };

    // Функция загрузки клиента по ID
    const loadClientById = async (clientId: string) => {
        try {
            const response = await crmModule.getClient(clientId);
            if (response.status && response.data) {
                setClient(response.data);
            }
        } catch (error) {
            console.error('Error loading client:', error);
        }
    };

    // Обработчик выбора сотрудников
    const handleEmployeesSelect = (newEmployeeIds: string[]) => {
        setSelectedEmployeeIds(newEmployeeIds);
        
        if (newEmployeeIds.length > 0) {
            // Загружаем данные выбранных сотрудников
            loadEmployeesByIds(newEmployeeIds);
        } else {
            // Если никого не выбрали - очищаем
            setEmployees([]);
        }
    };

    // Обработчик выбора клиента
    const handleClientSelect = (clientId: string | null) => {
        setSelectedClientId(clientId);
        
        if (clientId) {
            loadClientById(clientId);
        } else {
            setClient(null);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await dmModule.updateDeal(dealId, {
                employees: selectedEmployeeIds,
                client_id: selectedClientId
            });

            if (response.status) {
                showMessage({
                    label: 'Сделка обновлена',
                    variant: 'success'
                });
                
                // Перезагружаем сделку чтобы получить актуальные данные
                const refreshedDeal = await dmModule.getDeal(dealId);
                if (refreshedDeal.status) {
                    setDeal(refreshedDeal.data);
                    
                    // Обновляем клиента из свежих данных
                    if (refreshedDeal.data.client) {
                        setSelectedClientId(refreshedDeal.data.client.id);
                        setClient(refreshedDeal.data.client);
                    } else {
                        setSelectedClientId(null);
                        setClient(null);
                    }
                    
                    // Обновляем сотрудников
                    if (refreshedDeal.data.employees) {
                        const employeeList = refreshedDeal.data.employees;
                        setSelectedEmployeeIds(employeeList.map((e: Employee) => e.id));
                        setEmployees(employeeList);
                    } else {
                        setSelectedEmployeeIds([]);
                        setEmployees([]);
                    }
                }
            } else {
                throw new Error(response.message || 'Ошибка обновления');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось обновить сделку',
                variant: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading || ALLOW_PAGE.isLoading) {
        <PlatformLoading />
    }

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.DM_DEALS} />
    )

    // Определяем, какие блоки показывать
    const showEmployees = section === 'employees';
    const showClient = section === 'client';

    return (
        <>
            <PlatformHead
                title={deal ? `СД-${deal.id.split('-')[0].toUpperCase()}` : 'Сделка'}
                description='Ведение сделки/заказа.'
                sections={[
                    {
                        label: 'Вся информация',
                        href: `/platform/${companyId}/dm/${dealId}`,
                        exact: true,
                        strongParams: true
                    },
                    {
                        label: 'Ответственные',
                        href: `/platform/${companyId}/dm/${dealId}?section=employees`,
                        strongParams: true
                    },
                    {
                        label: 'Клиент',
                        href: `/platform/${companyId}/dm/${dealId}?section=client`,
                        strongParams: true
                    },
                    {
                        label: 'Состав',
                        href: `/platform/${companyId}/dm/${dealId}?section=positions`,
                        strongParams: true
                    }
                ]}
                actions={[
                    {
                        icon: <Upload />,
                        variant: 'accent',
                        children: saving ? 'Сохранение...' : 'Сохранить',
                        onClick: handleSave,
                        disabled: saving
                    }
                ]}
            />
            <div className={styles.body}>
                {showEmployees && (
                    <EmployeesBlock 
                        className={styles.block}
                        selectedIds={selectedEmployeeIds}
                        onSelect={handleEmployeesSelect} // <- используем новый обработчик
                        employees={employees} // <- передаём отдельный стейт с объектами
                        disabled={saving}
                    />
                )}
                {showClient && (
                    <ClientBlock 
                        className={styles.block}
                        selectedId={selectedClientId}
                        onSelect={handleClientSelect}
                        client={client}
                        disabled={saving}
                    />
                )}
            </div>
        </>
    );
}