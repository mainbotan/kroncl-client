'use client';

import clsx from 'clsx';
import styles from './card.module.scss';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ClientDetail } from '@/apps/company/modules/crm/types';
import { getInitials, getFullName } from './_utils';
import { getGradientFromString } from '@/assets/utils/avatars';
import { formatDate } from '@/assets/utils/date';
import { formatPhoneNumber } from '@/assets/utils/phone-utils';
import Button from '@/assets/ui-kit/button/button';

interface ClientCardProps {
    client: ClientDetail;
    isSelected?: boolean;
    onSelect?: (client: ClientDetail) => void;
    selectable?: boolean;
}

export function ClientCard({ 
    client, 
    isSelected, 
    onSelect,
    selectable = false 
}: ClientCardProps) {
    const params = useParams();
    const companyId = params.id as string;

    const fullName = getFullName(client);
    const initials = getInitials(client);
    const avatarGradient = getGradientFromString(fullName);
    const typeLabel = client.type === 'individual' ? 'Физическое лицо' : 'Юридическое лицо';
    const displayPhone = client.phone ? formatPhoneNumber(client.phone) : null;
    const displayEmail = client.email || null;
    const createdDate = formatDate(client.created_at);

    const handleClick = (e: React.MouseEvent) => {
        if (selectable && onSelect) {
            e.preventDefault();
            onSelect(client);
        }
    };

    const cardContent = (
        <>
            <div className={styles.icon} style={{ background: avatarGradient }}>
                {initials}
            </div>
            <div className={styles.info}>
                <div className={styles.name}>
                    <span>{fullName}</span>
                    {displayPhone && (
                        <span className={styles.contact}>{displayPhone}</span>
                    )}
                    {displayEmail && !displayPhone && (
                        <span className={styles.contact}>{displayEmail}</span>
                    )}
                </div>
                <div className={styles.tags}>
                    <ModalTooltip content={`Клиент - ${typeLabel.toLowerCase()}.`}>
                        <span className={clsx(styles.tag, styles.accent)}>{typeLabel}</span>
                    </ModalTooltip>
                    
                    <ModalTooltip content='Источник привлечения'>
                        <span className={clsx(styles.tag, styles.source)}>
                            {client.source.name}
                        </span>
                    </ModalTooltip>
                    
                    <ModalTooltip content='Дата создания клиента'>
                        <span className={styles.tag}>{createdDate}</span>
                    </ModalTooltip>
                    
                    {client.status === 'inactive' && (
                        <ModalTooltip content='Клиент неактивен'>
                            <span className={clsx(styles.tag, styles.inactive)}>Неактивен</span>
                        </ModalTooltip>
                    )}
                    
                    {client.comment && (
                        <ModalTooltip content={client.comment}>
                            <span className={styles.tag}>{client.comment}</span>
                        </ModalTooltip>
                    )}
                </div>
            </div>
            <div className={styles.actions}>
                {selectable ? (
                    <Button 
                        className={styles.action} 
                        variant='light'
                        onClick={handleClick}
                    >
                        {isSelected ? 'Выбрано' : 'Выбрать'}
                    </Button>
                ) : (
                    <Link href={`/platform/${companyId}/crm/${client.id}`}>
                        <Button className={styles.action} variant='light'>
                            Открыть
                        </Button>
                    </Link>
                )}
            </div>
        </>
    );

    return (
        <div className={clsx(styles.client, isSelected && styles.selected)}>
            {cardContent}
        </div>
    );
}