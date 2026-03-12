'use client';

import PlatformContent from '@/app/platform/components/content/content';
import styles from './page.module.scss';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { useParams } from 'next/navigation';
import { sectionsList } from '../_sections';
import Plus from '@/assets/ui-kit/icons/plus';
import { DealCard } from '../components/deal-card/card';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;

    return (
        <>
        <PlatformHead
            title='Сделки'
            description='Управление текущими сделками.'
            sections={sectionsList(companyId)}
            actions={[
                {
                    children: 'Новая сделка',
                    icon: <Plus />,
                    variant: 'accent',
                    as: 'link',
                    href: `/platform/${companyId}/dm/new`
                }
            ]}
        />
        <div className={styles.canvas}>
            <div className={styles.grid}>
                <div className={styles.col}>
                    <div className={styles.head}>
                        <span className={styles.title}>
                            Ожидают <span className={styles.secondary}>29</span>
                        </span>
                    </div>
                    <DealCard className={styles.item} />
                    <DealCard className={styles.item} />
                    <DealCard className={styles.item} />
                    <DealCard className={styles.item} />
                </div>
                <div className={styles.col}>
                    <div className={styles.head}>
                        <span className={styles.title}>
                            Приёмка <span className={styles.secondary}>7</span>
                        </span>
                    </div>
                    <DealCard className={styles.item} />
                    <DealCard className={styles.item} />
                </div>
                <div className={styles.col}>
                    <div className={styles.head}>
                        <span className={styles.title}>
                            В работе <span className={styles.secondary}>6</span>
                        </span>
                    </div>
                    <DealCard className={styles.item} />
                </div>
                <div className={styles.col}>
                    <div className={styles.head}>
                        <span className={styles.title}>
                            Завершены <span className={styles.secondary}>29</span>
                        </span>
                    </div>
                    <DealCard className={styles.item} />
                    <DealCard className={styles.item} />
                </div>
                <div className={styles.col}>
                    <div className={styles.head}>
                        <span className={styles.title}>
                            Отклонены <span className={styles.secondary}>29</span>
                        </span>
                    </div>
                    <DealCard className={styles.item} />
                    <DealCard className={styles.item} />
                </div>
            </div>
        </div>
        </>
    )
}