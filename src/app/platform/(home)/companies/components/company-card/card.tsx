import Earth from '@/assets/ui-kit/icons/earth';
import Guard from '@/assets/ui-kit/icons/guard';
import { AccountCompany } from '@/apps/account/companies/types';
import { formatDate } from '@/assets/utils/date';
import styles from './card.module.scss';
import { getColorFromString, getFirstLetter } from '@/assets/utils/avatars';
import Link from 'next/link';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';

interface CompanyCardProps {
    company: AccountCompany;
}

export function CompanyCard({ company }: CompanyCardProps) {
    const firstLetter = getFirstLetter(company.name);
    const avatarColor = getColorFromString(company.name);

    // Тексты для тултипов
    const statusTooltip = company.is_public 
        ? "Публичная компания - видна всем пользователям."
        : "Приватная компания - доступ только по приглашению.";

    const roleTooltips: Record<string, string> = {
        owner: "Вы - владелец компании. Полный доступ ко всем возможностям.",
        admin: "Вы - администратор. Расширенные права управления.",
        member: "Вы - участник. Базовый доступ к функциям компании.",
        guest: "Вы - гость. Ограниченный доступ только для просмотра."
    };

    const roleTooltip = roleTooltips[company.role_code] || "Ваша роль в компании";

    const dateTooltip = `Вы присоединились к компании ${formatDate(company.joined_at)}`;

    return (
        <div className={styles.card}>
            <div className={styles.icon}>
                {company.avatar_url ? (
                    <Link href={`/platform/${company.id}`}
                        className={styles.avatar} 
                        style={{ 
                            backgroundImage: `url(${company.avatar_url})` 
                        }}
                    />
                ) : (
                    <Link href={`/platform/${company.id}`}
                        className={styles.avatar}
                        style={{ 
                            backgroundColor: avatarColor,
                            color: '#fff'
                        }}
                    >
                        {firstLetter}
                    </Link>
                )}
            </div>
            <div className={styles.info}>
                <div className={styles.capture}>
                    <Link href={`/platform/${company.id}`}>
                        {company.name}
                    </Link>
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
                    <ModalTooltip
                        content={roleTooltip}
                        side="top"
                    >
                        <span className={styles.tag}>
                            {company.role_name}
                        </span>
                    </ModalTooltip>
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
        </div>
    );
}