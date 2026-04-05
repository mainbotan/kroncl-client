import Keyhole from '@/assets/ui-kit/icons/keyhole';
import styles from './block.module.scss';
import Button from '@/assets/ui-kit/button/button';
import { DOCS_LINK_COMPANIES_LOGS } from '@/app/docs/(v1)/internal.config';

export function SecurityBlock() {
    return (
        <div className={styles.block}>
            <div className={styles.icon}><Keyhole /></div>
            <div className={styles.info}>
                <div className={styles.capture}>
                    Безопасность организации
                </div>
                <div className={styles.description}>
                    Действие каждого сотрудника организации попадает в логи рабочего пространства. 
                    Все операции прозрачны и безопасны. Кроме того Kroncl предлагает обширный набор разрешений для ограничения 
                    доступности действий.
                </div>
            </div>
            <div className={styles.actions}>
                <Button 
                    children='Подробнее'
                    variant='accent'
                    as='link'
                    href={DOCS_LINK_COMPANIES_LOGS}
                    className={styles.action} />
            </div>
        </div>
    )
}