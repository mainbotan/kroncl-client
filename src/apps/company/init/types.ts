export interface CreateCompanyRequest {
    name: string;
    slug: string;
    description?: string;
    avatar_url?: string;
    is_public: boolean;
}

export interface Storage {
    company_id: string;
    created_at: string;
    id: string;
    metadata: Record<string, any>;
    schema_name: string;
    status: 'provisioning' | 'active' | 'error';
    storage_type: 'schema';
    updated_at: string;
}

export interface Company {
    id: string;
    name: string;
    slug: string;
    description: string;
    avatar_url: string;
    is_public: boolean;
    storage: Storage;
    created_at: string;
    updated_at: string;
}

// Типы для проверки уникальности slug
export interface CheckSlugUniqueRequest {
    slug: string;
}

export interface SlugUniqueData {
    slug: string;
    unique: boolean;
}