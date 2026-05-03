'use client';

import { useState } from 'react';
import styles from './modal.module.scss';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import Button from '@/assets/ui-kit/button/button';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus } from '@/app/platform/components/lib/form';

export interface AdminKeywordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (keyword: string) => void | Promise<void>;
    title?: string;
    description?: string;
    actionName?: string;
    isLoading?: boolean;
    requiredKeyword?: string; // если нужна проверка на фронте
}

export function AdminKeywordModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Подтверждение действия',
    description = 'Для выполнения этого действия введите административное ключевое слово.',
    actionName = 'Подтвердить',
    isLoading = false,
    requiredKeyword,
}: AdminKeywordModalProps) {
    const [keyword, setKeyword] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        if (!keyword.trim()) {
            setError('Введите ключевое слово');
            return;
        }

        if (requiredKeyword && keyword !== requiredKeyword) {
            setError('Неверное ключевое слово');
            return;
        }

        setError('');
        await onConfirm(keyword);
        setKeyword('');
        onClose();
    };

    const handleClose = () => {
        if (!isLoading) {
            setKeyword('');
            setError('');
            onClose();
        }
    };

    return (
        <PlatformModal
            isOpen={isOpen}
            onClose={handleClose}
            className={styles.modal}
        >
            <div className={styles.container}>
                <div className={styles.head}>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.description}>{description}</div>
                </div>

                <div className={styles.formWrap}>
                    <PlatformFormBody className={styles.form}>
                        <PlatformFormSection 
                            title='Ключевое слово' 
                            description='Введите административное ключевое слово для подтверждения действия'
                        >
                            <PlatformFormInput
                                value={keyword}
                                onChange={setKeyword}
                                placeholder='Введите ключевое слово'
                                disabled={isLoading}
                                type='text'
                            />
                            {error && (<PlatformFormStatus type='error' message={error} />)}
                        </PlatformFormSection>
                    </PlatformFormBody>
                </div>

                <div className={styles.actions}>
                    <Button
                        children='Отмена'
                        variant='light'
                        onClick={handleClose}
                        className={styles.action}
                        disabled={isLoading}
                    />
                    <Button
                        children={isLoading ? 'Проверка...' : actionName}
                        variant='red'
                        className={styles.action}
                        onClick={handleConfirm}
                        disabled={isLoading || !keyword.trim()}
                    />
                </div>
            </div>
        </PlatformModal>
    );
}