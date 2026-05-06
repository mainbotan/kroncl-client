import clsx from 'clsx';
import styles from './page.module.scss';
import { HeadBlock } from './slides/head/block';
import { PartnersBlock } from './slides/partners/block';
import { StartBlock } from './slides/start/block';
import { authLinks } from '@/config/links.config';
import { EcosystemBlock } from './slides/ecosystem/block';
import { partnersList } from './slides/partners/_partners';
import { SwitchableBlock } from './slides/switchable/block';
import { StatisticsBlock } from './slides/statistics/block';
import { MultitenantBlock } from './slides/multitenant/block';
import { TariffsBlock } from '../(customers)/pricing/slides/tariffs/block';
import { QuickLinksBlock } from '../../components/quick-links/quick-links';
import { linksList } from './_links';
import { ReadyToStartBlock } from '../(customers)/businessmans/blocks/ready-to-start/block';
import { OverviewBlock } from './slides/overview/block';
import { DOCS_LINK_COMPANIES, DOCS_LINK_FM } from '@/app/docs/(v1)/internal.config';
import { Pin } from './pins/2026/pin';
import { TrialPeriodBlock } from '../(customers)/pricing/slides/trial/block';
import { MiniBlock } from './slides/mini/block';
import Kanban from '@/assets/ui-kit/icons/kanban';
import Wallet from '@/assets/ui-kit/icons/wallet';
import History from '@/assets/ui-kit/icons/history';
import Clients from '@/assets/ui-kit/icons/clients';
import { ChartsBlock } from './slides/charts/block';
import { SecurityBlock } from './slides/switchable/sections/security/block';
import { DemoBlock } from '../(customers)/(product)/components/demo/block';
import Code from '@/assets/ui-kit/icons/code';
import { ReviewsBlock } from './slides/reviews/block';

export default function Page() {
    return (
        <>
        <Pin className={styles.pin} />
        <div className={styles.container}>
            <div className={styles.grid}>
                <StartBlock className={styles.block} />
                
                <PartnersBlock className={styles.block} />
                
                <div className={clsx(styles.overviewCanvas)}>
                    <HeadBlock className={clsx(styles.block, styles.head)} 
                        title='Место для вашей компании'
                        description='Рабочее пространство для всех сотрудников. В браузере. Вне зависимости от размера компании.'
                        variant='default'
                        location='center'
                        actions={[
                            {as: 'link', children: 'Создать сейчас', href: authLinks.registration, variant: 'contrast'}
                        ]}
                    />
                    <OverviewBlock className={styles.block} />
                </div>
                <SwitchableBlock />
                <ReviewsBlock className={styles.block} />

                <div className={styles.intervalFlex}>
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
            
                <div className={styles.multitenantCanvas}>
                    <HeadBlock className={clsx(styles.block, styles.head)} 
                        title='Один аккаунт - несколько организаций'
                        description='Перемещайтесь между учётными системами организаций за миллисекунды.'
                        variant='default'
                        location='center'
                        actions={[
                            {as: 'link', children: 'Подробнее', href: DOCS_LINK_COMPANIES, variant: 'contrast'}
                        ]}
                    />
                    <MultitenantBlock className={styles.block} />    
                </div>
                
                <div className={styles.miniBlocksGrid}>
                    <MiniBlock 
                        title='Сделки'
                        description='Разделяйте заказы между сотрудниками, настраивайте типы работы и статусы, расчитывайте доход от сделок.'
                        img='/images/mock-ups/company-dm-cut.png'
                        icon={<Kanban />}
                        className={styles.block} />
                    <MiniBlock 
                        title='Финансы'
                        description='Контролируйте движение средств, назначайте ответственных сотрудников и следите за долговыми обязательствами.'
                        img='/images/mock-ups/company-fm-cut.png'
                        icon={<Wallet />}
                        className={styles.block} />
                    <MiniBlock 
                        title='История действий'
                        description='Отслеживайте историю изменений данных компании, с точностью до браузера инициатора.'
                        img='/images/mock-ups/company-activity-cut.png'
                        icon={<History />}
                        className={styles.block} />
                    <MiniBlock 
                        title='Клиентская база'
                        description='Анализируйте трафик клиентов, выявляйте наиболее эффективные источники привлечения.'
                        img='/images/mock-ups/company-crm-analysis-cut.png'
                        icon={<Clients />}
                        className={styles.block} />
                </div>
                
                <div className={styles.chartsGrid}>
                    <HeadBlock className={clsx(styles.block, styles.head)} 
                        title='От данных до графиков'
                        description='Лучшая аналитика для владельцев организаций.'
                        variant='default'
                        location='center'
                        actions={[
                            {as: 'link', children: 'Подробнее', href: DOCS_LINK_FM, variant: 'contrast'}
                        ]}
                    />
                    <ChartsBlock className={clsx(styles.block, styles.chartBlock)} />
                </div>

                <div className={styles.intervalFlex}>
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
                
                <DemoBlock
                    className={styles.block}
                    icon={<Code />}
                    title='Файлы & Данные модулей'
                    description='Контролируйте каждый мегабайт пространства организации,
                    просматривайте распределение по модулям и оптимизируйте занимаемое пространство.'
                    img='/images/mock-ups/company-storage-cut.png'
                />

                <div className={styles.intervalFlex}>
                    <span />
                    <span />
                    <span />
                    <span />
                </div>

                <TariffsBlock className={clsx(styles.block, styles.tariffsBlock)} />
                <TrialPeriodBlock className={styles.block} />

                <QuickLinksBlock 
                    links={linksList} 
                    className={styles.block}
                />
                <ReadyToStartBlock className={styles.block} />
            </div>
        </div>
        </>
    )
}