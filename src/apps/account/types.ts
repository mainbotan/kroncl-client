export interface Account {
    id: string;
    email: string;
    name: string;
    avatar_url: string | null;
    auth_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}