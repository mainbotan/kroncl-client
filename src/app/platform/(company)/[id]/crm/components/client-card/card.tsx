'use client';

import clsx from 'clsx';
import styles from './card.module.scss';
import Button from '@/assets/ui-kit/button/button';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import { useModalPage } from '@/app/platform/components/lib/modal-page/context';

export function ClientCard() {
    const { openModal } = useModalPage();

    const handleOpenClient = () => {
        openModal(
            <>
            
            </>
        );
    };

    return (
        <>
        <div className={styles.client}>
            <div className={styles.icon}>
                МА
            </div>
            <div className={styles.info}>
                <div className={styles.name}>
                    <span>Мария Александровна</span>
                    <span className={styles.contact}>+7 982 923 29 23</span>
                </div>
                <div className={styles.tags}>
                    <ModalTooltip content='Клиент - физическое лицо.'>
                        <span className={clsx(styles.tag, styles.accent)}>Физическое лицо</span>
                    </ModalTooltip>
                    <ModalTooltip content='Дата создания клиента'>
                        <span className={styles.tag}>9 февраля, 2026</span>
                    </ModalTooltip>
                </div>
            </div>
            <div className={styles.actions}>
                <Button onClick={handleOpenClient} className={styles.action} variant='light'>
                    Открыть
                </Button>
            </div>
        </div>
        </>
    );
}