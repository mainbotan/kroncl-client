import { StructureBlock } from './sections/structure/block';
import { SecurityBlock } from './sections/security/block';

export type TabId = 'modules' | 'security';

export interface TabConfig {
    id: TabId;
    label: string;
    component: React.ComponentType;
}

export const tabs: TabConfig[] = [
    {
        id: 'modules',
        label: 'Модули',
        component: StructureBlock
    },
    {
        id: 'security',
        label: 'Безопасность',
        component: SecurityBlock
    }
];