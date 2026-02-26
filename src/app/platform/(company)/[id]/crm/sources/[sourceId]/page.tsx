'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useCrm } from "@/apps/company/modules";
import { ClientSource } from "@/apps/company/modules/crm/types";
import Edit from "@/assets/ui-kit/icons/edit";
import Exit from "@/assets/ui-kit/icons/exit";
import Spinner from "@/assets/ui-kit/spinner/spinner";
import { formatDate } from "@/assets/utils/date";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/assets/ui-kit/button/button";
import Question from "@/assets/ui-kit/icons/question";
import { PlatformModal } from "@/app/platform/components/lib/modal/modal";
import { PlatformModalConfirmation } from "@/app/platform/components/lib/modal/confirmation/confirmation";
import { useMessage } from "@/app/platform/components/lib/message/provider";
import { motion } from 'framer-motion';
import { getSourceTypeLabel } from "./_utils";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const sourceId = params.sourceId as string;
    const crmModule = useCrm();
    const router = useRouter();
    const { showMessage } = useMessage();

    const [source, setSource] = useState<ClientSource | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalDeactivateOpen, setIsModalDeactivateOpen] = useState(false);
    const [isModalActivateOpen, setIsModalActivateOpen] = useState(false);

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

    const widgets = [
        { value: source.name, legend: "Название источника", variant: "accent" as const },
        ...(source.url ? [{ value: source.url, legend: "URL", variant: "default" as const }] : []),
        ...(source.comment ? [{ value: source.comment, legend: "Комментарий", variant: "default" as const }] : []),
        { value: typeLabel, legend: "Тип источника", variant: "default" as const },
        ...(source.system ? [{ value: "Да", legend: "Системный источник", variant: "default" as const }] : [])
    ];

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

    return (
        <>
            <PlatformHead
                title={source.name}
                description={`Источник трафика. Создан ${formatDate(source.created_at)} Статус: ${isActive ? 'активен' : 'неактивен'}.`}
                actions={actions}
            />

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