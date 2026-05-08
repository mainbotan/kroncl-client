export type SystemStatus = 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
export type IncidentSeverity = 'minor' | 'major';
export type ComponentType = 'all' | 'server' | 'storage';

export interface Incident {
    id: string;
    start_time: string;
    end_time?: string;
    severity: IncidentSeverity;
    title: string;
    description: string;
    metrics_type: 'server' | 'db';
}

export interface DailyStatus {
    date: string;
    status: SystemStatus;
    incidents?: Incident[];
}

export interface SystemStatusResponse {
    current_status: SystemStatus;
    daily: DailyStatus[];
    active_incidents: Incident[];
    components: {
        all: DailyStatus[];
        server: DailyStatus[];
        storage: DailyStatus[];
    };
}