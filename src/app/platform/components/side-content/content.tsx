'use client';

import React from 'react';
import styles from './content.module.scss';
import { useSideContent } from './context';
import Close from '@/assets/ui-kit/icons/close';
import CollapseRight from '@/assets/ui-kit/icons/collapse-right';

export interface PlatformSideContentProps {
  className?: string;
}

export function PlatformSideContent({ className }: PlatformSideContentProps) {
  const { content, isOpen, closeSideContent } = useSideContent();

  if (!content && !isOpen) return null;

  return (
    <div className={`${styles.side} ${isOpen ? styles.open : ''}`}>
        <button className={styles.close} onClick={closeSideContent}><CollapseRight /></button>
        <div className={styles.area}>

        </div>
    </div>
  );
}