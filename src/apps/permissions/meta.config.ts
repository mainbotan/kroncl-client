import { PERMISSIONS, PermissionCode } from './codes.config';
import { PermissionMeta } from './types';

export const PERMISSIONS_META: Record<PermissionCode, PermissionMeta> = {
    // Support
    [PERMISSIONS.SUPPORT_TICKETS]: {
        code: PERMISSIONS.SUPPORT_TICKETS,
        title: 'Просмотр тикетов',
        description: 'Доступ к просмотру тикетов поддержки',
        module: 'support',
        category: 'tickets',
    },
    [PERMISSIONS.SUPPORT_TICKETS_CREATE]: {
        code: PERMISSIONS.SUPPORT_TICKETS_CREATE,
        title: 'Создание тикетов',
        description: 'Возможность создавать новые тикеты поддержки',
        module: 'support',
        category: 'tickets',
    },
    [PERMISSIONS.SUPPORT_TICKETS_UPDATE]: {
        code: PERMISSIONS.SUPPORT_TICKETS_UPDATE,
        title: 'Обновление тикетов',
        description: 'Изменение статуса и содержимого тикетов',
        module: 'support',
        category: 'tickets',
    },

    // Pricing
    [PERMISSIONS.PRICING_MIGRATE]: {
        code: PERMISSIONS.PRICING_MIGRATE,
        title: 'Смена тарифа',
        description: 'Возможность изменять тарифный план компании',
        module: 'pricing',
        category: 'billing',
    },
    [PERMISSIONS.PRICING_TRANSACTIONS]: {
        code: PERMISSIONS.PRICING_TRANSACTIONS,
        title: 'Просмотр транзакций',
        description: 'Доступ к истории платежей и операций по тарифу',
        module: 'pricing',
        category: 'billing',
    },

    // Company
    [PERMISSIONS.COMPANY_UPDATE]: {
        code: PERMISSIONS.COMPANY_UPDATE,
        title: 'Редактирование компании',
        description: 'Изменение названия, описания и настроек компании',
        module: 'company',
        category: 'settings',
    },
    [PERMISSIONS.COMPANY_DELETE]: {
        code: PERMISSIONS.COMPANY_DELETE,
        title: 'Удаление компании',
        description: 'Безвозвратное удаление всех данных компании',
        module: 'company',
        category: 'settings',
    },

    // Storage
    [PERMISSIONS.STORAGE_SOURCES]: {
        code: PERMISSIONS.STORAGE_SOURCES,
        title: 'Просмотр источников',
        description: 'Доступ к информации об использовании хранилища организации',
        module: 'storage',
        category: 'files',
    },

    // Logs
    [PERMISSIONS.LOGS]: {
        code: PERMISSIONS.LOGS,
        title: 'Просмотр логов',
        description: 'Доступ к системным логам компании',
        module: 'logs',
        category: 'monitoring',
    },
    [PERMISSIONS.LOGS_CLEAR]: {
        code: PERMISSIONS.LOGS_CLEAR,
        title: 'Очистка логов',
        description: 'Возможность удалять все логи компании',
        module: 'logs',
        category: 'monitoring',
    },
    [PERMISSIONS.LOGS_OPTIMIZE]: {
        code: PERMISSIONS.LOGS_OPTIMIZE,
        title: 'Оптимизация логов',
        description: 'Запуск процедуры очистки устаревших логов',
        module: 'logs',
        category: 'monitoring',
    },
    [PERMISSIONS.LOGS_ACTIVITY]: {
        code: PERMISSIONS.LOGS_ACTIVITY,
        title: 'Просмотр активности',
        description: 'Доступ к отчётам по активности пользователей',
        module: 'logs',
        category: 'monitoring',
    },

    // Accounts
    [PERMISSIONS.ACCOUNTS]: {
        code: PERMISSIONS.ACCOUNTS,
        title: 'Просмотр аккаунтов',
        description: 'Доступ к списку аккаунтов в компании',
        module: 'accounts',
        category: 'members',
    },
    [PERMISSIONS.ACCOUNTS_DELETE]: {
        code: PERMISSIONS.ACCOUNTS_DELETE,
        title: 'Удаление аккаунтов',
        description: 'Возможность удалять аккаунты из компании',
        module: 'accounts',
        category: 'members',
    },
    [PERMISSIONS.ACCOUNTS_SETTINGS]: {
        code: PERMISSIONS.ACCOUNTS_SETTINGS,
        title: 'Просмотр настроек аккаунта',
        description: 'Доступ к настройкам разрешений аккаунта',
        module: 'accounts',
        category: 'members',
    },
    [PERMISSIONS.ACCOUNTS_SETTINGS_UPDATE]: {
        code: PERMISSIONS.ACCOUNTS_SETTINGS_UPDATE,
        title: 'Изменение настроек аккаунта',
        description: 'Возможность изменять разрешения аккаунта',
        module: 'accounts',
        category: 'members',
    },
    [PERMISSIONS.ACCOUNTS_INVITATIONS]: {
        code: PERMISSIONS.ACCOUNTS_INVITATIONS,
        title: 'Просмотр приглашений',
        description: 'Доступ к списку активных приглашений',
        module: 'accounts',
        category: 'invites',
    },
    [PERMISSIONS.ACCOUNTS_INVITATIONS_CREATE]: {
        code: PERMISSIONS.ACCOUNTS_INVITATIONS_CREATE,
        title: 'Создание приглашений',
        description: 'Возможность приглашать новых участников в компанию',
        module: 'accounts',
        category: 'invites',
    },
    [PERMISSIONS.ACCOUNTS_INVITATIONS_REVOKE]: {
        code: PERMISSIONS.ACCOUNTS_INVITATIONS_REVOKE,
        title: 'Отзыв приглашений',
        description: 'Возможность отзывать отправленные приглашения',
        module: 'accounts',
        category: 'invites',
    },

    // HRM
    [PERMISSIONS.HRM]: {
        code: PERMISSIONS.HRM,
        title: 'Доступ к HRM',
        description: 'Базовый доступ к модулю управления персоналом',
        module: 'hrm',
        category: 'employees',
    },
    [PERMISSIONS.HRM_EMPLOYEES]: {
        code: PERMISSIONS.HRM_EMPLOYEES,
        title: 'Просмотр сотрудников',
        description: 'Доступ к списку сотрудников компании',
        module: 'hrm',
        category: 'employees',
    },
    [PERMISSIONS.HRM_EMPLOYEES_CREATE]: {
        code: PERMISSIONS.HRM_EMPLOYEES_CREATE,
        title: 'Создание сотрудников',
        description: 'Возможность добавлять новых сотрудников',
        module: 'hrm',
        category: 'employees',
    },
    [PERMISSIONS.HRM_EMPLOYEES_UPDATE]: {
        code: PERMISSIONS.HRM_EMPLOYEES_UPDATE,
        title: 'Редактирование сотрудников',
        description: 'Изменение данных сотрудников',
        module: 'hrm',
        category: 'employees',
    },
    [PERMISSIONS.HRM_POSITIONS]: {
        code: PERMISSIONS.HRM_POSITIONS,
        title: 'Просмотр должностей',
        description: 'Доступ к списку должностей',
        module: 'hrm',
        category: 'positions',
    },
    [PERMISSIONS.HRM_POSITIONS_CREATE]: {
        code: PERMISSIONS.HRM_POSITIONS_CREATE,
        title: 'Создание должностей',
        description: 'Возможность создавать новые должности',
        module: 'hrm',
        category: 'positions',
    },
    [PERMISSIONS.HRM_POSITIONS_UPDATE]: {
        code: PERMISSIONS.HRM_POSITIONS_UPDATE,
        title: 'Редактирование должностей',
        description: 'Изменение названия и описания должностей',
        module: 'hrm',
        category: 'positions',
    },
    [PERMISSIONS.HRM_POSITIONS_DELETE]: {
        code: PERMISSIONS.HRM_POSITIONS_DELETE,
        title: 'Удаление должностей',
        description: 'Возможность удалять должности',
        module: 'hrm',
        category: 'positions',
    },
    [PERMISSIONS.HRM_ANALYSIS]: {
        code: PERMISSIONS.HRM_ANALYSIS,
        title: 'Аналитика HRM',
        description: 'Доступ к отчётам по персоналу',
        module: 'hrm',
        category: 'analysis',
    },

    // FM
    [PERMISSIONS.FM]: {
        code: PERMISSIONS.FM,
        title: 'Доступ к финансам',
        description: 'Базовый доступ к финансовому модулю',
        module: 'fm',
        category: 'finance',
    },
    [PERMISSIONS.FM_TRANSACTIONS]: {
        code: PERMISSIONS.FM_TRANSACTIONS,
        title: 'Просмотр транзакций',
        description: 'Доступ к списку финансовых операций',
        module: 'fm',
        category: 'transactions',
    },
    [PERMISSIONS.FM_TRANSACTIONS_CREATE]: {
        code: PERMISSIONS.FM_TRANSACTIONS_CREATE,
        title: 'Создание транзакций',
        description: 'Возможность создавать новые финансовые операции',
        module: 'fm',
        category: 'transactions',
    },
    [PERMISSIONS.FM_TRANSACTIONS_REVERSE]: {
        code: PERMISSIONS.FM_TRANSACTIONS_REVERSE,
        title: 'Сторнирование транзакций',
        description: 'Возможность создавать обратные транзакции',
        module: 'fm',
        category: 'transactions',
    },
    [PERMISSIONS.FM_TRANSACTIONS_CATEGORIES]: {
        code: PERMISSIONS.FM_TRANSACTIONS_CATEGORIES,
        title: 'Просмотр категорий',
        description: 'Доступ к списку категорий транзакций',
        module: 'fm',
        category: 'categories',
    },
    [PERMISSIONS.FM_TRANSACTIONS_CATEGORIES_CREATE]: {
        code: PERMISSIONS.FM_TRANSACTIONS_CATEGORIES_CREATE,
        title: 'Создание категорий',
        description: 'Возможность создавать новые категории',
        module: 'fm',
        category: 'categories',
    },
    [PERMISSIONS.FM_TRANSACTIONS_CATEGORIES_UPDATE]: {
        code: PERMISSIONS.FM_TRANSACTIONS_CATEGORIES_UPDATE,
        title: 'Редактирование категорий',
        description: 'Изменение названий и описаний категорий',
        module: 'fm',
        category: 'categories',
    },
    [PERMISSIONS.FM_TRANSACTIONS_CATEGORIES_DELETE]: {
        code: PERMISSIONS.FM_TRANSACTIONS_CATEGORIES_DELETE,
        title: 'Удаление категорий',
        description: 'Возможность удалять категории',
        module: 'fm',
        category: 'categories',
    },
    [PERMISSIONS.FM_ANALYSIS]: {
        code: PERMISSIONS.FM_ANALYSIS,
        title: 'Аналитика финансов',
        description: 'Доступ к финансовым отчётам',
        module: 'fm',
        category: 'analysis',
    },
    [PERMISSIONS.FM_COUNTERPARTIES]: {
        code: PERMISSIONS.FM_COUNTERPARTIES,
        title: 'Просмотр контрагентов',
        description: 'Доступ к списку контрагентов',
        module: 'fm',
        category: 'counterparties',
    },
    [PERMISSIONS.FM_COUNTERPARTIES_CREATE]: {
        code: PERMISSIONS.FM_COUNTERPARTIES_CREATE,
        title: 'Создание контрагентов',
        description: 'Возможность добавлять новых контрагентов',
        module: 'fm',
        category: 'counterparties',
    },
    [PERMISSIONS.FM_COUNTERPARTIES_UPDATE]: {
        code: PERMISSIONS.FM_COUNTERPARTIES_UPDATE,
        title: 'Редактирование контрагентов',
        description: 'Изменение данных контрагентов',
        module: 'fm',
        category: 'counterparties',
    },
    [PERMISSIONS.FM_CREDITS]: {
        code: PERMISSIONS.FM_CREDITS,
        title: 'Просмотр кредитов',
        description: 'Доступ к списку кредитов и долгов',
        module: 'fm',
        category: 'credits',
    },
    [PERMISSIONS.FM_CREDITS_CREATE]: {
        code: PERMISSIONS.FM_CREDITS_CREATE,
        title: 'Создание кредитов',
        description: 'Возможность добавлять новые кредитные обязательства',
        module: 'fm',
        category: 'credits',
    },
    [PERMISSIONS.FM_CREDITS_UPDATE]: {
        code: PERMISSIONS.FM_CREDITS_UPDATE,
        title: 'Редактирование кредитов',
        description: 'Изменение условий кредитов',
        module: 'fm',
        category: 'credits',
    },
    [PERMISSIONS.FM_CREDITS_TRANSACTIONS]: {
        code: PERMISSIONS.FM_CREDITS_TRANSACTIONS,
        title: 'Просмотр платежей по кредитам',
        description: 'Доступ к истории платежей по кредитам',
        module: 'fm',
        category: 'credits',
    },
    [PERMISSIONS.FM_CREDITS_PAY]: {
        code: PERMISSIONS.FM_CREDITS_PAY,
        title: 'Оплата кредитов',
        description: 'Возможность вносить платежи по кредитам',
        module: 'fm',
        category: 'credits',
    },

    // CRM
    [PERMISSIONS.CRM]: {
        code: PERMISSIONS.CRM,
        title: 'Доступ к CRM',
        description: 'Базовый доступ к модулю работы с клиентами',
        module: 'crm',
        category: 'clients',
    },
    [PERMISSIONS.CRM_CLIENTS]: {
        code: PERMISSIONS.CRM_CLIENTS,
        title: 'Просмотр клиентов',
        description: 'Доступ к списку клиентов',
        module: 'crm',
        category: 'clients',
    },
    [PERMISSIONS.CRM_CLIENTS_CREATE]: {
        code: PERMISSIONS.CRM_CLIENTS_CREATE,
        title: 'Создание клиентов',
        description: 'Возможность добавлять новых клиентов',
        module: 'crm',
        category: 'clients',
    },
    [PERMISSIONS.CRM_CLIENTS_UPDATE]: {
        code: PERMISSIONS.CRM_CLIENTS_UPDATE,
        title: 'Редактирование клиентов',
        description: 'Изменение данных клиентов',
        module: 'crm',
        category: 'clients',
    },
    [PERMISSIONS.CRM_SOURCES]: {
        code: PERMISSIONS.CRM_SOURCES,
        title: 'Просмотр источников',
        description: 'Доступ к списку источников клиентов',
        module: 'crm',
        category: 'sources',
    },
    [PERMISSIONS.CRM_SOURCES_CREATE]: {
        code: PERMISSIONS.CRM_SOURCES_CREATE,
        title: 'Создание источников',
        description: 'Возможность добавлять новые источники',
        module: 'crm',
        category: 'sources',
    },
    [PERMISSIONS.CRM_SOURCES_UPDATE]: {
        code: PERMISSIONS.CRM_SOURCES_UPDATE,
        title: 'Редактирование источников',
        description: 'Изменение названий источников',
        module: 'crm',
        category: 'sources',
    },
    [PERMISSIONS.CRM_ANALYSIS]: {
        code: PERMISSIONS.CRM_ANALYSIS,
        title: 'Аналитика CRM',
        description: 'Доступ к отчётам по клиентам',
        module: 'crm',
        category: 'analysis',
    },

    // WM
    [PERMISSIONS.WM]: {
        code: PERMISSIONS.WM,
        title: 'Доступ к складу',
        description: 'Базовый доступ к модулю складского учёта',
        module: 'wm',
        category: 'warehouse',
    },
    [PERMISSIONS.WM_CATALOG]: {
        code: PERMISSIONS.WM_CATALOG,
        title: 'Просмотр каталога',
        description: 'Доступ к каталогу товаров',
        module: 'wm',
        category: 'catalog',
    },
    [PERMISSIONS.WM_CATALOG_CATEGORIES]: {
        code: PERMISSIONS.WM_CATALOG_CATEGORIES,
        title: 'Просмотр категорий',
        description: 'Доступ к категориям каталога',
        module: 'wm',
        category: 'catalog',
    },
    [PERMISSIONS.WM_CATALOG_CATEGORIES_CREATE]: {
        code: PERMISSIONS.WM_CATALOG_CATEGORIES_CREATE,
        title: 'Создание категорий',
        description: 'Возможность создавать новые категории',
        module: 'wm',
        category: 'catalog',
    },
    [PERMISSIONS.WM_CATALOG_CATEGORIES_UPDATE]: {
        code: PERMISSIONS.WM_CATALOG_CATEGORIES_UPDATE,
        title: 'Редактирование категорий',
        description: 'Изменение категорий каталога',
        module: 'wm',
        category: 'catalog',
    },
    [PERMISSIONS.WM_CATALOG_UNITS]: {
        code: PERMISSIONS.WM_CATALOG_UNITS,
        title: 'Просмотр товаров',
        description: 'Доступ к списку товаров',
        module: 'wm',
        category: 'catalog',
    },
    [PERMISSIONS.WM_CATALOG_UNITS_CREATE]: {
        code: PERMISSIONS.WM_CATALOG_UNITS_CREATE,
        title: 'Создание товаров',
        description: 'Возможность добавлять новые товары',
        module: 'wm',
        category: 'catalog',
    },
    [PERMISSIONS.WM_CATALOG_UNITS_UPDATE]: {
        code: PERMISSIONS.WM_CATALOG_UNITS_UPDATE,
        title: 'Редактирование товаров',
        description: 'Изменение данных товаров',
        module: 'wm',
        category: 'catalog',
    },
    [PERMISSIONS.WM_STOCKS]: {
        code: PERMISSIONS.WM_STOCKS,
        title: 'Просмотр склада',
        description: 'Доступ к складским остаткам',
        module: 'wm',
        category: 'stocks',
    },
    [PERMISSIONS.WM_STOCKS_BATCHES]: {
        code: PERMISSIONS.WM_STOCKS_BATCHES,
        title: 'Просмотр партий',
        description: 'Доступ к списку партий товаров',
        module: 'wm',
        category: 'stocks',
    },
    [PERMISSIONS.WM_STOCKS_BATCHES_CREATE]: {
        code: PERMISSIONS.WM_STOCKS_BATCHES_CREATE,
        title: 'Создание партий',
        description: 'Возможность создавать новые партии',
        module: 'wm',
        category: 'stocks',
    },
    [PERMISSIONS.WM_STOCKS_POSITIONS]: {
        code: PERMISSIONS.WM_STOCKS_POSITIONS,
        title: 'Просмотр позиций',
        description: 'Доступ к детальным складским позициям',
        module: 'wm',
        category: 'stocks',
    },
    [PERMISSIONS.WM_STOCKS_BALANCE]: {
        code: PERMISSIONS.WM_STOCKS_BALANCE,
        title: 'Просмотр остатков',
        description: 'Доступ к остаткам на складе',
        module: 'wm',
        category: 'stocks',
    },

    // DM
    [PERMISSIONS.DM]: {
        code: PERMISSIONS.DM,
        title: 'Доступ к сделкам',
        description: 'Базовый доступ к модулю управления сделками',
        module: 'dm',
        category: 'deals',
    },
    [PERMISSIONS.DM_TYPES]: {
        code: PERMISSIONS.DM_TYPES,
        title: 'Просмотр типов сделок',
        description: 'Доступ к списку типов сделок',
        module: 'dm',
        category: 'types',
    },
    [PERMISSIONS.DM_TYPES_CREATE]: {
        code: PERMISSIONS.DM_TYPES_CREATE,
        title: 'Создание типов сделок',
        description: 'Возможность создавать новые типы',
        module: 'dm',
        category: 'types',
    },
    [PERMISSIONS.DM_TYPES_UPDATE]: {
        code: PERMISSIONS.DM_TYPES_UPDATE,
        title: 'Редактирование типов сделок',
        description: 'Изменение названий типов',
        module: 'dm',
        category: 'types',
    },
    [PERMISSIONS.DM_TYPES_DELETE]: {
        code: PERMISSIONS.DM_TYPES_DELETE,
        title: 'Удаление типов сделок',
        description: 'Возможность удалять типы',
        module: 'dm',
        category: 'types',
    },
    [PERMISSIONS.DM_STATUSES]: {
        code: PERMISSIONS.DM_STATUSES,
        title: 'Просмотр статусов',
        description: 'Доступ к списку статусов сделок',
        module: 'dm',
        category: 'statuses',
    },
    [PERMISSIONS.DM_STATUSES_CREATE]: {
        code: PERMISSIONS.DM_STATUSES_CREATE,
        title: 'Создание статусов',
        description: 'Возможность создавать новые статусы',
        module: 'dm',
        category: 'statuses',
    },
    [PERMISSIONS.DM_STATUSES_UPDATE]: {
        code: PERMISSIONS.DM_STATUSES_UPDATE,
        title: 'Редактирование статусов',
        description: 'Изменение названий и порядка статусов',
        module: 'dm',
        category: 'statuses',
    },
    [PERMISSIONS.DM_STATUSES_DELETE]: {
        code: PERMISSIONS.DM_STATUSES_DELETE,
        title: 'Удаление статусов',
        description: 'Возможность удалять статусы',
        module: 'dm',
        category: 'statuses',
    },
    [PERMISSIONS.DM_DEALS]: {
        code: PERMISSIONS.DM_DEALS,
        title: 'Просмотр сделок',
        description: 'Доступ к списку сделок',
        module: 'dm',
        category: 'deals',
    },
    [PERMISSIONS.DM_DEALS_CREATE]: {
        code: PERMISSIONS.DM_DEALS_CREATE,
        title: 'Создание сделок',
        description: 'Возможность создавать новые сделки',
        module: 'dm',
        category: 'deals',
    },
    [PERMISSIONS.DM_DEALS_UPDATE]: {
        code: PERMISSIONS.DM_DEALS_UPDATE,
        title: 'Редактирование сделок',
        description: 'Изменение данных сделок',
        module: 'dm',
        category: 'deals',
    },
    [PERMISSIONS.DM_DEALS_DELETE]: {
        code: PERMISSIONS.DM_DEALS_DELETE,
        title: 'Удаление сделок',
        description: 'Возможность удалять сделки',
        module: 'dm',
        category: 'deals',
    },
    [PERMISSIONS.DM_ANALYSIS]: {
        code: PERMISSIONS.DM_ANALYSIS,
        title: 'Аналитика сделок',
        description: 'Доступ к отчётам по сделкам',
        module: 'dm',
        category: 'analysis',
    },
    [PERMISSIONS.DM_DEALS_TRANSACTIONS]: {
        code: PERMISSIONS.DM_DEALS_TRANSACTIONS,
        title: 'Финансовые операции сделки',
        description: 'Доступ к финансовой истории ведения сделки',
        module: 'dm',
        category: 'deals',
    },
    [PERMISSIONS.DM_DEALS_TRANSACTIONS_CREATE]: {
        code: PERMISSIONS.DM_DEALS_TRANSACTIONS_CREATE,
        title: 'Создание финансовых операций сделки',
        description: 'Финансовая история сделки',
        module: 'dm',
        category: 'deals',
    },
    [PERMISSIONS.DM_DEALS_TRANSACTIONS_SUMMARY]: {
        code: PERMISSIONS.DM_DEALS_TRANSACTIONS_SUMMARY,
        title: 'Финансовый итог сделки',
        description: 'Получение сводки финансов по сделке',
        module: 'dm',
        category: 'deals',
    },
};

export const getPermissionMeta = (code: PermissionCode): PermissionMeta | undefined => {
    return PERMISSIONS_META[code];
};

export const getPermissionsMetaByModule = (module: string): PermissionMeta[] => {
    return Object.values(PERMISSIONS_META).filter(meta => meta.module === module);
};

export const getPermissionsMetaByCategory = (module: string, category: string): PermissionMeta[] => {
    return Object.values(PERMISSIONS_META).filter(
        meta => meta.module === module && meta.category === category
    );
};

export const getAllPermissionsMeta = (): PermissionMeta[] => {
    return Object.values(PERMISSIONS_META);
};