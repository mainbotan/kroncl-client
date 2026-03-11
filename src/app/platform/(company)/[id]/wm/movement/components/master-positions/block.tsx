'use client';

import Input from '@/assets/ui-kit/input/input';
import styles from './block.module.scss';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChooseUnitBlock } from '../choose-unit/block';
import clsx from 'clsx';
import { useState, useRef, useEffect } from 'react';

export interface MasterPositionsBlockProps {
    className?: string;
}

export function MasterPositionsBlock({
    className
}: MasterPositionsBlockProps) {
    const params = useParams();
    const companyId = params.id as string;
    const [searchValue, setSearchValue] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (value: string) => {
        setSearchValue(value);
        if (value.trim()) {
            setIsModalVisible(true);
        } else {
            setIsModalVisible(false);
        }
    };

    const handleInputFocus = () => {
        if (searchValue.trim()) {
            setIsModalVisible(true);
        }
    };

    const handleUnitSelect = (unitId: string) => {
        console.log('Selected unit:', unitId);
        setIsModalVisible(false);
        setSearchValue('');
    };

    // Закрытие модалки при клике вне
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsModalVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.master}>
            <div className={styles.head}>
                <div className={styles.hint}>
                    В состав поставки/отгрузки добавляются товарные позиции из каталога компании, учитывающиеся в остатках. <Link href={`/platform/${companyId}/wm/units`}>Управление товарными позициями.</Link>
                </div>
                <Input 
                    ref={inputRef}
                    placeholder='Начните вводить название товара в каталоге' 
                    className={styles.input} 
                    fullWidth 
                    variant='elevated'
                    value={searchValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={handleInputFocus}
                />
                <ChooseUnitBlock 
                    ref={modalRef}
                    className={clsx(styles.modal, isModalVisible && styles.visible)} 
                    searchValue={searchValue}
                    onSelect={handleUnitSelect}
                />
            </div>
            <div className={styles.list}>

            </div>
        </div>
    )
}