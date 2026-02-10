'use client';

import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import styles from './card.module.scss';
import Button, { ButtonProps } from '@/assets/ui-kit/button/button';
import Close from '@/assets/ui-kit/icons/close';
import { CompanyAccount } from '@/apps/company/modules/accounts/types';
import { getGradientFromString, getFirstLetter } from '@/assets/utils/avatars';
import { useAuth } from '@/apps/account/auth/context/AuthContext';
import { formatDate } from '@/assets/utils/date';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { useAccounts } from '@/apps/company/modules';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import clsx from 'clsx';
import { ModalPermissions } from './modal-permissions/modal';
import Keyhole from '@/assets/ui-kit/icons/keyhole';

interface MemberCardProps {
  account: CompanyAccount;
  className?: string;
  showDefaultActions?: boolean;
  actions?: ButtonProps[];
}

export function MemberCard({ 
  account, 
  showDefaultActions = true, 
  className, 
  actions 
}: MemberCardProps) {
  const { user } = useAuth();
  const accountsModule = useAccounts();
  const [isModalDropOpen, setIsModalDropOpen] = useState(false);
  const [isModalPermissionsOpen, setIsModalPermissionsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { showMessage } = useMessage();

  const handleDrop = async () => {
      try {
          await accountsModule.dropAccount(account.id);
          showMessage({
          label: 'Пользователь выгнан из компании.',
          variant: 'success'
          });
          setIsModalDropOpen(false);
          setIsVisible(false);
      } catch {
          showMessage({
          label: 'Не удалось выгнать пользователя.',
          variant: 'error'
          });
      }
  };
  
  const isOwner = account.role_code === 'owner';
  const isCurrentUser = user?.id === account.id;
  const showKickButton = !isOwner;

  const avatarStyle = account.avatar_url
    ? { backgroundImage: `url(${account.avatar_url})` }
    : { background: getGradientFromString(account.name) };

  const displayLetter = account.avatar_url 
    ? '' 
    : getFirstLetter(account.name);

  const joinedDate = formatDate(account.joined_at);

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
      <div className={clsx(styles.card, className)}>
        <div className={styles.base}>
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
            {showDefaultActions && (
              <>
              {showKickButton && (
                <Button onClick={(() => setIsModalDropOpen(true))} className={styles.action} variant='light' icon={<Close />}>
                  {isCurrentUser ? 'Выйти' : 'Выгнать'}
                </Button>
              )}
              {!isOwner && (
                <Button onClick={(() => setIsModalPermissionsOpen(true))} className={styles.action} variant='accent' icon={<Keyhole />}>
                  Разрешения
                </Button>
              )}
              </>
            )}
            {actions?.map((action, index) => (
              <Button 
                key={index} 
                className={clsx(styles.action, action.className)} 
                {...action}
              />
            ))}
          </div>
        </div>
      </div>

      {/* drop account */}
      <PlatformModal
          isOpen={isModalDropOpen}
          onClose={() => setIsModalDropOpen(false)}
          className={styles.modal}
      >
        <PlatformModalConfirmation
            title={isCurrentUser ? 'Выйти из компании?' : 'Выгнать пользователя?'}
            description={
              isCurrentUser ? `После выхода из компании вы потеряете доступ к учётной системе до следующего приглашения.` : 
              `Пользователь ${account.email} потеряет доступ к компании - в том числе все выданные разрешения.`
            }
            actions={[
                {
                    children: 'Отмена', 
                    variant: 'light', 
                    onClick: () => setIsModalDropOpen(false)
                },
                {
                    variant: "accent", 
                    onClick: handleDrop,
                    icon: <Close />,
                    children: isCurrentUser ? 'Выйти' : 'Выгнать'
                }
            ]}
        />
      </PlatformModal>

      {/* modal permissions */}
      <PlatformModal
          isOpen={isModalPermissionsOpen}
          onClose={() => setIsModalPermissionsOpen(false)}
          className={styles.modal}
      >
        <ModalPermissions />
      </PlatformModal>
      </motion.div>
            )}
    </AnimatePresence>
    </>
  );
}