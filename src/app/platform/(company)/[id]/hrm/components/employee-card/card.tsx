import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import styles from './card.module.scss';
import Button from '@/assets/ui-kit/button/button';
import clsx from 'clsx';

export function EmployeeCard() {
    return (
        <div className={styles.card}>
            <div className={styles.base}>
                <div className={styles.avatar}>С</div>
                <div className={styles.info}>
                    <div className={styles.name}>Серафим Недошивин</div>
                    <div className={styles.tags}>
                        <span className={clsx(styles.tag, styles.accent)}>Аккаунт привязан</span>
                    </div>
                </div>
            </div>
            <div className={styles.actions}>
                <Button href='/platform/94e3d9a9-6b48-462d-ba9d-1b13180543db/hrm/0x' as='link' className={styles.action} variant='accent'>Карта сотрудника</Button>
            </div>
            <span className={styles.flag} />
            {/* <ModalTooltip content='Персональный код сотрудника.'>
                <span className={styles.code}>21a58239-942e-4eff-91cf-b5da5f8f41a5</span>
            </ModalTooltip> */}
        </div>
    )
}