import Button from '@/assets/ui-kit/button/button';
import styles from './widget.module.scss';
import Link from 'next/link';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import clsx from 'clsx';

export interface EmployeeWidgetProps {
    value?: string | number;
    legend: string;
    action: 'copy' | 'open';
    href?: string;
    variant?: 'accent' | 'default'
}

export function EmployeeWidget({
  value,
  legend,
  action = 'copy',
  href,
  variant = 'default'
}: EmployeeWidgetProps) {
    const { showMessage } = useMessage();
    const handleCopy = () => {
        if (value !== undefined) {
            navigator.clipboard.writeText(String(value))
                .then(() => {
                    showMessage({
                        label: "Скопировано в буфер",
                        variant: 'success',
                        icon: <SuccessStatus />
                    })
                })
                .catch(err => {
                    showMessage({
                        label: "Ошибка копирования в буфер",
                        variant: 'error',
                        icon: <ErrorStatus />
                    })
                    console.error('Ошибка при копировании:', err);
                });
        }
    };

    const renderButton = () => {
        const buttonContent = action === 'copy' ? 'Скопировать' : 'Открыть';
        
        if (action === 'open' && href) {
            return (
                <Link href={href} passHref legacyBehavior>
                    <Button 
                        className={styles.action} 
                        fullWidth 
                        variant="light"
                        as="a"
                        target="_blank"
                    >
                        {buttonContent}
                    </Button>
                </Link>
            );
        }
        
        return (
            <Button 
                className={styles.action} 
                fullWidth 
                variant="light"
                onClick={action === 'copy' ? handleCopy : undefined}
                disabled={action === 'open'}
            >
                {buttonContent}
            </Button>
        );
    };

    return (
        <div className={clsx(styles.widget, styles[variant])}>
            <div className={styles.value}>{value !== undefined ? value : '—'}</div>
            <div className={styles.legend}>{legend}</div>
            {renderButton()}
        </div>
    );
}