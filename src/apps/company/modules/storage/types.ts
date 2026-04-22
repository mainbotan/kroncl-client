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

// ----------------
// MODULES ANALYSIS
// ----------------

export interface ModuleTable {
    exists: boolean;
    row_count: number;
    table_name: string;
    total_bytes: number;
    total_size_mb: number;
}

export interface ModuleStats {
    module: string;
    row_count: number;
    table_count: number;
    tables: ModuleTable[];
    total_bytes: number;
    total_size_mb: number;
}

export interface TotalStats {
    module: 'total';
    row_count: number;
    table_count: number;
    total_bytes: number;
    total_size_mb: number;
}

export interface StorageModulesData {
    modules: Record<string, ModuleStats>;
    total: TotalStats;
}