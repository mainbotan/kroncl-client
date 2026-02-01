import Earth from '@/assets/ui-kit/icons/earth';
import Guard from '@/assets/ui-kit/icons/guard';
import { AccountCompany } from '@/apps/account/companies/types';
import { formatDate } from '@/assets/utils/date';
import styles from './card.module.scss';
import { getColorFromString, getFirstLetter } from '@/assets/utils/avatars';
import Link from 'next/link';

interface CompanyCardProps {
    company: AccountCompany;
}

export function CompanyCard({ company }: CompanyCardProps) {
    const firstLetter = getFirstLetter(company.name);
    const avatarColor = getColorFromString(company.name);

    return (
        <div className={styles.card}>
            <div className={styles.icon}>
                {company.avatar_url ? (
                    <span 
                        className={styles.avatar} 
                        style={{ 
                            backgroundImage: `url(${company.avatar_url})` 
                        }}
                    />
                ) : (
                    <span 
                        className={styles.avatar}
                        style={{ 
                            backgroundColor: avatarColor,
                            color: '#fff'
                        }}
                    >
                        {firstLetter}
                    </span>
                )}
            </div>
            <div className={styles.info}>
                <div className={styles.capture}>
                    <Link href={`/platform/${company.id}`}>{company.name}</Link>
                    <span className={styles.marks}>
                        {company.is_public ? (
                            <Earth className={styles.svg} />
                        ) : (
                            <Guard className={styles.svg} />
                        )}
                    </span>
                </div>
                {company.description && (
                    <div className={styles.description}>
                        {company.description}
                    </div>
                )}
                <div className={styles.tags}>
                    <span className={styles.tag}>
                        {company.role_name}
                    </span>
                    <span className={styles.tag}>
                        Вступили <span className={styles.green}>{formatDate(company.joined_at)}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}