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

export default function Page() {
    return (
        <>
        <div className={styles.container}>
            <div className={styles.grid}>
                <StartBlock className={styles.block} />

                <PartnersBlock partners={partnersList} className={styles.block} />
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
                <EcosystemBlock className={styles.block} />
            </div>
        </div>
        </>
    )
}