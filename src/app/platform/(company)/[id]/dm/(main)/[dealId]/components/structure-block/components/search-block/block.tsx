'use client';

import clsx from 'clsx';
import styles from './block.module.scss';
import Input from '@/assets/ui-kit/input/input';
import { useState, useEffect, useRef } from 'react';
import { useWm } from '@/apps/company/modules';
import { CatalogUnit, PositionWithUnit } from '@/apps/company/modules/wm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import Button from '@/assets/ui-kit/button/button';
import { getUnitRu } from '@/app/platform/(company)/[id]/wm/(catalog)/units/new/_units';

export type SearchMode = 'catalog' | 'stock';

export interface SearchBlockProps {
    className?: string;
    onSelectCatalog?: (unit: CatalogUnit) => void;
    onSelectStock?: (position: PositionWithUnit) => void;
    disabled?: boolean;
    defaultMode?: SearchMode;
}

export function SearchBlock({ 
    className, 
    onSelectCatalog, 
    onSelectStock, 
    disabled,
    defaultMode = 'catalog'
}: SearchBlockProps) {
    const wmModule = useWm();
    const [search, setSearch] = useState('');
    const [mode, setMode] = useState<SearchMode>(defaultMode);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [catalogUnits, setCatalogUnits] = useState<CatalogUnit[] | null>(null);
    const [stockPositions, setStockPositions] = useState<PositionWithUnit[] | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setCatalogUnits(null);
                setStockPositions(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        if (!search.trim()) {
            setCatalogUnits(null);
            setStockPositions(null);
            setIsOpen(false);
            return;
        }

        timeoutRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                if (mode === 'catalog' && onSelectCatalog) {
                    const response = await wmModule.getUnits({ search, limit: 10 });
                    if (response.status && response.data?.units) {
                        setCatalogUnits(response.data.units);
                        setStockPositions(null);
                        setIsOpen(true);
                    }
                } else if (mode === 'stock' && onSelectStock) {
                    const response = await wmModule.getStockPositions({ search, limit: 50 });
                    if (response.status && response.data) {
                        setStockPositions(response.data.positions || []);
                        setCatalogUnits(null);
                        setIsOpen(true);
                    }
                }
            } catch (error) {
                console.error('Search error:', error);
                setCatalogUnits([]);
                setStockPositions([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [search, mode]);

    const handleSelectCatalog = (unit: CatalogUnit) => {
        onSelectCatalog?.(unit);
        setSearch('');
        setCatalogUnits(null);
        setIsOpen(false);
    };

    const handleSelectStock = (position: PositionWithUnit) => {
        onSelectStock?.(position);
        setSearch('');
        setStockPositions(null);
        setIsOpen(false);
    };

    const handleInputChange = (value: string) => {
        setSearch(value);
        if (!value.trim()) {
            setCatalogUnits(null);
            setStockPositions(null);
            setIsOpen(false);
        }
    };

    const toggleMode = () => {
        setMode(prev => prev === 'catalog' ? 'stock' : 'catalog');
        setCatalogUnits(null);
        setStockPositions(null);
    };

    const units = mode === 'catalog' ? catalogUnits : stockPositions;
    const hasResults = units && units.length > 0;

    return (
        <div className={clsx(styles.container, className)} ref={containerRef}>
            <div className={styles.searchRow}>
                <Input 
                    placeholder={mode === 'catalog' 
                        ? 'Поиск по каталогу...' 
                        : 'Поиск по складским позициям...'}
                    className={styles.input}
                    fullWidth
                    value={search}
                    onChange={(e) => handleInputChange(e.target.value)}
                    disabled={disabled}
                />
                <Button
                    variant="light"
                    onClick={toggleMode}
                    disabled={disabled}
                    className={styles.modeToggle}
                >
                    {mode === 'catalog' ? 'Склад' : 'Каталог'}
                </Button>
            </div>
            
            {isOpen && units && (
                <div className={clsx(styles.modal, styles.active)}>
                    {loading ? (
                        <div className={styles.loading}><Spinner /></div>
                    ) : !hasResults ? (
                        <div className={styles.plug}>Ничего не найдено</div>
                    ) : mode === 'catalog' ? (
                        <div className={styles.grid}>
                            {(units as CatalogUnit[]).map(unit => (
                                <div 
                                    key={unit.id} 
                                    className={styles.item}
                                    onClick={() => handleSelectCatalog(unit)}
                                >
                                    <span className={styles.name}>{unit.name}</span>
                                    <span className={styles.categoryName}>
                                        {unit.category_id || 'Без категории'}
                                    </span>
                                    <span className={styles.price}>
                                        {unit.sale_price} ₽ / {getUnitRu(unit.unit)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {(units as PositionWithUnit[]).map(position => (
                                <div 
                                    key={position.id} 
                                    className={styles.item}
                                    onClick={() => handleSelectStock(position)}
                                >
                                    <span className={styles.name}>{position.unit?.name || 'Без названия'}</span>
                                    <span className={styles.stockInfo}>
                                        Партия: {position.batch_id?.slice(0, 8) || '—'} | 
                                        Кол-во: {position.quantity} {getUnitRu(position.unit?.unit) || undefined}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}