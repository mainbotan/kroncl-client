'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormVariants } from '@/app/platform/components/lib/form';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import { PlatformResult } from '@/app/platform/components/lib/result/result';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import Button from '@/assets/ui-kit/button/button';
import { useParams, useRouter } from 'next/navigation';
import { useAdminLevel } from '@/apps/admin/auth/hook';
import { ADMIN_LEVEL_4 } from '@/apps/admin/auth/types';
import { adminPricingPromocodesApi } from '@/apps/admin/pricing/promocodes/api';
import { pricingApi } from '@/apps/pricing/api';
import { PricingPlan } from '@/apps/pricing/types';
import { useEffect, useState, useCallback } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import Exit from '@/assets/ui-kit/icons/exit';
import { Promocode } from '@/apps/admin/pricing/promocodes/types';

export default function EditPromocodePage() {
    const params = useParams();
    const router = useRouter();
    const promocodeId = params.promocodeId as string;
    const { showMessage } = useMessage();
    const { allowed: isAdmin, isLoading: adminLoading } = useAdminLevel(ADMIN_LEVEL_4);
    
    const [promocode, setPromocode] = useState<Promocode | null>(null);
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleted, setDeleted] = useState(false);
    
    const [formData, setFormData] = useState({
        code: '',
        plan_id: '',
        trial_period_days: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [promocodeRes, plansRes] = await Promise.all([
                    adminPricingPromocodesApi.getPromocodeById(promocodeId),
                    pricingApi.getPlans()
                ]);
                
                if (promocodeRes.status && promocodeRes.data) {
                    setPromocode(promocodeRes.data);
                    setFormData({
                        code: promocodeRes.data.code,
                        plan_id: promocodeRes.data.plan_id,
                        trial_period_days: promocodeRes.data.trial_period_days
                    });
                } else {
                    showMessage({ label: 'Промокод не найден', variant: 'error' });
                    router.push('/tech/promocodes');
                }
                
                if (plansRes.status && plansRes.data) {
                    setPlans(plansRes.data.plans);
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
                showMessage({ label: 'Ошибка загрузки данных', variant: 'error' });
            } finally {
                setLoading(false);
                setLoadingPlans(false);
            }
        };

        fetchData();
    }, [promocodeId, router, showMessage]);

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

    const handleUpdate = async () => {
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

        setUpdating(true);

        try {
            const response = await adminPricingPromocodesApi.updatePromocode(promocodeId, {
                code: formData.code,
                plan_id: formData.plan_id,
                trial_period_days: formData.trial_period_days
            });

            if (response.status) {
                showMessage({ label: 'Промокод успешно обновлён', variant: 'success' });
                router.push('/tech/promocodes');
            } else {
                showMessage({ label: response.message || 'Ошибка при обновлении', variant: 'error' });
            }
        } catch (err: any) {
            showMessage({ label: err.message || 'Ошибка при обновлении', variant: 'error' });
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const response = await adminPricingPromocodesApi.deletePromocode(promocodeId);
            if (response.status) {
                showMessage({ label: 'Промокод успешно удалён', variant: 'success' });
                setDeleted(true);
                setTimeout(() => {
                    router.push('/tech/promocodes');
                }, 1500);
            } else {
                showMessage({ label: response.message || 'Ошибка при удалении', variant: 'error' });
                setIsDeleteModalOpen(false);
            }
        } catch (err: any) {
            showMessage({ label: err.message || 'Ошибка при удалении', variant: 'error' });
            setIsDeleteModalOpen(false);
        } finally {
            setDeleting(false);
        }
    };

    if (adminLoading || loading || loadingPlans) {
        return <PlatformLoading />;
    }

    if (!isAdmin) {
        return <PlatformResult status="error" title="Доступ запрещён" description="У вас нет прав для просмотра этой страницы." />;
    }

    if (deleted) {
        return (
            <PlatformResult
                status="success"
                title="Промокод удалён"
                description={`Промокод "${formData.code}" успешно удалён.`}
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

    const hasChanges = promocode && (
        formData.code !== promocode.code ||
        formData.plan_id !== promocode.plan_id ||
        formData.trial_period_days !== promocode.trial_period_days
    );

    return (
        <>
            <PlatformHead
                title={`Редактирование промокода`}
                description={promocode?.code || ''}
                actions={[
                    {
                        children: 'Удалить',
                        icon: <Exit />,
                        variant: 'light',
                        onClick: () => setIsDeleteModalOpen(true)
                    }
                ]}
            />
            <PlatformFormBody>
                <PlatformFormSection
                    title="Код промокода"
                    description="Уникальный код, который будут вводить пользователи."
                >
                    <PlatformFormInput
                        value={formData.code}
                        onChange={handleCodeChange}
                        placeholder="ПРИМЕР-КОД"
                        maxLength={50}
                        disabled={updating}
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
                        disabled={updating}
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
                        disabled={updating}
                    />
                </PlatformFormSection>

                <section>
                    <Button
                        variant="accent"
                        onClick={handleUpdate}
                        loading={updating}
                        disabled={updating || !hasChanges || !formData.code.trim() || !formData.plan_id}
                    >
                        Сохранить изменения
                    </Button>
                </section>
            </PlatformFormBody>

            <PlatformModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <PlatformModalConfirmation
                    title="Удалить промокод?"
                    description={`Промокод "${promocode?.code}" будет безвозвратно удалён.`}
                    actions={[
                        { children: 'Отмена', variant: 'light', onClick: () => setIsDeleteModalOpen(false) },
                        { variant: 'red', onClick: handleDelete, children: deleting ? 'Удаление...' : 'Удалить', disabled: deleting }
                    ]}
                />
            </PlatformModal>
        </>
    );
}