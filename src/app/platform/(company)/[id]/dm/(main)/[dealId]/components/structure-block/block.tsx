'use client';

import { DealBlock } from '../block/block';
import styles from './block.module.scss';
import { SearchBlock } from './components/search-block/block';
import Input from '@/assets/ui-kit/input/input';
import Close from '@/assets/ui-kit/icons/close';
import { CatalogUnit, PositionWithUnit } from '@/apps/company/modules/wm/types';
import { DealPosition } from '@/apps/company/modules/dm/types';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import { getUnitRu } from '@/app/platform/(company)/[id]/wm/(catalog)/units/new/_units';

export interface StructureBlockProps {
    className?: string;
    positions: DealPosition[];
    onChange: (positions: DealPosition[]) => void;
    disabled?: boolean;
}

export function StructureBlock({ className, positions, onChange, disabled }: StructureBlockProps) {
    const handleAddCatalogUnit = (unit: CatalogUnit) => {
        const newPosition: DealPosition = {
            id: `temp-${Date.now()}`,
            name: unit.name,
            comment: null,
            price: unit.sale_price || 0,
            quantity: 1,
            unit: unit.unit,
            unit_id: unit.id,
            position_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            catalog_unit: unit,
            catalog_position: null
        };
        onChange([...positions, newPosition]);
    };

    const handleAddStockPosition = (stockPosition: PositionWithUnit) => {
        const newPosition: DealPosition = {
            id: `temp-${Date.now()}`,
            name: stockPosition.unit?.name || 'Товар со склада',
            comment: null,
            price: stockPosition.unit?.sale_price || 0,
            quantity: 1,
            unit: stockPosition.unit?.unit || 'pcs',
            unit_id: null,
            position_id: stockPosition.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            catalog_unit: stockPosition.unit,
            catalog_position: stockPosition
        };
        onChange([...positions, newPosition]);
    };

    const handleUpdatePosition = (index: number, field: keyof DealPosition, value: any) => {
        const updated = [...positions];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const handleRemovePosition = (index: number) => {
        const updated = positions.filter((_, i) => i !== index);
        onChange(updated);
    };

    return (
        <DealBlock
            title='Состав сделки'
            description='Товарные позиции в составе сделки.'
            className={className}
        >
            <div className={styles.container}>
                <SearchBlock 
                    className={styles.search} 
                    onSelectCatalog={handleAddCatalogUnit}
                    onSelectStock={handleAddStockPosition}
                    disabled={disabled}
                />
                
                {positions.length === 0 ? (
                    <PlatformEmptyCanvas 
                        title='В составе сделки пусто' 
                        className={styles.plug} 
                    />
                ) : (
                    <div className={styles.structure}>
                        <div className={styles.head}>
                            <div className={styles.col}>Наименование</div>
                            <div className={styles.col}>Стоимость единицы</div>
                            <div className={styles.col}>Количество</div>
                            <div className={styles.col}>Сумма</div>
                            <div className={styles.col}></div>
                        </div>
                        {positions.map((pos, index) => (
                            <div key={pos.id} className={styles.item}>
                                <div className={styles.col}>
                                    {pos.name} {pos.position_id && (
                                        <>
                                            &nbsp; <span className={styles.batchLabel}>Товар со склада</span>
                                        </>
                                    )}
                                </div>
                                <div className={styles.col}>
                                    <Input 
                                        className={styles.input}
                                        type="text"
                                        value={pos.price.toString()}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value) || 0;
                                            handleUpdatePosition(index, 'price', val);
                                        }}
                                        disabled={disabled}
                                    />
                                    <span className={styles.hint}>&#8381; / {getUnitRu(pos.unit)}</span>
                                </div>
                                <div className={styles.col}>
                                    <Input 
                                        className={styles.input}
                                        type="text"
                                        value={pos.quantity.toString()}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value) || 1;
                                            handleUpdatePosition(index, 'quantity', val);
                                        }}
                                        disabled={disabled}
                                    />
                                    <span className={styles.hint}>{getUnitRu(pos.unit)}</span>
                                </div>
                                <div className={styles.col}>
                                    {(pos.price * pos.quantity).toFixed(2)} &#8381;
                                </div>
                                <div onClick={() => !disabled && handleRemovePosition(index)} className={styles.col}>
                                    <Close />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DealBlock>
    )
}