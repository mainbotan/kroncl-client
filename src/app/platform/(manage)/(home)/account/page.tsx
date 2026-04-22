'use client';

import { useAuth } from '@/apps/account/auth/context/AuthContext';
import styles from './page.module.scss';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerChildren, boxHover } from './_animations';
import { Account } from '@/apps/account/types';
import { accountAuth } from '@/apps/account/auth/api';
import Edit from '@/assets/ui-kit/icons/edit';
import Exit from '@/assets/ui-kit/icons/exit';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { DOCS_LINK_ACCOUNT } from '@/app/docs/(v1)/internal.config';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormUnify, PlatformFormVariants } from '@/app/platform/components/lib/form';
import { formatDate } from '@/assets/utils/date';
import { generateSlug } from '@/assets/utils/slug';
import { useMessage } from '@/app/platform/components/lib/message/provider';

export const getAuthMethodName = (id: string): string => {
    const names: Record<string, string> = {
        password: 'по паролю',
        yandex: 'Яндекс ID',
        google: 'Google',
        github: 'Github',
    };
    return names[id] || id;
};

export default function Page() {
    const [profile, setProfile] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showMessage } = useMessage();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: ''
    });
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const { logoutLocal } = useAuth();
    
    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const response = await accountAuth.getProfile();
                
                if (response.status && response.data) {
                    setProfile(response.data);
                    setFormData({
                        name: response.data.name || '',
                        description: response.data.description || '',
                        type: response.data.type || ''
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

    const handleSave = async () => {
        if (!formData.name.trim()) return;
        
        if (formData.name === profile?.name && 
            formData.description === profile?.description && 
            formData.type === profile?.type) return;

        try {
            setSaving(true);
            
            const updateData: any = {};
            if (formData.name !== profile?.name) updateData.name = formData.name;
            if (formData.description !== profile?.description) updateData.description = formData.description;
            if (formData.type !== profile?.type) updateData.type = formData.type;
            
            const response = await accountAuth.updateProfile(updateData);
            
            if (response.status && response.data) {
                setProfile(response.data);
                showMessage({
                    label: 'Данные аккаунта изменены',
                    variant: 'success'
                })
            } else {
                throw new Error(response.message || 'Ошибка обновления');
            }
        } catch (error: any) {
            console.error('Ошибка при сохранении профиля:', error);
            
            showMessage({
                label: error.message || 'Не удалось обновить данные',
                variant: 'error'
            });
        } finally {
            setSaving(false);
        }
    };
    
    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }
    
    if (!profile) {
        return null;
    }
    
    const slug = generateSlug(formData.name || profile.name);
    const hasChanges = formData.name !== profile.name || 
                       formData.description !== profile.description || 
                       formData.type !== profile.type;
    
    return (
        <>
            <PlatformHead
                title='Управление аккаунтом.'
                description='Настройки вашей учётной записи.'
                actions={[
                    {
                        variant: 'accent',
                        children: saving ? 'Сохранение...' : 'Сохранить изменения',
                        icon: <Edit />,
                        onClick: handleSave,
                        disabled: saving || !formData.name.trim() || !hasChanges
                    }
                ]}
                docsEscort={{
                    href: DOCS_LINK_ACCOUNT,
                    title: 'Подробнее о личной учётной записи.'
                }}
            />
            <PlatformFormBody>
                <PlatformFormSection title='Имя аккаунта'>
                    <PlatformFormUnify>
                        <PlatformFormInput 
                            value={formData.name}
                            onChange={(val) => setFormData(prev => ({ ...prev, name: val }))}
                            placeholder='Ваше имя'
                        />
                        <PlatformFormInput 
                            value={slug}
                            variant='glass'
                            placeholder='@'
                            readOnly
                            onChange={() => {}}
                        />
                    </PlatformFormUnify>
                </PlatformFormSection>
                
                <PlatformFormSection 
                    title='Почта' 
                    description={(
                        <>
                        Почта аккаунта статична и определяется один раз при создании аккаунта. 
                        <br />
                        Именно на неё приходят <span className={styles.hint}>приглашения от организаций</span>.
                        </>
                    )}>
                    <PlatformFormInput
                        value={profile.email}
                        readOnly
                        onChange={() => {}}
                    />
                </PlatformFormSection>

                <PlatformFormSection 
                    title='Статус' 
                    description='Статус будет доступен для просмотра вашим коллегам.'>
                    <PlatformFormInput
                        value={formData.description}
                        onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                        placeholder='Сплю...'
                        maxLength={100}
                    />
                </PlatformFormSection>

                <PlatformFormSection 
                    title='Кто вы?' 
                    description='Эта информация может помочь специалистам поддержки при общении с вами.'>
                    <PlatformFormVariants
                        value={formData.type}
                        onChange={(val) => setFormData(prev => ({ ...prev, type: val }))}
                        options={[
                            {
                                value: 'owner',
                                label: 'Владелец организации',
                                description: 'Владеете одной/несколькими организациями.'
                            },
                            {
                                value: 'employee',
                                label: 'Сотрудник',
                                description: 'Штатный сотрудник организации. Принимаете участие в ведениии учета.'
                            },
                            {
                                value: 'admin',
                                label: 'Администратор',
                                description: 'Технический администратор организации. Настройка пространства, отслеживание лимитов диска, мониторинг активности.'
                            },
                            {
                                value: 'outsourcing',
                                label: 'Аутсорс-финансист',
                                description: 'Используете платформу для организации учёта компаний-заказчиков.'
                            },
                            {
                                value: 'tech',
                                label: 'Разработчик',
                                description: 'Используете платформу в целях баг-хантинга / изучения функционала.'
                            }
                        ]}
                    />
                </PlatformFormSection>
            </PlatformFormBody>
            <div className={styles.footer}>
                <div className={styles.section}>
                    <div className={styles.line} />
                    <div className={styles.info}>Метод авторизации: <span className={styles.hint}>{getAuthMethodName(profile.auth_type)}</span></div>
                </div>
                <div className={styles.section}>
                    <div className={styles.line} />
                    <div className={styles.info}>Последнее обновление <span className={styles.hint}>{formatDate(profile.updated_at)}</span></div>
                </div>
                <div className={styles.section}>
                    <div className={styles.line} />
                    <div className={styles.info}>Аккаунт создан <span className={styles.hint}>{formatDate(profile.created_at)}</span></div>
                </div>
            </div>
        </>  
    );
}