import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import styles from './card.module.scss';
import Button, { ButtonProps } from '@/assets/ui-kit/button/button';
import clsx from 'clsx';
import { Employee } from '@/apps/company/modules/hrm/types';
import { useParams } from 'next/navigation';
import { getFirstLetter, getGradientFromString } from '@/assets/utils/avatars';

interface EmployeeCardProps {
    employee: Employee;
    showDefaultActions?: boolean;
    actions?: ButtonProps[];
    variant?: 'default' | 'compact';
}

export function EmployeeCard({ 
    employee ,
    showDefaultActions = true,
    actions,
    variant = 'default'
}: EmployeeCardProps) {
    const params = useParams();
    const companyId = params.id as string;

    const fullName = `${employee.first_name} ${employee.last_name ? employee.last_name : ''}`;
    const initials = `${employee.first_name[0]}${employee.last_name ?  employee.last_name[0] : ''}`;

    const avatarGradient = getGradientFromString(fullName);

    return (
        <div className={clsx(styles.card, styles[variant])}>
            <div className={styles.base}>
                <div 
                    className={styles.avatar}
                    style={{ background: avatarGradient }}
                >
                    {initials}
                </div>
                <div className={styles.info}>
                    <div className={styles.name}>{fullName}</div>
                    <div className={styles.tags}>
                        {employee.is_account_linked ? (
                            <span className={clsx(styles.tag, styles.accent)}>Аккаунт привязан</span>
                        ) : (
                            <span className={styles.tag}>Без аккаунта</span>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.actions}>
                {showDefaultActions && (
                    <Button 
                        href={`/platform/${companyId}/hrm/${employee.id}`} 
                        as='link' 
                        className={styles.action} 
                        variant='accent'
                    >
                        Карта сотрудника
                    </Button>
                )}
                {actions?.map((action, index) => (
                    <Button key={index} className={clsx(styles.action, action.className)} {...action} />
                ))}
            </div>
            <span className={styles.flag} />
            <span className={styles.code}>{employee.id}</span>
        </div>
    );
}