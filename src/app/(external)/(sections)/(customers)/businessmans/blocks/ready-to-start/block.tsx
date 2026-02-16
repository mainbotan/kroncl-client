import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import Button from '@/assets/ui-kit/button/button';
import { authLinks } from '@/config/links.config';

export function ReadyToStartBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            <div className={styles.col}>
                <div className={styles.capture}>Готовы начать?</div>
                <div className={styles.description}>
                    Для каждой новой организации - пробный период.
                </div>
            </div>
            <div className={styles.col}>
                <Button as='link' href={authLinks.login} variant='accent' className={styles.action}>Войти</Button>
            </div>
        </div>
    )
}