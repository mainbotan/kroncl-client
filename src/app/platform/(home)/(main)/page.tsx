'use client';

import Wallet from '@/assets/ui-kit/icons/wallet';
import Settings from '@/assets/ui-kit/icons/settings';
import Account from '@/assets/ui-kit/icons/account';
import { PlatformDivorce } from '../../components/lib/divorce/divorce';
import { useAuth } from '@/apps/account/auth/context/AuthContext';
import Collection from '@/assets/ui-kit/icons/collection';
import Plus from '@/assets/ui-kit/icons/plus';
import Package from '@/assets/ui-kit/icons/package';
import Book from '@/assets/ui-kit/icons/book';
import Dev from '@/assets/ui-kit/icons/dev';

export default function Page() {
    const { user } = useAuth();
    
    const sections = [
        {
            title: "Создать компанию",
            description: "Создание пространства для новой компании.",
            icon: Package,
            accent: true,
            href: "/platform/companies/new"
        },
        {
            title: "Ваши организации",
            description: "Смотреть организации, в которых вы состоите.",
            icon: Collection,
            href: "/platform/companies"
        },
        {
            title: "Документация",
            description: "Смотреть организации, в которых вы состоите.",
            icon: Book,
            href: "/platform/companies"
        },
        {
            title: "Разработчикам",
            description: "Смотреть организации, в которых вы состоите.",
            icon: Dev,
            href: "/platform/companies"
        },
        {
            title: "Аккаунт",
            description: "Смотреть организации, в которых вы состоите.",
            icon: Account,
            href: "/platform/companies"
        },
        {
            title: "Пригласите сотрудников",
            description: "Смотреть организации, в которых вы состоите.",
            href: "/platform/companies"
        },
    ];
    
    return (
        <PlatformDivorce
            title={`Добро пожаловать, ${user?.name}!`}
            description="С чего начнём?"
            sections={sections}
        />
    );
}