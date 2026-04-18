'use client';

import { DealBlock } from '../block/block';
import styles from './block.module.scss';

export interface StructureBlockInterface {
    className?: string;
}

export function StructureBlock({
    className
}: StructureBlockInterface) {
    return (
        <DealBlock
            title='Состав сделки'
            description='Товарные позиции в составе сделки.'
        >
            
        </DealBlock>
    )
}