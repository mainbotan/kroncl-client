import { Account } from "@/apps/account/types";

export const getRandomGradient = (user: Account) => {
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
        'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
        'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
    ];
    
    // Генерируем рандомный индекс на основе email или имени пользователя
    const seed = user?.email || user?.name || Math.random().toString();
    const index = Math.abs(
        seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % gradients.length;
    
    return gradients[index];
};

/**
 * Получает первую букву для аватарки из строки
 * Поддерживает любые алфавиты (кириллица, латиница, etc)
 */
export function getFirstLetter(text: string): string {
    if (!text || typeof text !== 'string') {
        return 'C'; // Company fallback
    }
    
    const trimmed = text.trim();
    if (trimmed.length === 0) {
        return 'C';
    }
    
    // Берем первый символ и переводим в верхний регистр
    const firstChar = trimmed.charAt(0);
    
    // Используем Intl для правильной поддержки Unicode
    try {
        return firstChar.toLocaleUpperCase('ru-RU');
    } catch {
        return firstChar.toUpperCase();
    }
}

/**
 * Генерирует детерминированный цвет на основе строки
 * @returns CSS цвет в формате hex (#RRGGBB)
 */
export function getColorFromString(text: string): string {
    if (!text || typeof text !== 'string') {
        return '#3b82f6'; // Синий по умолчанию
    }
    
    // Предопределенные цвета (можно настроить под дизайн)
    const colors = [
        '#3b82f6', // blue-500
        '#10b981', // emerald-500
        '#f59e0b', // amber-500
        '#ef4444', // red-500
        '#8b5cf6', // violet-500
        '#ec4899', // pink-500
        '#06b6d4', // cyan-500
        '#84cc16', // lime-500
        '#f97316', // orange-500
        '#6366f1', // indigo-500
        '#14b8a6', // teal-500
        '#a855f7', // purple-500
    ];
    
    // Простой и эффективный hash для строки
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        // Используем charCodeAt для поддержки Unicode
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32bit integer
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

/**
 * Генерирует градиент на основе строки
 * @returns CSS градиент
 */
export function getGradientFromString(text: string): string {
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
        'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    ];
    
    if (!text) {
        return gradients[0];
    }
    
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
}

/**
 * Получает индекс цвета для CSS классов (0-7)
 */
export function getColorIndex(text: string): number {
    if (!text) return 0;
    
    let hash = 0;
    for (let i = 0; i < Math.min(text.length, 3); i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return Math.abs(hash) % 8;
}