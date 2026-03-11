'use client';

import clsx from 'clsx';
import styles from './block.module.scss';
import { useWm } from '@/apps/company/modules';
import { useEffect, useState, forwardRef } from 'react';
import { CatalogUnit } from '@/apps/company/modules/wm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { UnitCard } from '../../../components/unit-card/card';

export interface ChooseUnitBlockProps {
    className?: string;
    searchValue: string;
    onSelect: (unitId: string) => void;
}

export const ChooseUnitBlock = forwardRef<HTMLDivElement, ChooseUnitBlockProps>(({
    className,
    searchValue,
    onSelect
}, ref) => {
    const wmModule = useWm();
    const [units, setUnits] = useState<CatalogUnit[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!searchValue.trim()) {
            setUnits([]);
            return;
        }

        const loadUnits = async () => {
            setLoading(true);
            try {
                const response = await wmModule.getUnits({
                    search: searchValue,
                    inventory_type: 'tracked',
                    status: 'active',
                    limit: 10
                });
                
                if (response.status) {
                    setUnits(response.data.units);
                }
            } catch (error) {
                console.error('Error loading units:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(loadUnits, 300);
        return () => clearTimeout(timeoutId);
    }, [searchValue]);

    return (
        <div ref={ref} className={clsx(styles.block, className)}>
            {loading ? (
                <div className={styles.loader}>
                    <Spinner />
                </div>
            ) : units !== null ? (
                <div className={styles.grid}>
                    {units.map((unit) => (
                        <UnitCard
                            key={unit.id}
                            unit={unit}
                            compact
                            showDefaultActions={false}
                            onClick={() => onSelect(unit.id)}
                        />
                    ))}
                </div>
            ) : searchValue.trim() ? (
                <div className={styles.empty}>
                    Ничего не найдено
                </div>
            ) : null}
        </div>
    );
});

ChooseUnitBlock.displayName = 'ChooseUnitBlock';