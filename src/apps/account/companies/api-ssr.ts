import { cookies } from 'next/headers';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { AccountCompany, AccountCompaniesResponse, GetAccountCompaniesParams } from './types';
import { STORAGE_KEYS } from '../auth/storage';

export class CompaniesApiSSR {
    private baseUrl: string;
    private endpoints = {
        company: (id: string) => `/companies/${id}`,
    };

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        if (!this.baseUrl) {
            console.warn('NEXT_PUBLIC_API_URL is not defined in SSR');
        }
    }

    
    private async getAuthToken(): Promise<string | null> {
        try {
            const cookieStore = await cookies();
            return cookieStore.get(STORAGE_KEYS.ACCESS_TOKEN)?.value || null;
        } catch (error) {
            console.error('Failed to get auth token from cookies:', error);
            return null;
        }
    }

    // ssr only
    private async makeRequest<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<ApiResponse<T>> {
        try {
            const authToken = await this.getAuthToken();
            
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
                    ...options?.headers,
                },
                cache: 'no-store',
                next: { revalidate: 60 }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data as ApiResponse<T>;
        } catch (error) {
            console.error('SSR API request failed:', error);
            throw error;
        }
    }

    async getCompany(companyId: string): Promise<AccountCompany | null> {
        try {
            const response = await this.makeRequest<AccountCompany>(
                this.endpoints.company(companyId)
            );
            
            if (response.status && response.data) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Failed to get company in SSR:', error);
            return null;
        }
    }

    async hasAccessToCompany(companyId: string): Promise<boolean> {
        try {
            const company = await this.getCompany(companyId);
            return company !== null;
        } catch (error) {
            return false;
        }
    }
}

// Singleton instance
export const companiesApiSSR = new CompaniesApiSSR();