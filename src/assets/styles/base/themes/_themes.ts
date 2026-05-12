export interface Theme {
    id: string;
    capture: string;
    description?: string;
    cover?: string;
}

export const _themes: Theme[] = [
    {
        id: 'dark',
        capture: 'Classic dark',
        description: 'Однотонный элементы',
        cover: '/images/themes/dark.png'
    },
    {
        id: 'dark-violet',
        capture: 'Violet dark',
        description: 'Градиент с фиолетовым оттенком',
        cover: '/images/themes/dark-violet.png'
    },
    {
        id: 'light',
        capture: 'Classic light',
        description: 'Однотонные элементы',
        cover: '/images/themes/light.png'
    },
    {
        id: 'light-violet',
        capture: 'Violet light',
        description: 'Градиент с фиолетовым оттенком',
        cover: '/images/themes/light-violet.png'
    },
    {
        id: 'noire',
        capture: 'Total black',
        description: 'Оттенки чёрного',
        cover: '/images/themes/noire.png'
    },
]