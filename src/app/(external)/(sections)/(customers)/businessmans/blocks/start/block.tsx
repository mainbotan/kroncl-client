import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import Button from '@/assets/ui-kit/button/button';
import { authLinks } from '@/config/links.config';

export function StartBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            <div className={styles.title}>
                Место, где дело <span className={styles.accent}>процветает.</span>
            </div>
            <div className={styles.description}>
                Вопреки ФНС и тяжёлым реалиям жизни.
            </div>
            <div className={styles.actions}>
                <Button as='link' href={authLinks.registration} className={styles.action} variant='accent'>Начать вести учёт</Button>
            </div>
        </div>
    )
}