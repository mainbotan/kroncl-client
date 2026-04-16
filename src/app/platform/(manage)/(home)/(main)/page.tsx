'use client';

import Wallet from '@/assets/ui-kit/icons/wallet';
import Settings from '@/assets/ui-kit/icons/settings';
import Account from '@/assets/ui-kit/icons/account';
import { PlatformDivorce } from '@/app/platform/components/lib/divorce/divorce';
import { useAuth } from '@/apps/account/auth/context/AuthContext';
import Collection from '@/assets/ui-kit/icons/collection';
import Plus from '@/assets/ui-kit/icons/plus';
import Package from '@/assets/ui-kit/icons/package';
import Book from '@/assets/ui-kit/icons/book';
import Dev from '@/assets/ui-kit/icons/dev';
import { DivorceSection } from '@/app/platform/components/lib/divorce/_types';
import Business from '@/assets/ui-kit/icons/business';

export default function Page() {
    const { user } = useAuth();
    
    const sections: DivorceSection[] = [
        {
            title: "Создать компанию",
            description: "Создание пространства для новой компании. Новый настройки тарификации.",
            icon: Business,
            accent: true,
            href: "/platform/companies/new",
            // img: '/images/docs/company-logs.png'
        },
        {
            title: "Ваши организации",
            description: "Смотреть организации, в которых вы является гостем или владельцем.",
            icon: Collection,
            href: "/platform/companies"
        },
        {
            title: "База знаний",
            description: "Полное руководство использования платформы от авторов.",
            icon: Book,
            href: "/docs"
        },
    ];
    
    return (
        <PlatformDivorce
            subtitle='Панель управления аккаунтом.'
            title={`Добро пожаловать, ${user?.name}!`}
            description="С чего начнём?"
            sections={sections}
        />
    );
}