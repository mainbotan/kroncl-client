'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { PlatformFormBody, PlatformFormSection, PlatformFormInput } from '@/app/platform/components/lib/form';
import Button from '@/assets/ui-kit/button/button';
import { useState, useEffect, useCallback } from 'react';
import { accountAuth } from '@/apps/account/auth/api';
import { Account } from '@/apps/account/types';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformFormStatus } from '@/app/platform/components/lib/form';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import { useRouter } from 'next/navigation';

type FormData = {
    name: string;
};

type FormStatus = {
    type: 'idle' | 'success' | 'error' | 'loading';
    message: string;
};

export default function ProfileEditPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<FormData>({ name: '' });
    const [formStatus, setFormStatus] = useState<FormStatus>({
        type: 'idle',
        message: ''
    });
    const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const response = await accountAuth.getProfile();
                
                if (response.status && response.data) {
                    setProfile(response.data);
                    setFormData({
                        name: response.data.name || ''
                    });
                } else {
                    console.error('Не удалось загрузить профиль:', response.message);
                }
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    // Очистка таймера при размонтировании
    useEffect(() => {
        return () => {
            if (redirectTimer) {
                clearTimeout(redirectTimer);
            }
        };
    }, [redirectTimer]);

    // Обработчик изменения имени
    const handleNameChange = useCallback((value: string) => {
        setFormData(prev => ({
            ...prev,
            name: value
        }));
        
        // Сбрасываем статус при изменении
        if (formStatus.type !== 'idle') {
            setFormStatus({ type: 'idle', message: '' });
        }
    }, [formStatus.type]);

    const handleSave = async () => {
        if (!formData.name.trim()) {
            setFormStatus({
                type: 'error',
                message: 'Имя не может быть пустым'
            });
            return;
        }

        if (formData.name === profile?.name) {
            setFormStatus({
                type: 'error',
                message: 'Имя не изменилось'
            });
            return;
        }

        try {
            setSaving(true);
            setFormStatus({ type: 'loading', message: 'Сохранение...' });

            const response = await accountAuth.updateProfile({
                name: formData.name
            });

            if (response.status && response.data) {
                setProfile(response.data);
                setFormStatus({
                    type: 'success',
                    message: 'Профиль успешно обновлен.'
                });
                
                // Устанавливаем таймер для редиректа
                const timer = setTimeout(() => {
                    router.push('/platform/account');
                }, 3000);
                
                setRedirectTimer(timer);
                
            } else {
                setFormStatus({
                    type: 'error',
                    message: response.message || 'Ошибка при обновлении профиля'
                });
            }
        } catch (error) {
            console.error('Ошибка при сохранении профиля:', error);
            setFormStatus({
                type: 'error',
                message: 'Неизвестная ошибка при сохранении'
            });
        } finally {
            setSaving(false);
        }
    };

    const getStatusInfo = () => {
        switch (formStatus.type) {
            case 'success':
                return {
                    type: 'success' as const,
                    icon: <SuccessStatus />,
                    message: formStatus.message
                };
            case 'error':
                return {
                    type: 'error' as const,
                    icon: <ErrorStatus />,
                    message: formStatus.message
                };
            case 'loading':
                return {
                    type: 'info' as const,
                    icon: null,
                    message: formStatus.message
                };
            case 'idle':
            default:
                return {
                    type: 'info' as const,
                    icon: null,
                    message: ''
                };
        }
    };

    if (loading) {
        return <PlatformLoading capture="Загружаем профиль..." />;
    }

    const statusInfo = getStatusInfo();

    return (
        <>
            <PlatformHead
                title="Редактирование аккаунта"
                description="Изменение данных профиля."
            />
            
            <PlatformFormBody>
                <PlatformFormSection
                    title="Имя"
                    description="Это имя видно вашим коллегам по организациям."
                >
                    <PlatformFormInput
                        value={formData.name}
                        onChange={handleNameChange}
                        placeholder="Введите ваше имя"
                        maxLength={50}
                        disabled={saving}
                    />
                    
                    {/* Отображаем статус формы */}
                    {formStatus.type !== 'idle' && (
                        <PlatformFormStatus
                            type={statusInfo.type}
                            message={statusInfo.message}
                            icon={statusInfo.icon}
                        />
                    )}
                </PlatformFormSection>

                <section className={styles.actions}>
                    <Button
                        variant="accent"
                        onClick={handleSave}
                        disabled={saving || !formData.name.trim() || formData.name === profile?.name}
                    >
                        {saving ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}