'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCompanies } from '@/apps/account/companies/hooks/useCompanies';
import { CompanyCard } from '../components/company-card/card';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import Spinner from '@/assets/ui-kit/spinner/spinner';

export default function Page() {
    const searchParams = useSearchParams();
    const { companies, loading, error, fetchCompanies, pagination: apiPagination } = useCompanies();
    const { pagination, handlePageChange } = usePagination({
        baseUrl: '/platform/companies',
        defaultLimit: 20
    });

    const roleParam = searchParams.get('role');
    const role = roleParam === 'owner' ? 'owner' : 
                roleParam === 'guest' ? 'guest' : 'all';

    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        
        fetchCompanies({ 
            role,
            page,
            limit 
        });
    }, [fetchCompanies, role, searchParams]);

    if (loading) return <div><Spinner /></div>;
    if (error) return <div>{error}</div>;
    
    if (companies.length === 0) {
        return (
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".7em", color: "var(--color-text-description)", minHeight: "10rem"}}>
                {role === 'owner' 
                    ? 'Вы не владеете ни одной компанией'
                    : role === 'guest'
                    ? 'У вас нет приглашений в компании'
                    : 'У вас пока нет компаний'}
            </div>
        );
    }

    return (
        <>
            {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
            ))}
            
            <PlatformPagination
                meta={apiPagination}
                baseUrl="/platform/companies"
                queryParams={{
                    role: role !== 'all' ? role : ''
                }}
                onPageChange={(page) => handlePageChange(page, {
                    role: role !== 'all' ? role : ''
                })}
            />
        </>
    );
}