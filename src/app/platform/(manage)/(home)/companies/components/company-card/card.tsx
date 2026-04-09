import Earth from '@/assets/ui-kit/icons/earth';
import Guard from '@/assets/ui-kit/icons/guard';
import { AccountCompany } from '@/apps/account/companies/types';
import { formatDate } from '@/assets/utils/date';
import styles from './card.module.scss';
import { getColorFromString, getFirstLetter } from '@/assets/utils/avatars';
import Link from 'next/link';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import clsx from 'clsx';

export const roleName: Record<string, string> = {
    owner: "Владелец",
    guest: "Гость"
};


interface CompanyCardProps {
    company: AccountCompany;
    className?: string;
}

export function CompanyCard({ company, className = ''}: CompanyCardProps) {
    const firstLetter = getFirstLetter(company.name);
    const avatarColor = getColorFromString(company.name);

    // Тексты для тултипов
    const statusTooltip = company.is_public 
        ? "Публичная компания - видна всем пользователям."
        : "Приватная компания - доступ только по приглашению.";

    const dateTooltip = `Вы присоединились к компании ${formatDate(company.joined_at)}`;

    return (
        <Link href={`/platform/${company.id}`} className={clsx(styles.card, className)}>
            <div className={styles.icon}>
                {company.avatar_url ? (
                    <div
                        className={styles.avatar} 
                        style={{ 
                            backgroundImage: `url(${company.avatar_url})` 
                        }}
                    />
                ) : (
                    <div className={styles.avatar}
                        style={{ 
                            backgroundColor: avatarColor,
                            color: '#fff'
                        }}>
                        {firstLetter}
                    </div>
                )}
            </div>
            <div className={styles.info}>
                <div className={styles.capture}>
                    <div>
                        {company.name}
                    </div>
                    <span className={styles.marks}>
                        <ModalTooltip
                            content={statusTooltip}
                            side="top"
                        >
                            {company.is_public ? (
                                <span><Earth className={styles.svg} /></span>
                            ) : (
                                <span><Guard className={styles.svg} /></span>
                            )}
                        </ModalTooltip>
                    </span>
                </div>
                {company.description && (
                    <div className={styles.description}>
                        {company.description}
                    </div>
                )}
                <div className={styles.tags}>
                    <span className={styles.tag}>
                        {roleName[company.role_code] || 'Роль не опознана'}
                    </span>
                    <ModalTooltip
                        content={dateTooltip}
                        side="top"
                    >
                        <span className={styles.tag}>
                            Вступили <span className={styles.green}>{formatDate(company.joined_at)}</span>
                        </span>
                    </ModalTooltip>
                </div>
            </div>
        </Link>
    );
}