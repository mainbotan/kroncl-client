import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import { Company } from '@/apps/company/init/types';
import clsx from 'clsx';
import { getColorFromString, getFirstLetter } from '@/assets/utils/avatars';
import { formatDate } from '@/assets/utils/date';

export interface VisitBlockProps extends PageBlockProps {
    company: Company;
}

export function VisitBlock({
    className,
    company
}: VisitBlockProps) {
    const firstLetter = getFirstLetter(company.name);
    const avatarColor = getColorFromString(company.name);
    
    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.avatarCol}>
                {company.avatar_url ? (
                    <div
                        className={styles.icon} 
                        style={{ 
                            backgroundImage: `url(${company.avatar_url})` 
                        }}
                    />
                ) : (
                    <div className={styles.icon}
                        style={{ 
                            backgroundColor: avatarColor,
                            color: '#fff'
                        }}>
                        {firstLetter}
                    </div>
                )}
            </div>
            <div className={styles.infoCol}>
                <div className={styles.name}>{company.name}</div>
                <div className={styles.description}>
                    {company.description || '...'}
                </div>
                <div className={styles.tags}>
                    <div className={styles.tag}>
                        <div className={styles.value}>Публичная</div>
                        <div className={styles.description}>Открыта для новых сотрудников</div>
                    </div>
                    {company.email && (
                    <div className={styles.tag}>
                        <div className={styles.value}>{company.email}</div>
                        <div className={styles.description}>Почта для связи</div>
                    </div>
                    )}
                    {company.site && (
                    <div className={styles.tag}>
                        <div className={styles.value}>{company.site}</div>
                        <div className={styles.description}>Официальный сайт</div>
                    </div>
                    )}
                    {company.region && (
                    <div className={styles.tag}>
                        <div className={styles.value}>{company.region}</div>
                        <div className={styles.description}>Регион</div>
                    </div>
                    )}
                    {company.created_at && (
                    <div className={styles.tag}>
                        <div className={styles.value}>{formatDate(company.created_at)}</div>
                        <div className={styles.description}>Дата создания</div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    )
}