export interface SystemStats {
    total_database_size_mb: number;
    total_schemas_count: number;
    company_schemas_count: number;
    public_schemas_count: number;
    other_schemas_count: number;
    total_tables_count: number;
    total_indexes_count: number;
    total_active_connections: number;
    migration_version: number;
    migration_dirty: boolean;
}

export interface SchemaStats {
    schema_name: string;
    schema_size_mb: number;
    tables_count: number;
    indexes_count: number;
    migration_version: number;
    migration_dirty: boolean;
}

export interface TableInfo {
    table_name: string;
    size_kb: number;
    size_mb: number;
}

export interface MetricsHistoryItem {
    recorded_at: string;
    total_database_size_mb: number;
    total_schemas_count: number;
    company_schemas_count: number;
    total_tables_count: number;
    total_indexes_count: number;
    total_active_connections: number;
    xact_commit: number;
    xact_rollback: number;
    tup_returned: number;
    tup_fetched: number;
    tup_inserted: number;
    tup_updated: number;
    tup_deleted: number;
    blks_read: number;
    blks_hit: number;
}