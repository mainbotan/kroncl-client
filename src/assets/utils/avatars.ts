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