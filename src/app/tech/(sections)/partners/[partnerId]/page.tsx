'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { shortenId } from '@/assets/utils/ids';
import { FieldsBlock } from '@/app/tech/components/fields-block/block';
import { adminPartnersApi } from '@/apps/admin/partners/api';
import { IncomingPartner } from '@/apps/admin/partners/types';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const partnerId = params.partnerId as string;
    const { showMessage } = useMessage();
    
    const [partner, setPartner] = useState<IncomingPartner | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        loadPartner();
    }, [partnerId]);

    const loadPartner = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminPartnersApi.getPartnerById(partnerId);
            if (response.status && response.data) {
                setPartner(response.data);
            } else {
                setError('Не удалось загрузить заявку');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        setIsUpdating(true);
        try {
            const response = await adminPartnersApi.updatePartner(partnerId, { status: 'success' });
            if (response.status) {
                showMessage({ label: 'Заявка принята', variant: 'success' });
                setIsAcceptModalOpen(false);
                router.push('/tech/partners');
            } else {
                showMessage({ label: response.message || 'Ошибка при принятии', variant: 'error' });
            }
        } catch (err: any) {
            showMessage({ label: err.message || 'Ошибка при принятии', variant: 'error' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleReject = async () => {
        setIsUpdating(true);
        try {
            const response = await adminPartnersApi.updatePartner(partnerId, { status: 'banned' });
            if (response.status) {
                showMessage({ label: 'Заявка отклонена', variant: 'success' });
                setIsRejectModalOpen(false);
                router.push('/tech/partners');
            } else {
                showMessage({ label: response.message || 'Ошибка при отклонении', variant: 'error' });
            }
        } catch (err: any) {
            showMessage({ label: err.message || 'Ошибка при отклонении', variant: 'error' });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <PlatformLoading />;
    if (error) return <PlatformError error={error} />;
    if (!partner) return <PlatformError error="Заявка не найдена" />;

    const isWaiting = partner.status === 'waiting';

    const fields = [
        { label: 'ID', value: partner.id },
        { label: 'Название организации', value: partner.name },
        { label: 'Тип партнёрства', value: partner.type === 'public' ? 'Публичное' : 'Частное' },
        { label: 'Email представителя', value: partner.email },
        { label: 'Текст заявки', value: partner.text || '—' },
        { label: 'Статус', value: partner.status === 'waiting' ? 'Ожидает' : partner.status === 'success' ? 'Принята' : 'Отклонена' },
        { label: 'Создана', value: new Date(partner.created_at).toLocaleString() },
        { label: 'Обновлена', value: new Date(partner.updated_at).toLocaleString() },
    ];

    const actions = [];
    if (isWaiting) {
        actions.push({
            variant: 'accent' as const,
            children: 'Принять',
            onClick: () => setIsAcceptModalOpen(true)
        });
        actions.push({
            variant: 'light' as const,
            children: 'Отклонить',
            onClick: () => setIsRejectModalOpen(true)
        });
    }

    return (
        <>
            <PlatformHead
                title={`Партнёрство #${shortenId(partnerId)}`}
                description='Входящая заявка на партнёрство'
                actions={actions}
            />
            <FieldsBlock fields={fields} />

            <PlatformModal isOpen={isAcceptModalOpen} onClose={() => setIsAcceptModalOpen(false)}>
                <PlatformModalConfirmation
                    title='Принять заявку на партнёрство'
                    description={`Вы уверены, что хотите принять заявку от ${partner.name}? После принятия партнёр будет активирован.`}
                    actions={[
                        { children: 'Отмена', variant: 'light', onClick: () => setIsAcceptModalOpen(false) },
                        { variant: 'accent', onClick: handleAccept, children: isUpdating ? 'Принятие...' : 'Принять', disabled: isUpdating }
                    ]}
                />
            </PlatformModal>

            <PlatformModal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)}>
                <PlatformModalConfirmation
                    title='Отклонить заявку на партнёрство'
                    description={`Вы уверены, что хотите отклонить заявку от ${partner.name}? Отклонённый партнёр не сможет сотрудничать с платформой.`}
                    actions={[
                        { children: 'Отмена', variant: 'light', onClick: () => setIsRejectModalOpen(false) },
                        { variant: 'red', onClick: handleReject, children: isUpdating ? 'Отклонение...' : 'Отклонить', disabled: isUpdating }
                    ]}
                />
            </PlatformModal>
        </>
    );
}