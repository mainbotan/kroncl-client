export const PERMISSIONS = {
    // Support
    SUPPORT_TICKETS: 'support.tickets',
    SUPPORT_TICKETS_CREATE: 'support.tickets.create',
    SUPPORT_TICKETS_UPDATE: 'support.tickets.update',

    // Pricing
    PRICING_MIGRATE: 'pricing.migrate',
    PRICING_TRANSACTIONS: 'pricing.transactions',

    // Company
    COMPANY_UPDATE: 'company.update',

    // Storage
    STORAGE_SOURCES: 'storage.sources',

    // Logs
    LOGS: 'logs',
    LOGS_CLEAR: 'logs.clear',
    LOGS_OPTIMIZE: 'logs.optimize',
    LOGS_ACTIVITY: 'logs.activity',

    // Accounts
    ACCOUNTS: 'accounts',
    ACCOUNTS_DELETE: 'accounts.delete',
    ACCOUNTS_SETTINGS: 'accounts.settings',
    ACCOUNTS_SETTINGS_UPDATE: 'accounts.settings.update',
    ACCOUNTS_INVITATIONS: 'accounts.invitations',
    ACCOUNTS_INVITATIONS_CREATE: 'accounts.invitations.create',
    ACCOUNTS_INVITATIONS_REVOKE: 'accounts.invitations.revoke',

    // HRM
    HRM: 'hrm',
    HRM_EMPLOYEES: 'hrm.employees',
    HRM_EMPLOYEES_CREATE: 'hrm.employees.create',
    HRM_EMPLOYEES_UPDATE: 'hrm.employees.update',
    HRM_POSITIONS: 'hrm.positions',
    HRM_POSITIONS_CREATE: 'hrm.positions.create',
    HRM_POSITIONS_UPDATE: 'hrm.positions.update',
    HRM_POSITIONS_DELETE: 'hrm.positions.delete',
    HRM_ANALYSIS: 'hrm.analysis',

    // FM
    FM: 'fm',
    FM_TRANSACTIONS: 'fm.transactions',
    FM_TRANSACTIONS_CREATE: 'fm.transactions.create',
    FM_TRANSACTIONS_REVERSE: 'fm.transactions.reverse',
    FM_TRANSACTIONS_CATEGORIES: 'fm.transactions.categories',
    FM_TRANSACTIONS_CATEGORIES_CREATE: 'fm.transactions.categories.create',
    FM_TRANSACTIONS_CATEGORIES_UPDATE: 'fm.transactions.categories.update',
    FM_TRANSACTIONS_CATEGORIES_DELETE: 'fm.transactions.categories.delete',
    FM_ANALYSIS: 'fm.analysis',
    FM_COUNTERPARTIES: 'fm.counterparties',
    FM_COUNTERPARTIES_CREATE: 'fm.counterparties.create',
    FM_COUNTERPARTIES_UPDATE: 'fm.counterparties.update',
    FM_CREDITS: 'fm.credits',
    FM_CREDITS_CREATE: 'fm.credits.create',
    FM_CREDITS_UPDATE: 'fm.credits.update',
    FM_CREDITS_TRANSACTIONS: 'fm.credits.transactions',
    FM_CREDITS_PAY: 'fm.credits.pay',

    // CRM
    CRM: 'crm',
    CRM_CLIENTS: 'crm.clients',
    CRM_CLIENTS_CREATE: 'crm.clients.create',
    CRM_CLIENTS_UPDATE: 'crm.clients.update',
    CRM_SOURCES: 'crm.sources',
    CRM_SOURCES_CREATE: 'crm.sources.create',
    CRM_SOURCES_UPDATE: 'crm.sources.update',
    CRM_ANALYSIS: 'crm.analysis',

    // WM
    WM: 'wm',
    WM_CATALOG: 'wm.catalog',
    WM_CATALOG_CATEGORIES: 'wm.catalog.categories',
    WM_CATALOG_CATEGORIES_CREATE: 'wm.catalog.categories.create',
    WM_CATALOG_CATEGORIES_UPDATE: 'wm.catalog.categories.update',
    WM_CATALOG_UNITS: 'wm.catalog.units',
    WM_CATALOG_UNITS_CREATE: 'wm.catalog.units.create',
    WM_CATALOG_UNITS_UPDATE: 'wm.catalog.units.update',
    WM_STOCKS: 'wm.stocks',
    WM_STOCKS_BATCHES: 'wm.stocks.batches',
    WM_STOCKS_BATCHES_CREATE: 'wm.stocks.batches.create',
    WM_STOCKS_POSITIONS: 'wm.stocks.positions',

    // DM
    DM: 'dm',
    DM_TYPES: 'dm.types',
    DM_TYPES_CREATE: 'dm.types.create',
    DM_TYPES_UPDATE: 'dm.types.update',
    DM_TYPES_DELETE: 'dm.types.delete',
    DM_STATUSES: 'dm.statuses',
    DM_STATUSES_CREATE: 'dm.statuses.create',
    DM_STATUSES_UPDATE: 'dm.statuses.update',
    DM_STATUSES_DELETE: 'dm.statuses.delete',
    DM_DEALS: 'dm.deals',
    DM_DEALS_CREATE: 'dm.deals.create',
    DM_DEALS_UPDATE: 'dm.deals.update',
    DM_DEALS_DELETE: 'dm.deals.delete',
    DM_ANALYSIS: 'dm.analysis',
} as const;

export type PermissionCode = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// --------
// UTILS
// --------

/**
 * Возвращает список всех существующих разрешений
 */
export const getAllPermissions = (): PermissionCode[] => {
    return Object.values(PERMISSIONS);
};