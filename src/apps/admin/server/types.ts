export interface MetricsServerSnapshot {
    recorded_at: string;
    
    // HTTP трафик
    requests_total: number;
    requests_5xx_total: number;
    requests_4xx_total: number;
    avg_response_time_ms: number;
    p95_response_time_ms: number;
    active_connections: number;
    
    // Go runtime
    goroutines_count: number;
    heap_alloc_mb: number;
    heap_inuse_mb: number;
    gc_duration_ms: number;
    
    // Воркеры
    db_worker_success: boolean;
    clientele_worker_success: boolean;
    
    // Системные
    cpu_usage_percent: number;
    memory_usage_mb: number;
    open_fds_count: number;
}