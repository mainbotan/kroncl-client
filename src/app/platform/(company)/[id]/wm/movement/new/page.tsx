'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection } from '@/app/platform/components/lib/form';
import styles from './page.module.scss';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { MasterPositionsBlock } from '../components/master-positions/block';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { StockBatchPosition } from '@/apps/company/modules/wm/types';
import Button from '@/assets/ui-kit/button/button';
import { useWm } from '@/apps/company/modules';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';
import { DOCS_LINK_WM_MOVEMENT } from '@/app/docs/(v1)/internal.config';

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const companyId = params.id as string;
    const searchParams = useSearchParams();

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.WM_STOCKS_BATCHES_CREATE)
    
    const wmModule = useWm();
    const { showMessage } = useMessage();
    
    const direction = searchParams.get('direction') as 'income' | 'outcome' || 'income';
    const [positions, setPositions] = useState<StockBatchPosition[]>([]);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const title = direction === 'income' ? 'Создание поставки' : 'Создание отгрузки';
    const description = direction === 'income' 
        ? 'Создание поставки товаров на склад.' 
        : 'Создание отгрузки товаров со склада.';

    const handlePositionsChange = (newPositions: StockBatchPosition[]) => {
        setPositions(newPositions);
    };

    const handleSubmit = async () => {
        if (positions.length === 0) {
            showMessage({
                label: 'Добавьте хотя бы одну позицию',
                variant: 'error'
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await wmModule.createStockBatch({
                direction,
                comment: comment || undefined,
                positions: positions.map(p => ({
                    unit_id: p.unit_id,
                    quantity: p.quantity,
                    price: p.price
                }))
            });

            if (response.status) {
                showMessage({
                    label: direction === 'income' 
                        ? 'Поставка успешно создана' 
                        : 'Отгрузка успешно создана',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/wm/movement`);
            } else {
                throw new Error(response.message || 'Ошибка создания');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось создать документ',
                about: error.message || null,
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
        <PlatformNotAllowed permission={PERMISSIONS.WM_STOCKS_BATCHES_CREATE} />
    )

    return (
        <>
            <PlatformHead
                title={title}
                description={description}
                docsEscort={{
                    href: DOCS_LINK_WM_MOVEMENT,
                    title: 'Подробнее о поставках & отгрузках'
                }}
            />
            <PlatformFormBody>
                <PlatformFormSection title='Состав'>
                    <MasterPositionsBlock 
                        className={styles.masterPositions} 
                        direction={direction}
                        onPositionsChange={handlePositionsChange}
                    />
                </PlatformFormSection>
                <PlatformFormSection title='Комментарий'>
                    <PlatformFormInput
                        type='text'
                        value={comment}
                        onChange={setComment}
                        disabled={isLoading}
                    />
                </PlatformFormSection>
                <section>
                    <Button
                        variant="accent"
                        onClick={handleSubmit}
                        disabled={positions.length === 0 || isLoading}
                    >
                        {isLoading ? 'Создание...' : 'Создать'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}