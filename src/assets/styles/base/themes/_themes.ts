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
        description: 'Background gradient',
        cover: '/images/themes/dark.png'
    },
    {
        id: 'dark-violet',
        capture: 'Violet dark',
        description: 'Background gradient',
        cover: '/images/themes/dark-violet.png'
    },
    {
        id: 'light',
        capture: 'Classic light',
        description: 'Background gradient',
        cover: '/images/themes/light.png'
    },
    {
        id: 'light-violet',
        capture: 'Violet light',
        description: 'Background gradient',
        cover: '/images/themes/light-violet.png'
    },
    {
        id: 'noire',
        capture: 'Total black',
        description: 'Background gradient',
        cover: '/images/themes/noire.png'
    },
]