'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormVariants } from '@/app/platform/components/lib/form';
import { PlatformResult } from '@/app/platform/components/lib/result/result';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import Button from '@/assets/ui-kit/button/button';
import { useAdminLevel } from '@/apps/admin/auth/hook';
import { ADMIN_LEVEL_4 } from '@/apps/admin/auth/types';
import { adminPricingPromocodesApi } from '@/apps/admin/pricing/promocodes/api';
import { pricingApi } from '@/apps/pricing/api';
import { PricingPlan } from '@/apps/pricing/types';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMessage } from '@/app/platform/components/lib/message/provider';

export default function NewPromocodePage() {
    const router = useRouter();
    const { showMessage } = useMessage();
    const { allowed: isAdmin, isLoading: adminLoading } = useAdminLevel(ADMIN_LEVEL_4);
    
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [creating, setCreating] = useState(false);
    const [created, setCreated] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        code: '',
        plan_id: '',
        trial_period_days: 7
    });

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await pricingApi.getPlans();
                if (response.status && response.data) {
                    setPlans(response.data.plans);
                    if (response.data.plans.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            plan_id: response.data.plans[0].code
                        }));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch plans:', err);
            } finally {
                setLoadingPlans(false);
            }
        };

        fetchPlans();
    }, []);

    const handleCodeChange = useCallback((value: string) => {
        setFormData(prev => ({ ...prev, code: value.toUpperCase().replace(/\s/g, '') }));
    }, []);

    const handlePlanSelect = useCallback((value: string) => {
        setFormData(prev => ({ ...prev, plan_id: value }));
    }, []);

    const handleDaysChange = useCallback((value: string) => {
        const days = parseInt(value);
        if (!isNaN(days) && days >= 0) {
            setFormData(prev => ({ ...prev, trial_period_days: days }));
        }
    }, []);

    const handleSubmit = async () => {
        if (!formData.code.trim()) {
            showMessage({ label: 'Введите код промокода', variant: 'error' });
            return;
        }
        if (!formData.plan_id) {
            showMessage({ label: 'Выберите тарифный план', variant: 'error' });
            return;
        }
        if (formData.trial_period_days < 0) {
            showMessage({ label: 'Количество дней не может быть отрицательным', variant: 'error' });
            return;
        }

        setCreating(true);
        setError(null);

        try {
            const response = await adminPricingPromocodesApi.createPromocode({
                code: formData.code,
                plan_id: formData.plan_id,
                trial_period_days: formData.trial_period_days
            });

            if (response.status) {
                setCreated(true);
                showMessage({ label: 'Промокод успешно создан', variant: 'success' });
                setTimeout(() => {
                    router.push('/tech/promocodes');
                }, 1500);
            } else {
                setError(response.message || 'Ошибка при создании промокода');
                showMessage({ label: response.message || 'Ошибка при создании промокода', variant: 'error' });
            }
        } catch (err: any) {
            setError(err.message || 'Ошибка при создании промокода');
            showMessage({ label: err.message || 'Ошибка при создании промокода', variant: 'error' });
        } finally {
            setCreating(false);
        }
    };

    if (adminLoading || loadingPlans) {
        return <PlatformLoading />;
    }

    if (!isAdmin) {
        return <PlatformResult status="error" title="Доступ запрещён" description="У вас нет прав для просмотра этой страницы." />;
    }

    if (created) {
        return (
            <PlatformResult
                status="success"
                title="Промокод создан"
                description={`Промокод "${formData.code}" успешно создан.`}
                redirect={{
                    href: '/tech/promocodes',
                    delay: 3,
                    label: 'Переход к списку промокодов...'
                }}
            />
        );
    }

    const planOptions = plans.map(plan => ({
        value: plan.code,
        label: plan.name,
        description: `${plan.price_per_month} ₽ / месяц`
    }));

    return (
        <>
            <PlatformHead
                title="Создание промокода"
                description="Добавление нового промокода для расширения тестового периода."
            />
            <PlatformFormBody>
                <PlatformFormSection
                    title="Код промокода"
                    description="Уникальный код, который будут вводить пользователи при создании компании."
                >
                    <PlatformFormInput
                        value={formData.code}
                        onChange={handleCodeChange}
                        placeholder="ПРИМЕР-КОД"
                        maxLength={50}
                        disabled={creating}
                    />
                </PlatformFormSection>

                <PlatformFormSection
                    title="Тарифный план"
                    description="План, который будет активирован при использовании промокода."
                >
                    <PlatformFormVariants
                        options={planOptions}
                        value={formData.plan_id}
                        onChange={handlePlanSelect}
                        disabled={creating}
                    />
                </PlatformFormSection>

                <PlatformFormSection
                    title="Дней триального периода"
                    description="Дней в тестовом периоде при использовании промокода."
                >
                    <PlatformFormInput
                        type="number"
                        value={formData.trial_period_days}
                        onChange={handleDaysChange}
                        min={0}
                        max={365}
                        disabled={creating}
                    />
                </PlatformFormSection>

                <section>
                    <Button
                        variant="accent"
                        onClick={handleSubmit}
                        loading={creating}
                        disabled={creating || !formData.code.trim() || !formData.plan_id}
                    >
                        Создать промокод
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}