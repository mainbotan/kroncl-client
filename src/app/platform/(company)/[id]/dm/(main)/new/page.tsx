'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection } from '@/app/platform/components/lib/form';
import { ChooseTypeBlock } from '../../components/choose-type-block/block';
import Button from '@/assets/ui-kit/button/button';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDm } from '@/apps/company/modules';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.DM_DEALS_CREATE)

    const dmModule = useDm();
    const router = useRouter();
    const { showMessage } = useMessage();

    const [isLoading, setIsLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await dmModule.createDeal({
                comment: comment.trim() || null,
                type_id: selectedTypeId
            });

            if (response.status) {
                showMessage({
                    label: 'Сделка успешно создана',
                    variant: 'success'
                });
                // Редирект на страницу созданной сделки
                router.push(`/platform/${companyId}/dm/${response.data.id}`);
            } else {
                throw new Error(response.message || 'Ошибка создания сделки');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось создать сделку',
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    )

    if (!ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.DM_DEALS_CREATE} />
    )

    return (
        <>
            <PlatformHead
                title='Новая сделка'
                description='Инициализация новой сделки/заказа.'
            />
            <PlatformFormBody>
                <PlatformFormSection title='Комментарий (опционально)'>
                    <PlatformFormInput
                        placeholder='Новая сделка'
                        value={comment}
                        onChange={setComment}
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                <PlatformFormSection title='Тип сделки (опционально)'>
                    <ChooseTypeBlock
                        selectedTypeId={selectedTypeId}
                        onSelect={setSelectedTypeId}
                    />
                </PlatformFormSection>

                <section>
                    <Button
                        variant='accent'
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Создание...' : 'Создать сделку'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}