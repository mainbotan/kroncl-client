'use client';

import Input from '@/assets/ui-kit/input/input';
import { HeadBlock } from '../../(about)/slides/head/block';
import styles from './page.module.scss';
import clsx from 'clsx';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormTextarea, PlatformFormVariants } from '@/app/platform/components/lib/form';
import Earth from '@/assets/ui-kit/icons/earth';
import Guard from '@/assets/ui-kit/icons/guard';
import Button from '@/assets/ui-kit/button/button';
import { ReadyToStartBlock } from '../businessmans/blocks/ready-to-start/block';
import { useState } from 'react';
import { partnersApi } from '@/apps/partners/api';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import { motion, AnimatePresence } from 'framer-motion';
import { successBlockVariants } from './_animations';

export default function Page() {
    const { showMessage } = useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'public' as 'public' | 'private',
        email: '',
        text: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            showMessage({ label: 'Введите название организации', variant: 'error' });
            return;
        }
        if (!formData.email.trim()) {
            showMessage({ label: 'Введите почту для связи', variant: 'error' });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            showMessage({ label: 'Некорректный формат email', variant: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            const response = await partnersApi.becomePartner({
                name: formData.name.trim(),
                type: formData.type,
                email: formData.email.trim(),
                text: formData.text.trim() || undefined
            });

            if (response.status) {
                setIsSuccess(true);
                setFormData({ name: '', type: 'public', email: '', text: '' });
            } else {
                showMessage({ label: response.message || 'Не удалось отправить заявку', variant: 'error' });
            }
        } catch {
            showMessage({ label: 'Произошла ошибка. Попробуйте позже', variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.grid} onSubmit={handleSubmit}>
                <HeadBlock className={clsx(styles.block, styles.head)} 
                    title='Станьте партнёром'
                    description='Станьте партнёром, внесите вклад в развитие Kroncl и получите бессрочный доступ ко всем возможностям для своей организации.'
                    variant='default'
                    location='center'
                />
                <div className={styles.intervalFlex}>
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
                <div className={clsx(styles.block, styles.form)}>
                    <div className={styles.focus}>
                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div 
                                    key="success"
                                    className={styles.success}
                                    variants={successBlockVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <SuccessStatus />
                                    <div className={styles.info}>
                                        <div className={styles.capture}>Заявка отправлена</div>
                                        <div className={styles.description}>
                                            Совсем скоро мы свяжемся с вами для обсуждения деталей 
                                            сотрудничества.
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <>
                                    <PlatformFormBody>
                                        <PlatformFormSection title='Название организации'>
                                            <PlatformFormInput 
                                                placeholder='ООО «Компания»'
                                                value={formData.name}
                                                onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                                                disabled={isLoading}
                                            />
                                        </PlatformFormSection>
                                        <PlatformFormSection title='Тип организации'>
                                            <PlatformFormVariants
                                                value={formData.type}
                                                onChange={(value) => setFormData(prev => ({ ...prev, type: value as 'public' | 'private' }))}
                                                disabled={isLoading}
                                                options={[
                                                    { 
                                                        icon: <Earth />,
                                                        value: 'public', 
                                                        label: 'Публичная компания', 
                                                        description: 'Широко известный бренд, открытая информация о деятельности, готов к публичным интеграциям.' 
                                                    },
                                                    { 
                                                        icon: <Guard />,
                                                        value: 'private', 
                                                        label: 'Частная компания', 
                                                        description: 'Непубличный бизнес, требуются индивидуальные условия партнёрства.' 
                                                    }
                                                ]} />
                                        </PlatformFormSection>
                                        <PlatformFormSection title='Почта для связи'>
                                            <PlatformFormInput 
                                                placeholder='partner@company.com'
                                                type='email'
                                                value={formData.email}
                                                onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                                                disabled={isLoading}
                                            />
                                        </PlatformFormSection>
                                        <PlatformFormSection title='Текст заявки' description='Немного о потребностях организации'>
                                            <PlatformFormTextarea 
                                                value={formData.text}
                                                onChange={(value) => setFormData(prev => ({ ...prev, text: value }))}
                                                disabled={isLoading}
                                            />
                                        </PlatformFormSection>
                                    </PlatformFormBody>
                                    <div className={styles.warning}>
                                        Соблюдайте <span className={styles.accent}>официально-деловой</span> стиль обращения. Мы привыкли к оскорблениям, но от постоянных клиентов.
                                    </div>
                                    <div className={styles.actions}>
                                        <Button 
                                            className={styles.action} 
                                            variant='accent'
                                            type='submit'
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Отправка...' : 'Отправить заявку'}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className={styles.intervalFlex}>
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
                <ReadyToStartBlock className={styles.block} />
            </form>
        </div>
    )
}