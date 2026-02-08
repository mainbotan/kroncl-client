import Button, { ButtonProps } from '@/assets/ui-kit/button/button';
import styles from './confirmation.module.scss';

interface PlatformModalConfirmationProps {
    title: string;
    description?: string;
    actions: ButtonProps[];
}

export function PlatformModalConfirmation({
    title,
    description,
    actions
}: PlatformModalConfirmationProps) {
    return (
        <div className={styles.content}>
            <div className={styles.title}>{title}</div>
            {description && (<div className={styles.description}>
                {description}
            </div>)}
            <div className={styles.actions}>
                {actions.map((action, index) => (
                    <Button
                        className={styles.action}
                        key={index}
                        {...action}
                    />
                ))}
            </div>
        </div>
    )
}