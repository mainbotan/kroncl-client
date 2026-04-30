'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { EmployeesBlock } from './components/employees-block/block';
import { ClientBlock } from './components/client-block/block';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDm, useHrm, useCrm } from '@/apps/company/modules';
import { Employee } from '@/apps/company/modules/hrm/types';
import { ClientDetail } from '@/apps/company/modules/crm/types';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { isAllowed, usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';
import { StructureBlock } from './components/structure-block/block';
import { Deal, DealPosition, DealStatus, DealType } from '@/apps/company/modules/dm/types';
import { OverviewBlock } from './components/overview-block/block';
import { FinanceBlock } from './components/finance-block/block';
import { DOCS_LINK_DM_DEALS } from '@/app/docs/(v1)/internal.config';

export default function Page() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const companyId = params.id as string;
    const dealId = params.dealId as string;
    const section = searchParams.get('section');

    const ALLOW_PAGE = usePermission(PERMISSIONS.DM_DEALS);
    const ALLOW_DEAL_UPDATE = usePermission(PERMISSIONS.DM_DEALS_UPDATE);

    const dmModule = useDm();
    const hrmModule = useHrm();
    const crmModule = useCrm();
    const { showMessage } = useMessage();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deal, setDeal] = useState<Deal | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const initialDataRef = useRef<{
        statusId: string | null;
        typeId: string | null;
        comment: string | null;
        employeeIds: string[];
        clientId: string | null;
        positions: DealPosition[];
    } | null>(null);

    const [currentStatus, setCurrentStatus] = useState<DealStatus | null>(null);
    const [currentType, setCurrentType] = useState<DealType | null>(null);
    const [currentComment, setCurrentComment] = useState<string | null>(null);
    const [statuses, setStatuses] = useState<DealStatus[]>([]);
    const [types, setTypes] = useState<DealType[]>([]);

    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [client, setClient] = useState<ClientDetail | null>(null);

    const [positions, setPositions] = useState<DealPosition[]>([]);

    const checkChanges = useCallback(() => {
        if (!initialDataRef.current) return false;

        const initial = initialDataRef.current;

        // Статус
        if (currentStatus?.id !== initial.statusId) return true;

        // Тип
        if (currentType?.id !== initial.typeId) return true;

        // Комментарий
        if (currentComment !== initial.comment) return true;

        // Сотрудники
        const currentEmployeeIdsSorted = [...selectedEmployeeIds].sort();
        const initialEmployeeIdsSorted = [...initial.employeeIds].sort();
        if (currentEmployeeIdsSorted.join(',') !== initialEmployeeIdsSorted.join(',')) return true;

        // Клиент
        if (selectedClientId !== initial.clientId) return true;

        // Позиции — сравниваем по содержимому, а не только по ID
        const currentPositionsNormalized = positions.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            quantity: p.quantity,
            unit: p.unit,
            unit_id: p.unit_id,
            position_id: p.position_id
        }));
        const initialPositionsNormalized = initial.positions.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            quantity: p.quantity,
            unit: p.unit,
            unit_id: p.unit_id,
            position_id: p.position_id
        }));

        const currentPositionsJson = JSON.stringify(currentPositionsNormalized.sort((a, b) => a.id.localeCompare(b.id)));
        const initialPositionsJson = JSON.stringify(initialPositionsNormalized.sort((a, b) => a.id.localeCompare(b.id)));

        if (currentPositionsJson !== initialPositionsJson) return true;

        return false;
    }, [currentStatus, currentType, currentComment, selectedEmployeeIds, selectedClientId, positions]);

    useEffect(() => {
        setHasChanges(checkChanges());
    }, [checkChanges]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasChanges]);

    useEffect(() => {
        const loadDeal = async () => {
            setLoading(true);
            try {
                const response = await dmModule.getDeal(dealId);

                if (response.status) {
                    const dealData = response.data;
                    setDeal(dealData);

                    const employeeList = dealData.employees || [];
                    setSelectedEmployeeIds(employeeList.map((e: Employee) => e.id));
                    setEmployees(employeeList);

                    if (dealData.client) {
                        setSelectedClientId(dealData.client.id);
                        setClient(dealData.client);
                    } else {
                        setSelectedClientId(null);
                        setClient(null);
                    }

                    const positionsList = dealData.positions || [];
                    setPositions(positionsList);

                    const status = dealData.status || null;
                    const type = dealData.type || null;
                    const comment = dealData.comment || null;

                    setCurrentStatus(status);
                    setCurrentType(type);
                    setCurrentComment(comment);

                    initialDataRef.current = {
                        statusId: status?.id || null,
                        typeId: type?.id || null,
                        comment: comment,
                        employeeIds: employeeList.map((e: Employee) => e.id),
                        clientId: dealData.client?.id || null,
                        positions: positionsList
                    };
                }
            } catch (error) {
                showMessage({ label: 'Ошибка загрузки данных', variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        const loadMeta = async () => {
            try {
                const [statusesRes, typesRes] = await Promise.all([
                    dmModule.getDealStatuses({ limit: 100 }),
                    dmModule.getDealTypes({ limit: 100 })
                ]);

                if (statusesRes.status) {
                    setStatuses(statusesRes.data.statuses.sort((a, b) => a.sort_order - b.sort_order));
                }

                if (typesRes.status) {
                    setTypes(typesRes.data.deal_types);
                }
            } catch (error) {
                console.error('Error loading meta:', error);
            }
        };

        loadDeal();
        loadMeta();
    }, [dealId]);

    const loadEmployeesByIds = async (employeeIds: string[]) => {
        if (employeeIds.length === 0) {
            setEmployees([]);
            return;
        }

        try {
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

    const handleEmployeesSelect = (newEmployeeIds: string[]) => {
        setSelectedEmployeeIds(newEmployeeIds);

        if (newEmployeeIds.length > 0) {
            loadEmployeesByIds(newEmployeeIds);
        } else {
            setEmployees([]);
        }
    };

    const handleClientSelect = (clientId: string | null) => {
        setSelectedClientId(clientId);

        if (clientId) {
            loadClientById(clientId);
        } else {
            setClient(null);
        }
    };

    const handleStatusChange = (statusId: string) => {
        const newStatus = statuses.find(s => s.id === statusId);
        if (newStatus) {
            setCurrentStatus(newStatus);
        }
    };

    const handleTypeChange = (typeId: string | null) => {
        const newType = types.find(t => t.id === typeId);
        setCurrentType(newType || null);
    };

    const handleCommentChange = (comment: string) => {
        setCurrentComment(comment);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const positionUpdates = positions.map(p => ({
                id: p.id.startsWith('temp-') ? undefined : p.id,
                name: p.name,
                price: p.price,
                quantity: p.quantity,
                unit: p.unit,
                unit_id: p.unit_id,
                position_id: p.position_id
            }));

            const response = await dmModule.updateDeal(dealId, {
                status_id: currentStatus?.id,
                type_id: currentType?.id || null,
                comment: currentComment,
                employees: selectedEmployeeIds,
                client_id: selectedClientId,
                positions: positionUpdates
            });

            if (response.status) {
                showMessage({
                    label: 'Сделка обновлена',
                    variant: 'success'
                });

                const refreshedDeal = await dmModule.getDeal(dealId);
                if (refreshedDeal.status) {
                    const dealData = refreshedDeal.data;
                    setDeal(dealData);

                    if (dealData.client) {
                        setSelectedClientId(dealData.client.id);
                        setClient(dealData.client);
                    } else {
                        setSelectedClientId(null);
                        setClient(null);
                    }

                    const employeeList = dealData.employees || [];
                    setSelectedEmployeeIds(employeeList.map((e: Employee) => e.id));
                    setEmployees(employeeList);

                    const status = dealData.status || null;
                    const type = dealData.type || null;
                    const comment = dealData.comment || null;
                    const positionsList = dealData.positions || [];

                    setCurrentStatus(status);
                    setCurrentType(type);
                    setCurrentComment(comment);
                    setPositions(positionsList);

                    initialDataRef.current = {
                        statusId: status?.id || null,
                        typeId: type?.id || null,
                        comment: comment,
                        employeeIds: employeeList.map((e: Employee) => e.id),
                        clientId: dealData.client?.id || null,
                        positions: positionsList
                    };

                    setHasChanges(false);
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

    const handleCancel = () => {
        if (initialDataRef.current) {
            const initial = initialDataRef.current;
            setCurrentStatus(statuses.find(s => s.id === initial.statusId) || null);
            setCurrentType(types.find(t => t.id === initial.typeId) || null);
            setCurrentComment(initial.comment);
            setSelectedEmployeeIds(initial.employeeIds);
            setSelectedClientId(initial.clientId);
            setPositions(initial.positions);
            setHasChanges(false);
        }
    };

    if (loading || ALLOW_PAGE.isLoading) {
        return <PlatformLoading />;
    }

    if (!isAllowed(ALLOW_PAGE)) {
        return <PlatformNotAllowed permission={PERMISSIONS.DM_DEALS} />;
    }

    const showEmployees = section === 'employees';
    const showClient = section === 'client';
    const showStructure = section === 'structure';
    const showFinance = section === 'finance';
    const showOverview = section === null;

    return (
        <>
            <PlatformHead
                title={deal ? `СД-${deal.id.split('-')[0].toUpperCase()}` : 'Сделка'}
                description='Ведение сделки/заказа.'
                sections={[
                    {
                        label: 'Обзор',
                        href: `/platform/${companyId}/dm/${dealId}`,
                        exact: true,
                        strongParams: true
                    },
                    {
                        label: 'Состав',
                        href: `/platform/${companyId}/dm/${dealId}?section=structure`,
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
                        label: 'Финансы',
                        href: `/platform/${companyId}/dm/${dealId}?section=finance`,
                        strongParams: true
                    }
                ]}
                actions={isAllowed(ALLOW_DEAL_UPDATE) ? [
                    ...(hasChanges ? [{
                        variant: 'light' as const,
                        children: 'Отменить',
                        onClick: handleCancel,
                        disabled: saving
                    }] : []),
                    {
                        variant: 'accent' as const,
                        children: saving ? 'Сохранение...' : 'Сохранить изменения',
                        onClick: handleSave,
                        disabled: saving || !hasChanges
                    }
                ] : undefined}
                docsEscort={{
                    href: DOCS_LINK_DM_DEALS,
                    title: 'Подробнее о сделках'
                }}
            >
                {hasChanges && (
                    <div className={styles.nonSaved}>
                        После изменения данных о сделке не забывайте сохранять изменения.
                    </div>
                )}
            </PlatformHead>
            <div className={styles.body}>
                {showOverview && (
                    <OverviewBlock
                        className={styles.block}
                        dealId={dealId}
                        currentStatus={currentStatus}
                        currentType={currentType}
                        currentComment={currentComment}
                        onStatusChange={handleStatusChange}
                        onTypeChange={handleTypeChange}
                        onCommentChange={handleCommentChange}
                        disabled={saving}
                        created_at={deal?.created_at}
                        updated_at={deal?.updated_at}
                    />
                )}
                {showEmployees && (
                    <EmployeesBlock
                        className={styles.block}
                        selectedIds={selectedEmployeeIds}
                        onSelect={handleEmployeesSelect}
                        employees={employees}
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
                {showStructure && (
                    <StructureBlock
                        className={styles.block}
                        positions={positions}
                        onChange={setPositions}
                        disabled={saving}
                    />
                )}
                {showFinance && (
                    <FinanceBlock
                        className={styles.block}
                        dealId={dealId}
                    />
                )}
            </div>
        </>
    );
}