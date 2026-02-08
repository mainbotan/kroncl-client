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
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useAccounts } from '@/apps/company/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { style } from 'framer-motion/client';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import Back from '@/assets/ui-kit/icons/back';

interface InvitationCardProps {
    invitation: CompanyInvitation;
}

export function InvitationCard({ invitation }: InvitationCardProps) {
    const accountsModule = useAccounts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const isWaiting = invitation.status === 'waiting';
    const isAccepted = invitation.status === 'accepted';
    const isRejected = invitation.status === 'rejected';

    const { showMessage } = useMessage();

    const handleRevoke = async () => {
        try {
            await accountsModule.revokeInvitation(invitation.id);
            showMessage({
            label: 'Приглашение успешно отозвано',
            variant: 'success'
            });
            setIsModalOpen(false);
            setIsVisible(false);
        } catch {
            showMessage({
            label: 'Не удалось отозвать приглашение',
            variant: 'error'
            });
        }
    };

    return (
        <>
        <AnimatePresence>
            {isVisible && (
            <motion.div
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ 
                opacity: 0,
                height: 0,
                transition: { 
                    duration: 0.1,
                    opacity: { duration: 0.2 }
                }
                }}
            >
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
                            icon={<Back />}
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
                className={styles.modal}
            >
                <PlatformModalConfirmation
                    title='Отозвать приглашение'
                    description={`Пользователь ${invitation.email} не сможет получить доступ к компании.`}
                    actions={[
                        {
                            children: 'Отмена', 
                            variant: 'light', 
                            onClick: () => setIsModalOpen(false)
                        },
                        {
                            variant: "accent", 
                            onClick: handleRevoke,
                            icon: <Back className={styles.actionRotate} />,
                            children: 'Отозвать'
                        }
                    ]}
               />
            </PlatformModal>
            </motion.div>
            )}
        </AnimatePresence>
        </>
    );
}