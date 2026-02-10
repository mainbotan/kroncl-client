import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import styles from './card.module.scss';
import Button from '@/assets/ui-kit/button/button';
import clsx from 'clsx';
import { Employee } from '@/apps/company/modules/hrm/types';
import { useParams } from 'next/navigation';
import { getFirstLetter, getGradientFromString } from '@/assets/utils/avatars';

interface EmployeeCardProps {
    employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
    const params = useParams();
    const companyId = params.id as string;

    const fullName = `${employee.first_name} ${employee.last_name ? employee.last_name : ''}`;
    const initials = `${employee.first_name[0]}${employee.last_name ?  employee.last_name[0] : ''}`;

    const avatarGradient = getGradientFromString(fullName);

    return (
        <div className={styles.card}>
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
                <Button 
                    href={`/platform/${companyId}/hrm/${employee.id}`} 
                    as='link' 
                    className={styles.action} 
                    variant='accent'
                >
                    Карта сотрудника
                </Button>
            </div>
            <span className={styles.flag} />
            <span className={styles.code}>{employee.id}</span>
        </div>
    );
}