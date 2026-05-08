export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

export function formatTime(dateString: string, showTimezone?: boolean): string {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    if (showTimezone) {
        const timezone = date.toLocaleTimeString('ru-RU', {
            timeZoneName: 'short'
        }).split(' ').pop();
        return `${time} ${timezone}`;
    }
    
    return time;
}

export function formatDateTime(dateString: string, showTimezone?: boolean): string {
    const date = formatDate(dateString);
    const time = formatTime(dateString, showTimezone);
    return `${date} в ${time}`;
}

export function pluralizeDays(days: number): string {
    const absDays = Math.abs(days);
    const lastDigit = absDays % 10;
    const lastTwoDigits = absDays % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'дней';
    }
    
    if (lastDigit === 1) {
        return 'день';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'дня';
    }
    
    return 'дней';
}
export function formatRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    if (targetDate.getTime() === today.getTime()) {
        return 'сегодня';
    }
    
    if (targetDate.getTime() === yesterday.getTime()) {
        return 'вчера';
    }
    
    const diffDays = Math.floor((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
        return `${diffDays} дня назад`;
    }
    
    return formatDate(dateString);
}

// с поясом для статуса
export function getStatusDateWithLabel(dateString: string): string {
    const relative = formatRelativeDate(dateString);
    const full = formatDate(dateString);
    
    if (relative === 'сегодня' || relative === 'вчера') {
        return relative;
    }
    
    return full;
}