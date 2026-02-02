export interface StorageSources {
    active_connections: number;
    created_at: string | null;
    dead_rows: number;
    index_count: number;
    index_size_mb: number;
    last_analyze: string | null;
    last_autovacuum: string | null;
    last_vacuum: string | null;
    materialized_view_count: number;
    schema_exists: boolean;
    schema_name: string;
    sequence_count: number;
    table_count: number;
    table_size_mb: number;
    toast_size_mb: number;
    total_rows: number;
    total_size_mb: number;
    total_size_pretty: string;
    updated_at: string | null;
    view_count: number;
}