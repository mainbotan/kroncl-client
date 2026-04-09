'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection } from '@/app/platform/components/lib/form';
import styles from './page.module.scss';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { MasterPositionsBlock } from '../components/master-positions/block';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BatchWithPositions, StockBatchPosition } from '@/apps/company/modules/wm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { useWm } from '@/apps/company/modules';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { formatDate } from '@/assets/utils/date';
import { usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const companyId = params.id as string;
    const batchId = params.batchId as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.WM_STOCKS_BATCHES)

    const wmModule = useWm();
    const { showMessage } = useMessage();
    
    const [batch, setBatch] = useState<BatchWithPositions | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        loadBatch();
    }, [batchId]);

    const loadBatch = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await wmModule.getStockBatch(batchId);
            
            if (response.status) {
                setBatch(response.data);
                setComment(response.data.comment || '');
            } else {
                setError("Не удалось загрузить документ");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading batch:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    )

    if (error || !batch) return (
        <PlatformError error={error || "Документ не найден"} />
    )

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.WM_STOCKS_BATCHES} />
    )

    const direction = batch.direction;
    const title = direction === 'income' ? 'Просмотр поставки' : 'Просмотр отгрузки';
    const description = `Документ от ${formatDate(batch.created_at)}`;

    // Преобразуем позиции в формат для MasterPositionsBlock
    const positions: StockBatchPosition[] = batch.positions.map(p => ({
        unit_id: p.unit_id,
        quantity: p.quantity,
        price: direction === 'income' ? p.unit.purchase_price || 0 : p.unit.sale_price
    }));

    return (
        <>
            <PlatformHead
                title={title}
                description={description}
            />
            <PlatformFormBody>
                <PlatformFormSection title='Состав'>
                    <MasterPositionsBlock 
                        className={styles.masterPositions} 
                        direction={direction}
                        initialPositions={positions}
                        initialUnits={batch.positions.map(p => p.unit)}
                        readOnly={true}
                    />
                </PlatformFormSection>
                <PlatformFormSection title='Комментарий' description={comment || 'Без комментария.'} />
            </PlatformFormBody>
        </>
    );
}