export const formatSize = (valueMb: number, round: boolean = true): string => {
    if (valueMb >= 1024 * 1024) {
        return `${(valueMb / (1024 * 1024)).toFixed(2)} ТБ`;
    }
    if (valueMb >= 1024) {
        const value = valueMb / 1024;
        return `${round ? Math.round(value) : value.toFixed(1)} ГБ`;
    }
    return `${round ? Math.round(valueMb) : valueMb.toFixed(1)} МБ`;
};