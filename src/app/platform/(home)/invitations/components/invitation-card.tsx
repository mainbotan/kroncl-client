import clsx from 'clsx';
import styles from './invitation.module.scss';
import Button from '@/assets/ui-kit/button/button';
import CheckMark from '@/assets/ui-kit/icons/check-mark';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import Time from '@/assets/ui-kit/icons/time';
import { AccountInvitation } from '@/apps/account/invitations/types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { invitationsApi } from '@/apps/account/invitations/api';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';

interface InvitationCardProps {
    invitation: AccountInvitation;
    onStatusChange?: (id: string, newStatus: string) => void;
}

export function InvitationCard({ invitation, onStatusChange }: InvitationCardProps) {
    const [currentInvitation, setCurrentInvitation] = useState(invitation);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { showMessage } = useMessage();

    const isWaiting = currentInvitation.status === 'waiting';
    const isAccepted = currentInvitation.status === 'accepted';
    const isRejected = currentInvitation.status === 'rejected';

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const updateStatus = (newStatus: 'accepted' | 'rejected', responseData: any) => {
        setCurrentInvitation(prev => ({
            ...prev,
            status: newStatus,
            updated_at: responseData.updated_at || new Date().toISOString()
        }));
        onStatusChange?.(currentInvitation.id, newStatus);
    };

    const handleAccept = async () => {
        setIsLoading(true);
        try {
            const response = await invitationsApi.acceptInvitation(currentInvitation.id);
            if (!response.status) {
                throw new Error(response.message);
            }
            showMessage({
                label: 'Приглашение принято',
                variant: 'success'
            });
            setIsAcceptModalOpen(false);
            updateStatus('accepted', response.data);
        } catch (error: any) {
            showMessage({
                label: 'Не удалось принять приглашение',
                variant: 'error',
                about: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        setIsLoading(true);
        try {
            const response = await invitationsApi.rejectInvitation(currentInvitation.id);
            if (!response.status) {
                throw new Error(response.message);
            }
            showMessage({
                label: 'Приглашение отклонено',
                variant: 'success'
            });
            setIsRejectModalOpen(false);
            updateStatus('rejected', response.data);
        } catch (error: any) {
            showMessage({
                label: 'Не удалось отклонить приглашение',
                variant: 'error',
                about: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            key={currentInvitation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            layout
        >
            <div className={styles.card}>
                <div className={styles.info}>
                    <span className={styles.company}>{currentInvitation.company_name}</span>
                    <span className={styles.date}>{formatDate(currentInvitation.created_at)}</span>
                    <motion.span
                        className={clsx(
                            styles.status,
                            isWaiting && styles.waiting,
                            isAccepted && styles.accepted,
                            isRejected && styles.rejected
                        )}
                        key={currentInvitation.status}
                        initial={{ opacity: 0.5, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isWaiting && 'Ожидает'}
                        {isAccepted && 'Принято'}
                        {isRejected && 'Отклонено'}
                    </motion.span>
                </div>
                
                <AnimatePresence mode="wait">
                    {isWaiting && (
                        <motion.div
                            className={styles.actions}
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Button 
                                className={styles.action} 
                                variant='light'
                                onClick={() => setIsRejectModalOpen(true)}
                                disabled={isLoading}
                            >
                                Отклонить
                            </Button>
                            <Button 
                                className={styles.action} 
                                variant='accent' 
                                icon={<SuccessStatus />}
                                onClick={() => setIsAcceptModalOpen(true)}
                                disabled={isLoading}
                            >
                                Принять
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Модалка принятия */}
            <PlatformModal
                isOpen={isAcceptModalOpen}
                onClose={() => setIsAcceptModalOpen(false)}
            >
                <PlatformModalConfirmation
                    title='Принять приглашение'
                    description={`Вы уверены, что хотите принять приглашение от компании "${invitation.company_name}"?`}
                    actions={[
                        {
                            children: 'Отмена',
                            variant: 'light',
                            onClick: () => setIsAcceptModalOpen(false),
                            disabled: isLoading
                        },
                        {
                            variant: 'accent',
                            onClick: handleAccept,
                            icon: <SuccessStatus />,
                            children: 'Принять',
                            disabled: isLoading
                        }
                    ]}
                />
            </PlatformModal>

            {/* Модалка отклонения */}
            <PlatformModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
            >
                <PlatformModalConfirmation
                    title='Отклонить приглашение'
                    description={`Вы уверены, что хотите отклонить приглашение от компании "${invitation.company_name}"?`}
                    actions={[
                        {
                            children: 'Отмена',
                            variant: 'light',
                            onClick: () => setIsRejectModalOpen(false),
                            disabled: isLoading
                        },
                        {
                            variant: 'accent',
                            onClick: handleReject,
                            icon: <ErrorStatus />,
                            children: 'Отклонить',
                            disabled: isLoading
                        }
                    ]}
                />
            </PlatformModal>
        </motion.div>
    );
}