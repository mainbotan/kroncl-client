import clsx from 'clsx';
import { Pin } from '../../(about)/pins/2026/pin';
import styles from './page.module.scss';
import { VisitBlock } from './slides/visit-block/block';
import { WayBlock } from './slides/way-block/block';
import { ReadyToStartBlock } from '../../(customers)/businessmans/blocks/ready-to-start/block';
import { companiesApi } from '@/apps/account/companies/api';
import { Company } from '@/apps/company/init/types';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { Metadata } from 'next';

async function getCompanyData(slug: string): Promise<Company | null> {
    try {
        const response = await companiesApi.getVisitCard(slug);
        if (response.status && response.data) {
            return response.data;
        }
        return null;
    } catch {
        return null;
    }
}


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const company = await getCompanyData(params.slug);

    if (!company) {
        return {
            title: 'Kroncl | Страница не найдена',
            description: 'Страница не найдена.',
        };
    }

    const title = `${company.name} | Kroncl`;
    const description = `Публичная страница компании ${company.name} на платформе Kroncl.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://kroncl.com/${params.slug}`,
            siteName: 'Kroncl',
        },
        twitter: {
            card: 'summary',
            title,
            description,
        }
    };
}

export default async function Page({ params }: { params: { slug: string } }) {
    const company = await getCompanyData(params.slug);

    if (!company) return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={clsx(styles.notFound, styles.block)}>
                    <div className={styles.code}>404</div>
                    <div className={styles.title}>Страница не найдена</div>
                    <div className={styles.description}>Страницы не существует на указанном адресе. Публичная компания с указанным идентификаторам могла быть удалена или перемещена.</div>
                </div>
            </div>
        </div>
    )

    return (
        <>
            <Pin />
            <div className={styles.container}>
                <div className={styles.grid}>
                    <VisitBlock 
                        className={clsx(styles.block, styles.visitBlock)} 
                        company={company}
                    />
                    <WayBlock className={styles.block} />
                    <ReadyToStartBlock className={styles.block} />
                </div>
            </div>
        </>
    );
}