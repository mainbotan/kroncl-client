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
import { partnersList } from './content/_partners';
import { SwitchableBlock } from './slides/switchable/block';
import { StatisticsBlock } from './slides/statistics/block';
import { MultitenantBlock } from './slides/multitenant/block';
import { TariffsBlock } from '../(customers)/pricing/slides/tariffs/block';
import { QuickLinksBlock } from '../../components/quick-links/quick-links';
import { linksList } from './_links';
import { ReadyToStartBlock } from '../(customers)/businessmans/blocks/ready-to-start/block';
import { OverviewBlock } from './slides/overview/block';

export default function Page() {
    return (
        <>
        <div className={styles.container}>
            <div className={styles.grid}>
                <StartBlock className={styles.block} />
                {/* <PartnersBlock partners={partnersList} className={styles.block} /> */}
                <div className={clsx(styles.overviewCanvas)}>
                    <HeadBlock className={clsx(styles.block, styles.head)} 
                        title='Место для вашей компании'
                        description='Рабочее пространство для всех сотрудников. В браузере. Вне зависимости от размера компании.'
                        variant='default'
                        location='center'
                        actions={[
                            {children: 'Создать сейчас', href: authLinks.registration, variant: 'contrast'}
                        ]}
                    />
                    <OverviewBlock className={styles.block} />
                </div>
                <SwitchableBlock />

                <div className={styles.interval} />
                <HeadBlock className={clsx(styles.block, styles.head)} 
                    title='Эффективность в ваших руках'
                    description='Позвольте себе отдохнуть от тонн бухглалтерской отчётности.'
                    variant='accent'
                    location='left'
                    actions={[
                        {children: 'Начать сейчас', href: authLinks.registration, variant: 'contrast'}
                    ]}
                />
                <DynamicsBlock className={styles.block} />
                <div className={styles.dynamicsGrid}>
                    <TimeSavingBlock className={styles.block} />
                    <SimpleUiBlock className={styles.block} />
                </div>
            
                <div className={styles.interval} />
                <HeadBlock className={clsx(styles.block, styles.head)} 
                    title='Работайте в нескольких организациях'
                    description='Мгновенно переключаясь между учётными системами.'
                    variant='orange'
                    location='left'
                    actions={[
                        {children: 'Начать сейчас', href: authLinks.registration, variant: 'contrast'}
                    ]}
                />
                <MultitenantBlock className={styles.block} />
                    
                <div className={styles.interval} />
                <HeadBlock className={clsx(styles.block, styles.head)} 
                    title='Больше чем бизнес'
                    description='Для тех, кто живёт делом.'
                    variant='default'
                    location='center'
                    actions={[
                        {children: 'Начать сейчас', href: authLinks.registration, variant: 'contrast'}
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
                <TariffsBlock className={clsx(styles.block, styles.tariffsBlock)} />
                    
                <QuickLinksBlock 
                    links={linksList} 
                    className={styles.block}
                />

                <div className={styles.interval} />
                <ReadyToStartBlock className={styles.block} />
            </div>
        </div>
        </>
    )
}