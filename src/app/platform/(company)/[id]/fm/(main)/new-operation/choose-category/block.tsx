'use client';

import clsx from 'clsx';
import { CategoryCard } from '../../../categories/components/category-card/card';
import styles from './block.module.scss';
import { useFm } from '@/apps/company/modules';
import { useEffect, useState } from 'react';
import { TransactionCategory } from '@/apps/company/modules/fm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';

export interface ChooseCategoryBlockProps {
    direction: 'income' | 'expense';
    className?: string;
    limit?: number;
    disabled?: boolean;
}
export function ChooseCategoryBlock({
    direction,
    className,
    limit = 50,
    onSelect,
    disabled
}: ChooseCategoryBlockProps & { onSelect?: (category: TransactionCategory) => void }) {
    const fmModule = useFm();
    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelect = (category: TransactionCategory) => {
        setSelectedId(category.id);
        onSelect?.(category);
    };

    useEffect(() => {
        const loadCategories = async () => {
            setLoading(true);
            try {
                const response = await fmModule.getCategories({
                    page: 1,
                    limit,
                    direction
                });
                
                if (response.status) {
                    setCategories(response.data.categories);
                }
            } catch (error) {
                console.error('Error loading categories:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, [direction, limit]);

    if (loading) {
        return (
            <div className={clsx(styles.loading, className)}>
                <Spinner />
            </div>
        );
    }

    if (categories === null || categories.length === 0) {
        return (
            <div className={clsx(styles.empty, className)}>
                Нет категорий для выбора
            </div>
        );
    }

    return (
        <div className={clsx(styles.grid, className)}>
            {categories.map((category) => (
                <CategoryCard 
                    key={category.id} 
                    category={category}
                    selectable
                    isSelected={selectedId === category.id}
                    onSelect={handleSelect}
                />
            ))}
        </div>
    );
}