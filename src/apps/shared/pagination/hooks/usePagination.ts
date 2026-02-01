import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PaginationMeta } from '@/apps/shared/pagination/types';

interface UsePaginationOptions {
    baseUrl: string;
    defaultLimit?: number;
    preserveParams?: boolean;
}

export function usePagination({
    baseUrl,
    defaultLimit = 20,
    preserveParams = true
}: UsePaginationOptions) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [pagination, setPagination] = useState<PaginationMeta>({
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || defaultLimit.toString()),
        total: 0,
        pages: 1
    });

    const handlePageChange = useCallback((newPage: number, otherParams?: Record<string, string>) => {
        const params = new URLSearchParams();
        
        // Параметры пагинации
        params.set('page', newPage.toString());
        params.set('limit', pagination.limit.toString());
        
        // Сохраняем другие параметры из URL
        if (preserveParams) {
            searchParams.forEach((value, key) => {
                if (key !== 'page' && key !== 'limit') {
                    params.set(key, value);
                }
            });
        }
        
        // Добавляем переданные параметры
        if (otherParams) {
            Object.entries(otherParams).forEach(([key, value]) => {
                params.set(key, value);
            });
        }
        
        router.push(`${baseUrl}?${params.toString()}`, { scroll: false });
    }, [baseUrl, pagination.limit, preserveParams, router, searchParams]);

    const updatePagination = useCallback((meta: Partial<PaginationMeta>) => {
        setPagination(prev => ({ ...prev, ...meta }));
    }, []);

    return {
        pagination,
        handlePageChange,
        updatePagination
    };
}