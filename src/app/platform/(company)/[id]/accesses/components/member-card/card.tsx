import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import styles from './card.module.scss';
import Button from '@/assets/ui-kit/button/button';
import Close from '@/assets/ui-kit/icons/close';
import { CompanyAccount } from '@/apps/company/modules/accounts/types';
import { getGradientFromString, getFirstLetter } from '@/assets/utils/avatars';
import { useAuth } from '@/apps/account/auth/context/AuthContext';
import { formatDate } from '@/assets/utils/date';

interface MemberCardProps {
  account: CompanyAccount;
}

export function MemberCard({ account }: MemberCardProps) {
  const { user } = useAuth();
  
  const isOwner = account.role_code === 'owner';
  const isCurrentUser = user?.id === account.id;
  const showKickButton = !isOwner && !isCurrentUser;

  const avatarStyle = account.avatar_url
    ? { backgroundImage: `url(${account.avatar_url})` }
    : { background: getGradientFromString(account.name) };

  const displayLetter = account.avatar_url 
    ? '' 
    : getFirstLetter(account.name);

  const joinedDate = formatDate(account.joined_at);

  return (
    <div className={styles.card}>
      <div 
        className={styles.avatar}
        style={avatarStyle}
      >
        {displayLetter}
      </div>
      <div className={styles.info}>
        <div className={styles.identy}>
          <span className={styles.name}>{account.name}</span>
          <ModalTooltip content={`${account.email} - корпоративная почта аккаунта`}>
            <span className={styles.email}>{account.email}</span>
          </ModalTooltip>
        </div>
        <div className={styles.tags}>
          <span className={styles.tag}>{account.role_name}</span>
          <span className={styles.tag}>Присоединился {joinedDate}</span>
        </div>
      </div>
      <div className={styles.actions}>
        {showKickButton && (
          <Button className={styles.action} variant='light' icon={<Close />}>
            Выгнать
          </Button>
        )}
      </div>
    </div>
  );
}