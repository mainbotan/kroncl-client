'use client';

import { useState } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus } from "@/app/platform/components/lib/form";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useAccounts } from "@/apps/company/modules";
import Button from "@/assets/ui-kit/button/button";
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';

export default function Page() {
    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.ACCOUNTS_INVITATIONS_CREATE, {allowExpired: true})
    
    const accountsModule = useAccounts();
    const { showMessage } = useMessage();
    const [email, setEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        
        if (!value) {
            setEmailStatus('idle');
            return;
        }

        setEmailStatus(validateEmail(value) ? 'valid' : 'invalid');
    };

    const handleInvite = async () => {
        if (!validateEmail(email) || isLoading) return;

        setIsLoading(true);
        try {
            await accountsModule.inviteAccount({ email });
            showMessage({
                label: 'Приглашение успешно отправлено',
                variant: 'success'
            });
            setEmail('');
            setEmailStatus('idle');
            setTimeout(() => {
                router.back();
            }, 1000);
        } catch (error: any) {
            const errorMessage = error.message || 'Не удалось отправить приглашение';
            showMessage({
                label: 'Не удалось отправить приглашение',
                variant: 'error',
                about: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    };


    if (ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    )

    if (!ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.ACCOUNTS_INVITATIONS_CREATE} />
    )

    const statusInfo = emailStatus === 'valid' ? {
        type: 'success' as const,
        icon: <SuccessStatus />,
        message: 'Почта валидна'
    } : emailStatus === 'invalid' ? {
        type: 'error' as const,
        icon: <ErrorStatus />,
        message: 'Некорректный email'
    } : null;

    return (
        <>
            <PlatformHead
                title="Приглашение сотрудника"
                description='Если пользователь с указанной почтой ещё не был зарегистрирован в системе, мы вышлем письмо на указанную почту - все исходящие приглашения никуда не исчезнут.'
            />
            <PlatformFormBody>
                <PlatformFormSection title="Почта сотрудника">
                    <PlatformFormInput
                        type='text'
                        maxLength={100}
                        placeholder="До 32 символов"
                        value={email}
                        onChange={handleEmailChange}
                        disabled={isLoading}
                    />
                    
                    {emailStatus !== 'idle' && statusInfo && (
                        <PlatformFormStatus
                            type={statusInfo.type}
                            message={statusInfo.message}
                            icon={statusInfo.icon}
                        />
                    )}
                </PlatformFormSection>
                <section>
                    <Button
                        variant="accent"
                        onClick={handleInvite}
                        disabled={emailStatus !== 'valid' || isLoading}
                    >
                        {isLoading ? 'Инициализация...' : 'Пригласить'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}