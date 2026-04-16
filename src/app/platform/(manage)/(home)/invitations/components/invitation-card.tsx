import clsx from 'clsx';
import styles from './invitation.module.scss';
import Button from '@/assets/ui-kit/button/button';
import { AccountInvitation } from '@/apps/account/invitations/types';
import { getColorFromString, getFirstLetter, getGradientFromString } from '@/assets/utils/avatars';
import { useAuth } from '@/apps/account/auth/context/AuthContext';

const STATUS_LABELS: Record<string, string> = {
    waiting: 'Ожидает',
    accepted: 'Принято',
    rejected: 'Отклонено'
};

interface InvitationCardProps {
    invitation: AccountInvitation;
    onAccept?: () => void;
    onReject?: () => void;
}

export function InvitationCard({ invitation, onAccept, onReject }: InvitationCardProps) {
    const { user } = useAuth();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const companyFirstLetter = getFirstLetter(invitation.company_name);
    const companyAvatarColor = getColorFromString(invitation.company_name);
    const userGradient = getGradientFromString(user?.name || '');
    const userInitials = user?.name?.charAt(0).toUpperCase() || 'П';

    const isWaiting = invitation.status === 'waiting';

    return (
        <div className={styles.card}>
            <div className={styles.thumbnail}>
                <div className={styles.tags}>
                    <span className={styles.tag}>{STATUS_LABELS[invitation.status] || invitation.status}</span>
                </div>
                <div className={styles.avatar} style={{background: `${userGradient}`}}>{userInitials}</div>
                <div className={clsx(styles.avatar, styles.company)} style={{backgroundColor: `${companyAvatarColor}`}}>{companyFirstLetter}</div>
            </div>
            <div className={styles.info}>
                <div className={styles.meta}>Приглашение в организацию, <span className={styles.accent}>{formatDate(invitation.created_at)}</span></div>
                <div className={styles.name}>
                    <span className={styles.secondary}>Приглашение в</span> <span className={styles.accent}>{invitation.company_name}</span>
                </div>
                {isWaiting && (
                    <div className={styles.about}>
                        Принимая приглашение в организацию, вы получаете гостевые разрешения, исключающие редактирование, создание и удаление объектов в организации. 
                        После вступления владельцы смогут расширить выданные вам разрешения.
                    </div>
                )}
            </div>
            {isWaiting && (
                <div className={styles.actions}>
                    <Button 
                        children='Отклонить'
                        variant='light'
                        className={styles.action}
                        onClick={onReject}
                    />
                    <Button 
                        children='Принять'
                        variant='accent'
                        className={styles.action}
                        onClick={onAccept}
                    />
                </div>
            )}
        </div>
    );
}