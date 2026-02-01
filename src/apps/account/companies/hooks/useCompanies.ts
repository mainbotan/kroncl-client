import { useState, useCallback } from 'react';
import { companiesApi } from '../api';
import { AccountCompany, GetAccountCompaniesParams } from '../types';
import { PaginationMeta } from '@/apps/shared/pagination/types';

export function useCompanies() {
    const [companies, setCompanies] = useState<AccountCompany[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationMeta>({
        page: 1,
        limit: 20,
        total: 0,
        pages: 1
    });

    const fetchCompanies = useCallback(async (params?: GetAccountCompaniesParams) => {
        try {
            setLoading(true);
            setError(null);

            const response = await companiesApi.getUserCompanies({
                page: params?.page || 1,
                limit: params?.limit || 20,
                ...params
            });

            if (response.status && response.data) {
                setCompanies(response.data.companies || []);
                setPagination(response.data.pagination || {
                    page: params?.page || 1,
                    limit: params?.limit || 20,
                    total: 0,
                    pages: 1
                });
            } else {
                setError(response.message || 'Ошибка загрузки');
            }
        } catch (err) {
            setError('Не удалось загрузить компании');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        companies,
        loading,
        error,
        pagination,
        fetchCompanies
    };
}