export const formatSize = (valueMb: number): string => {
    if (valueMb >= 1024 * 1024) {
        return `${(valueMb / (1024 * 1024)).toFixed(2)} ТБ`;
    }
    if (valueMb >= 1024) {
        return `${(valueMb / 1024).toFixed(0)} ГБ`;
    }
    return `${valueMb} МБ`;
};
