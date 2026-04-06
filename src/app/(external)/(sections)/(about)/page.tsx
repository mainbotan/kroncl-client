import clsx from 'clsx';
import styles from './page.module.scss';
import { DynamicsBlock } from './slides/dynamics/block';
import { HeadBlock } from './slides/head/block';
import { PartnersBlock } from './slides/partners/block';
import { StartBlock } from './slides/start/block';
import { authLinks } from '@/config/links.config';
import { EcosystemBlock } from './slides/ecosystem/block';
import { TimeSavingBlock } from './slides/time-saving/block';
import { SimpleUiBlock } from './slides/simple-ui/block';
import { partnersList } from './slides/partners/_partners';
import { SwitchableBlock } from './slides/switchable/block';
import { StatisticsBlock } from './slides/statistics/block';
import { MultitenantBlock } from './slides/multitenant/block';
import { TariffsBlock } from '../(customers)/pricing/slides/tariffs/block';
import { QuickLinksBlock } from '../../components/quick-links/quick-links';
import { linksList } from './_links';
import { ReadyToStartBlock } from '../(customers)/businessmans/blocks/ready-to-start/block';
import { OverviewBlock } from './slides/overview/block';
import { DOCS_LINK_COMPANIES } from '@/app/docs/(v1)/internal.config';
import { Pin } from './pins/2026/pin';

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

                <div className={styles.intervalFlex}>
                    <span />
                    <span />
                    <span />
                    <span />
                </div>

                <div className={styles.ecosystemGrid}>
                    <HeadBlock className={clsx(styles.block, styles.head)} 
                        title='Больше чем бизнес'
                        description='Для тех, кто живёт делом.'
                        variant='default'
                        location='center'
                        actions={[
                            {as: 'link', children: 'Начать сейчас', href: authLinks.registration, variant: 'contrast'}
                        ]}
                    />
                    <div className={styles.statisticsGrid}>
                        <StatisticsBlock 
                            value='до 10000'
                            legend='запросов/день к 1 организации'
                            className={styles.block} 
                            />
                        <StatisticsBlock 
                            value='7+'
                            legend='модулей учёта & аналитики'
                            className={styles.block} 
                            />
                        <StatisticsBlock 
                            value='∞'
                            legend='приглашений сотрудников'
                            className={styles.block} 
                            />
                    </div>
                    <EcosystemBlock className={styles.block} />
                </div>

                <TariffsBlock className={clsx(styles.block, styles.tariffsBlock)} />
                    
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