import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import { orgsList } from './_orgs';
import Button from '@/assets/ui-kit/button/button';

export function MultitenantBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            <div className={styles.title}>
                <span className={styles.accent}>∞ организаций.</span> 
                <br />
                Без смены аккаунта. 
                <br />
                Изолированный учёт филиалов.
            </div>
            <div className={styles.actions}>
                <Button as='link' href='/multi-tenancy' className={styles.action} variant='accent'>Больше о многозадачности</Button>
            </div>
            <div className={styles.icons}>
                {orgsList.map((org, index) => (
                    <div className={styles.icon} key={index}>
                        {org.label}
                    </div>
                ))}
            </div>
        </div>
    );
}