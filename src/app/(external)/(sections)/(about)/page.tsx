import clsx from 'clsx';
import styles from './page.module.scss';
import { DynamicsBlock } from './slides/dynamics/block';
import { HeadBlock } from './slides/head/block';
import { PartnersBlock } from './slides/partners/block';
import { StartBlock } from './slides/start/block';
import { ThesisBlock } from './slides/thesis/block';
import { authLinks } from '@/config/links.config';

export default function Page() {
    return (
        <>
        <div className={styles.container}>
            <div className={styles.grid}>
                <StartBlock className={styles.block} />
                <PartnersBlock className={styles.block} />
                <div className={styles.theses}>
                    <ThesisBlock className={styles.block} />
                    <ThesisBlock className={styles.block} />
                    <ThesisBlock className={styles.block} />
                    <ThesisBlock className={styles.block} />
                    <ThesisBlock className={styles.block} />
                    <ThesisBlock className={styles.block} />
                </div>
                
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
            </div>
        </div>
        </>
    )
}