'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformFormBody, PlatformFormSection, PlatformFormVariants } from '@/app/platform/components/lib/form';
import Button from '@/assets/ui-kit/button/button';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { fingerprintsApi } from '@/apps/account/fingerprints/api';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import Copy from '@/assets/ui-kit/icons/copy';
import styles from './page.module.scss';
import { CreateFingerprintResponse } from '@/apps/account/fingerprints/types';
import Input from '@/assets/ui-kit/input/input';

export default function Page() {
    const router = useRouter();
    const { showMessage } = useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [expiresIn, setExpiresIn] = useState<string>('0');
    const [createdKey, setCreatedKey] = useState<CreateFingerprintResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            let expiresInValue: string | undefined = undefined;
            
            if (expiresIn !== '0') {
                expiresInValue = expiresIn;
            }

            const response = await fingerprintsApi.createFingerprint(
                expiresInValue ? { expires_in: expiresInValue } : undefined
            );

            if (response.status) {
                setCreatedKey(response.data);
                setIsModalOpen(true);
            } else {
                throw new Error(response.message || 'Ошибка создания ключа');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось создать ключ',
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyAndRedirect = () => {
        if (createdKey?.key) {
            navigator.clipboard.writeText(createdKey.key);
            showMessage({
                label: 'Ключ скопирован',
                variant: 'success'
            });
            setIsModalOpen(false);
            router.push('/platform/security');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        router.push('/platform/security');
    };

    return (
        <>
            <PlatformHead
                title='Новый ключ доступа'
                description='Создание нового отпечатка для входа по ключу'
            />
            <PlatformFormBody>
                <PlatformFormSection title='Срок действия'>
                    <PlatformFormVariants
                        options={[
                            {
                                value: '0',
                                label: 'Бессрочно',
                            },
                            {
                                value: '720h',  // 30 дней
                                label: '30 дней',
                            },
                            {
                                value: '2160h', // 90 дней
                                label: '90 дней',
                            },
                            {
                                value: '8760h', // 365 дней
                                label: '1 год',
                            }
                        ]}
                        value={expiresIn}
                        onChange={setExpiresIn}
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                <section className={styles.actions}>
                    <Button
                        variant='light'
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        Отмена
                    </Button>
                    <Button
                        variant='accent'
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Создание...' : 'Создать ключ'}
                    </Button>
                </section>
            </PlatformFormBody>

            <PlatformModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            >
                <div className={styles.modal}>
                    <div className={styles.head}>Ключ создан</div>
                    <div className={styles.value}>
                        <Input className={styles.input} fullWidth variant='default' value={createdKey?.key} readOnly />
                    </div>
                    <div className={styles.display}>
                        {/* <Button
                            variant='default'
                            onClick={handleCloseModal}
                            children='Домой'
                            className={styles.action}
                        /> */}
                        <Button
                            variant='accent'
                            children='Копировать'
                            icon={<Copy />}
                            onClick={handleCopyAndRedirect}
                            className={styles.action}
                        />
                    </div>
                </div>
            </PlatformModal>
        </>
    );
}