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
import Keyhole from '@/assets/ui-kit/icons/keyhole';
import { useParams } from 'next/navigation';
import { roleName } from '@/app/platform/(manage)/(home)/companies/components/company-card/card';

interface MemberCardProps {
  account: CompanyAccount;
  className?: string;
  showDefaultActions?: boolean;
  actions?: ButtonProps[];
  canKick?: boolean;
}

export function MemberCard({ 
  account, 
  showDefaultActions = true, 
  className, 
  actions,
  canKick = true 
}: MemberCardProps) {
  const params = useParams();
  const companyId = params.id as string;
  const accountsModule = useAccounts();
  const [isVisible, setIsVisible] = useState(true);

  const avatarStyle = account.avatar_url
    ? { backgroundImage: `url(${account.avatar_url})` }
    : { background: getGradientFromString(account.name) };

  const displayLetter = account.avatar_url 
    ? '' 
    : getFirstLetter(account.name);

  const joinedDate = formatDate(account.joined_at);

  return (
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
              <span className={styles.tag}><span className={styles.text}>{roleName[account.role_code]}</span></span>
              <span className={styles.tag}><span className={styles.text}>Присоединился {joinedDate}</span></span>
            </div>
          </div>
          <div className={styles.actions}>
            {showDefaultActions && (
                <Button as='link' href={`/platform/${companyId}/accounts/${account.id}`} className={styles.action} variant='light'>
                  Открыть
                </Button>
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
  );
}