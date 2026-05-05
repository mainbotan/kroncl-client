export interface MetricsClienteleSnapshot {
    recorded_at: string;
    
    // Аккаунты
    total_accounts: number;
    confirmed_accounts: number;
    waiting_accounts: number;
    admin_accounts: number;
    
    // Статистика по типам аккаунтов
    account_type_owner: number;
    account_type_employee: number;
    account_type_admin: number;
    account_type_outsourcing: number;
    account_type_tech: number;
    
    // Компании
    total_companies: number;
    public_companies: number;
    private_companies: number;
    
    // Связи
    total_company_accounts: number;
    avg_accounts_per_company: number;
    max_accounts_in_company: number;
    
    // Транзакции
    total_transactions: number;
    success_transactions: number;
    pending_transactions: number;
    trial_transactions: number;
    
    // Активность
    active_companies_7d: number;
    active_companies_30d: number;
    
    // Схемы
    company_schemas_without_data: number;
}