import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import styles from './card.module.scss';
import Button from '@/assets/ui-kit/button/button';
import Bond from '@/assets/ui-kit/icons/bond';
import Time from '@/assets/ui-kit/icons/time';
import Close from '@/assets/ui-kit/icons/close';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import { CompanyInvitation } from '@/apps/company/modules/accounts/types';
import { useState } from 'react';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformMessage } from '@/app/platform/components/lib/message/message';

interface InvitationCardProps {
    invitation: CompanyInvitation;
}

export function InvitationCard({ invitation }: InvitationCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isWaiting = invitation.status === 'waiting';
    const isAccepted = invitation.status === 'accepted';
    const isRejected = invitation.status === 'rejected';

    const handleRevoke = () => {
        // Логика отзыва приглашения
        console.log('Отзываем приглашение:', invitation.id);
        setIsModalOpen(false);
    };

    return (
        <>
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
                        <Button 
                            onClick={() => setIsModalOpen(true)} 
                            className={styles.action} 
                            variant='light' 
                            icon={<Close />}
                        >
                            Отозвать
                        </Button>
                    )}
                </div>
            </div>

            {/* revoke invitation */}
            <PlatformModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Отозвать приглашение</h3>
                    <p style={{ marginBottom: '2rem', color: 'var(--color-text-description)' }}>
                        Вы уверены, что хотите отозвать приглашение для 
                        <strong> {invitation.email}</strong>?
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        justifyContent: 'center' 
                    }}>
                        <Button 
                            variant="light" 
                            onClick={() => setIsModalOpen(false)}
                        >
                            Отмена
                        </Button>
                        <Button 
                            variant="light" 
                            onClick={handleRevoke}
                            icon={<Close />}
                        >
                            Отозвать приглашение
                        </Button>
                    </div>
                </div>
            </PlatformModal>
        </>
    );
}