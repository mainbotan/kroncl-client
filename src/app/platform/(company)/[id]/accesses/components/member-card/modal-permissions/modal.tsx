import Close from '@/assets/ui-kit/icons/close';
import styles from './modal.module.scss';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import Input from '@/assets/ui-kit/input/input';
import Plus from '@/assets/ui-kit/icons/plus';

export function ModalPermissions() {
    return (
        <div className={styles.content}>
            <div className={styles.capture}>Расширение прав</div>
            <Input fullWidth variant='default' className={styles.input} />
            <div className={styles.description}>132 разрешения</div>
            <div className={styles.permissions}>
                <ModalTooltip content='crm.* - полный доступ ко всем возможностям CRM модуля.'>
                    <span className={styles.item}>
                        <span className={styles.key}>crm.*</span>
                        <span className={styles.action}>
                            <Plus />
                        </span>
                    </span>
                </ModalTooltip>
            </div>
            <span className={styles.inter} />
            <div className={styles.capture}>Текущие разрешения</div>
            <div className={styles.permissions}>
                <ModalTooltip content='crm.* - полный доступ ко всем возможностям CRM модуля.'>
                    <span className={styles.item}>
                        <span className={styles.key}>crm.*</span>
                        <span className={styles.action}>
                            <Close />
                        </span>
                    </span>
                </ModalTooltip>
            </div>
        </div>
    )
}