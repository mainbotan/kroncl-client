'use client';

import clsx from 'clsx';
import { SourceCard } from '../../../sources/components/source-card/card';
import styles from './block.module.scss';
import { useCrm } from '@/apps/company/modules';
import { useEffect, useState } from 'react';
import { ClientSource } from '@/apps/company/modules/crm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';

export interface ChooseSourceBlockProps {
    className?: string;
    limit?: number;
    disabled?: boolean;
    selectedId?: string | null;
    onSelect?: (source: ClientSource) => void;
}

export function ChooseSourceBlock({
    className,
    limit = 50,
    disabled,
    selectedId,
    onSelect
}: ChooseSourceBlockProps) {
    const crmModule = useCrm();
    const [sources, setSources] = useState<ClientSource[]>([]);
    const [loading, setLoading] = useState(true);

    const handleSelect = (source: ClientSource) => {
        if (disabled) return;
        onSelect?.(source);
    };

    useEffect(() => {
        const loadSources = async () => {
            setLoading(true);
            try {
                const response = await crmModule.getSources({
                    page: 1,
                    limit,
                    status: 'active' // только активные источники
                });
                
                if (response.status) {
                    setSources(response.data.sources);
                }
            } catch (error) {
                console.error('Error loading sources:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSources();
    }, [limit]);

    if (loading) {
        return (
            <div className={clsx(styles.loading, className)}>
                <Spinner />
            </div>
        );
    }

    if (sources.length === 0) {
        return (
            <div className={clsx(styles.empty, className)}>
                Нет активных источников для выбора
            </div>
        );
    }

    return (
        <div className={clsx(styles.grid, className)}>
            {sources.map((source) => (
                <SourceCard 
                    key={source.id} 
                    source={source}
                    selectable
                    isSelected={selectedId === source.id}
                    onSelect={handleSelect}
                />
            ))}
        </div>
    );
}