import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import { orgsList } from './_orgs';

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
            <div className={styles.icons}>
                {orgsList.map((org, index) => (
                    <div className={styles.icon}>
                        {org.label}
                    </div>
                ))}
            </div>
        </div>
    );
}