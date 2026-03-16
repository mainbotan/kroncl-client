'use client';

import clsx from "clsx";
import styles from './block.module.scss';
import { DealBlock } from "../block/block";
import { ClientDetail } from "@/apps/company/modules/crm/types";
import { ClientCard } from "@/app/platform/(company)/[id]/crm/components/client-card/card";
import { PlatformModal } from "@/app/platform/components/lib/modal/modal";
import { ChooseClientModal } from "@/app/platform/(company)/[id]/crm/components/choose-client-modal/modal";
import { useState, useEffect } from "react";

export interface ClientBlockProps {
    className?: string;
    selectedId?: string | null;
    onSelect?: (clientId: string | null) => void;
    disabled?: boolean;
    client?: ClientDetail | null;
}

export function ClientBlock({
    className,
    selectedId = null,
    onSelect,
    disabled = false,
    client = null
}: ClientBlockProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Добавим лог для отслеживания
    useEffect(() => {
        console.log('ClientBlock state:', { selectedId, client });
    }, [selectedId, client]);

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const handleSelectClient = (selectedClient: ClientDetail) => {
        console.log('Selected client:', selectedClient);
        
        // Если выбран тот же клиент - ничего не делаем
        if (selectedId === selectedClient.id) {
            setIsModalOpen(false);
            return;
        }

        // Устанавливаем ID выбранного клиента
        if (onSelect) {
            onSelect(selectedClient.id);
        }
        setIsModalOpen(false);
    };

    const handleRemoveClient = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Removing client');
        
        if (onSelect) {
            onSelect(null);
        }
    };

    const getBlockDescription = () => {
        if (!selectedId) {
            return "Клиент ещё не выбран.";
        }
        return "Клиент привязан к сделке";
    };

    return (
        <>
            <DealBlock
                title="Клиент"
                description={getBlockDescription()}
                className={className}
                actions={[
                    {
                        variant: 'accent',
                        children: selectedId ? 'Изменить' : 'Выбрать',
                        onClick: handleAddClick,
                        disabled
                    }
                ]}
            >
                <div className={styles.list}>
                    {client && (
                        <ClientCard 
                            client={client}
                            variant="default"
                            selectable={false}
                            disableLink={true}
                            actions={[
                                {
                                    children: 'Открепить',
                                    variant: 'light',
                                    onClick: handleRemoveClient,
                                    disabled,
                                    className: styles.button
                                }
                            ]}
                        />
                    )}
                </div>
            </DealBlock>

            <PlatformModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className={styles.modal}
            >
                <ChooseClientModal 
                    onSelectClient={handleSelectClient}
                />
            </PlatformModal>
        </>
    );
}