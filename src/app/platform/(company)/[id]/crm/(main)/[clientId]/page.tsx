'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useCrm } from "@/apps/company/modules";
import { ClientDetail } from "@/apps/company/modules/crm/types";
import Edit from "@/assets/ui-kit/icons/edit";
import Exit from "@/assets/ui-kit/icons/exit";
import Spinner from "@/assets/ui-kit/spinner/spinner";
import { formatDate } from "@/assets/utils/date";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlatformModal } from "@/app/platform/components/lib/modal/modal";
import { PlatformModalConfirmation } from "@/app/platform/components/lib/modal/confirmation/confirmation";
import { useMessage } from "@/app/platform/components/lib/message/provider";
import { motion } from 'framer-motion';
import { getFullName, getClientTypeLabel } from "./_utils";
import styles from './page.module.scss';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormUnify } from "@/app/platform/components/lib/form";
import { formatPhoneNumber } from "@/assets/utils/phone-utils";
import Link from "next/link";
import clsx from "clsx";
import { ModalTooltip } from "@/app/components/tooltip/tooltip";
import { usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";
import { DOCS_LINK_CRM_CLIENTS } from "@/app/docs/(v1)/internal.config";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const clientId = params.clientId as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.CRM_CLIENTS)
    const ALLOW_CLIENT_UPDATE = usePermission(PERMISSIONS.CRM_CLIENTS_UPDATE)

    const crmModule = useCrm();
    const router = useRouter();
    const { showMessage } = useMessage();

    const [client, setClient] = useState<ClientDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalDeactivateOpen, setIsModalDeactivateOpen] = useState(false);
    const [isModalActivateOpen, setIsModalActivateOpen] = useState(false);

    // загрузка данных клиента
    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!clientId) return;
            
            setLoading(true);
            setError(null);
            try {
                const response = await crmModule.getClient(clientId);
                
                if (!isMounted) return;
                
                if (response.status) {
                    setClient(response.data);
                } else {
                    setError("Не удалось загрузить данные клиента");
                }
            } catch (err) {
                if (!isMounted) return;
                
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error(`Error loading client ${clientId}:`, err);
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
    }, [clientId]);

    const handleDeactivate = async () => {
        try {
            await crmModule.deactivateClient(client!.id);
            showMessage({
                label: 'Клиент деактивирован.',
                variant: 'success'
            });
            setIsModalDeactivateOpen(false);
            // Обновляем данные клиента
            const response = await crmModule.getClient(clientId);
            if (response.status) {
                setClient(response.data);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Внутренняя ошибка системы.';
            showMessage({
                label: 'Не удалось деактивировать клиента.',
                variant: 'error',
                about: errorMessage
            });
        }
    };

    const handleActivate = async () => {
        try {
            await crmModule.activateClient(client!.id);
            showMessage({
                label: 'Клиент активирован.',
                variant: 'success'
            });
            setIsModalActivateOpen(false);
            // Обновляем данные клиента
            const response = await crmModule.getClient(clientId);
            if (response.status) {
                setClient(response.data);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Внутренняя ошибка системы.';
            showMessage({
                label: 'Не удалось активировать клиента.',
                variant: 'error',
                about: errorMessage
            });
        }
    };

    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );
    
    if (error || !client) return (
        <PlatformError error={error || 'Не удалось загрузить клиента'} />
    );

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.CRM_CLIENTS} />
    )

    const fullName = getFullName(client);
    const isActive = client.status === 'active';
    const typeLabel = getClientTypeLabel(client.type);
    const displayPhone = client.phone ? formatPhoneNumber(client.phone) : null;
    const displayEmail = client.email || null;

    const actions = (!ALLOW_CLIENT_UPDATE.isLoading && ALLOW_CLIENT_UPDATE.allowed) ? [
        {
            children: 'Редактировать',
            icon: <Edit />,
            variant: 'accent' as const,
            as: 'link' as const,
            href: `/platform/${companyId}/crm/${clientId}/edit`
        }
    ] : [];

    if (!ALLOW_CLIENT_UPDATE.isLoading && ALLOW_CLIENT_UPDATE.allowed) {
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
    }

    return (
        <>
            <PlatformHead
                title={fullName}
                description={`Карточка клиента. Создан ${formatDate(client.created_at)} Статус: ${isActive ? 'активен' : 'неактивен'}.`}
                actions={actions}
                docsEscort={{
                    href: DOCS_LINK_CRM_CLIENTS,
                    title: 'Подробнее о клиентах'
                }}
            />

            <div className={styles.body}>
                <section className={styles.section}>
                    <div className={styles.capture}>Обращаться</div>
                    <div className={styles.value}>{fullName}</div>
                </section>
                {client.phone && (
                <section className={styles.section}>
                    <div className={styles.capture}>Рабочий номер</div>
                    <div className={styles.value}>{displayPhone}</div>
                </section>
                )}
                {client.email && (
                <section className={styles.section}>
                    <div className={styles.capture}>Рабочая почта</div>
                    <div className={styles.value}>{displayEmail}</div>
                </section>
                )}
                {typeLabel && (
                <section className={styles.section}>
                    <div className={styles.capture}>Тип</div>
                    <div className={styles.value}>{typeLabel}</div>
                </section>
                )}
                {client.comment && (
                <section className={styles.section}>
                    <div className={styles.capture}>Комментарий</div>
                    <div className={styles.value}>{client.comment}</div>
                </section>
                )}
                {client.source && (
                <section className={styles.section}>
                    <div className={styles.capture}>Источник привлечения</div>
                    <ModalTooltip content={`Источник привлечения клиента - ${client.source.name}. ${client.source.comment}`}>
                        <Link href={`/platform/${companyId}/crm/sources/${client.source.id}`} className={clsx(styles.value, styles.link)}>{client.source.name}</Link>
                    </ModalTooltip>
                </section>
                )}
                {client.created_at && (
                <section className={styles.section}>
                    <div className={styles.capture}>Создан</div>
                    <div className={styles.value}>{formatDate(client.created_at)}</div>
                </section>
                )}
            </div>

            {/* modal deactivate */}
            <PlatformModal
                isOpen={isModalDeactivateOpen}
                onClose={() => setIsModalDeactivateOpen(false)}
            >
                <PlatformModalConfirmation
                    title='Деактивировать клиента?'
                    description='Клиент будет деактивирован. Все связанные данные сохранятся, но операции с клиентом будут заблокированы.'
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
                    title='Активировать клиента?'
                    description='Клиент будет активирован. Он снова сможет участвовать в операциях.'
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