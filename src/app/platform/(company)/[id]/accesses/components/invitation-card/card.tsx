import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import styles from './card.module.scss';
import Button from '@/assets/ui-kit/button/button';
import Bond from '@/assets/ui-kit/icons/bond';
import Time from '@/assets/ui-kit/icons/time';
import Close from '@/assets/ui-kit/icons/close';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import { CompanyInvitation } from '@/apps/company/modules/accounts/types';

interface InvitationCardProps {
  invitation: CompanyInvitation;
}

export function InvitationCard({ invitation }: InvitationCardProps) {
  const isWaiting = invitation.status === 'waiting';
  const isAccepted = invitation.status === 'accepted';
  const isRejected = invitation.status === 'rejected';

  return (
    <div className={styles.card}>
      {isWaiting && (
        <ModalTooltip content="Приглашение ожидает отклика пользователя.">
          <div className={styles.icon}><Time className={styles.waiting} /></div>
        </ModalTooltip>
      )}
      
      {isRejected && (
        <ModalTooltip content="Приглашение отклонено пользователем.">
          <div className={styles.icon}><ErrorStatus className={styles.rejected} /></div>
        </ModalTooltip>
      )}
      
      {isAccepted && (
        <ModalTooltip content="Приглашение одобрено пользователем.">
          <div className={styles.icon}><SuccessStatus className={styles.accepted} /></div>
        </ModalTooltip>
      )}
      
      <span className={styles.arrow}><Bond /></span>
      <div className={styles.info}>
        <ModalTooltip content="Отправили приглашение на эту почту.">
          <span className={styles.email}>{invitation.email}</span>
        </ModalTooltip>
      </div>
      <div className={styles.actions}>
        {isWaiting && (
          <Button className={styles.action} variant='light' icon={<Close />}>
            Отозвать
          </Button>
        )}
      </div>
    </div>
  );
}