export interface Account {
    id: string;
    email: string;
    name: string;
    avatar_url: string | null;
    auth_type: string;
    status: string;
    description: string;
    type: string;
    created_at: string;
    updated_at: string;
}

export interface AccountPublic {
    id: string;
    email: string;
    name: string;
    avatar_url: string | null;
    status: string;
    description: string;
    type: string;
    created_at: string;
}