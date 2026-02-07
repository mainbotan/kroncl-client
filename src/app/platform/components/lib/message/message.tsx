'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './message.module.scss';
import Wallet from '@/assets/ui-kit/icons/wallet';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import WarningStatus from '@/assets/ui-kit/icons/error-status';
import { MessageConfig } from './types';

interface PlatformMessageProps {
  message: MessageConfig;
  onClose: () => void;
}

export function PlatformMessage({ message, onClose }: PlatformMessageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [timerProgress, setTimerProgress] = useState(100);
  const [showAbout, setShowAbout] = useState(false);
  const [aboutTimeout, setAboutTimeout] = useState<NodeJS.Timeout | null>(null);

  const duration = message.duration || 5000;
  const showTimer = message.showTimer ?? true;

  const getIcon = () => {
    if (message.icon) return message.icon;
    
    switch (message.variant) {
      case 'error':
        return <ErrorStatus />;
      case 'success':
        return <SuccessStatus />;
      case 'warning':
        return <WarningStatus />;
      default:
        return <Wallet />;
    }
  };

  const getVariantClass = () => {
    switch (message.variant) {
      case 'error':
        return styles.error;
      case 'success':
        return styles.success;
      case 'warning':
        return styles.warning;
      default:
        return '';
    }
  };

  useEffect(() => {
    if (!showTimer || isHovered) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.max(0, 100 - (elapsed / duration) * 100);
      setTimerProgress(progress);

      if (progress <= 0) {
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, showTimer, isHovered, onClose]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (message.about) {
      const timeout = setTimeout(() => {
        setShowAbout(true);
      }, 500);
      setAboutTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowAbout(false);
    if (aboutTimeout) {
      clearTimeout(aboutTimeout);
      setAboutTimeout(null);
    }
  };

  const handleClick = () => {
    onClose();
  };

  return (
    <motion.div
      className={`${styles.message} ${getVariantClass()}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{ 
        type: "spring", 
        damping: 20, 
        stiffness: 300,
        duration: 0.3 
      }}
      whileHover={{ y: -2 }}
    >
      <AnimatePresence>
        {showAbout && message.about && (
          <motion.div
            key="about"
            className={styles.about}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {message.about}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        className={styles.base}
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
      >
        {showTimer && (
          <motion.div
            className={styles.line}
            style={{ width: `${timerProgress}%` }}
            initial={{ width: '100%' }}
            animate={{ width: `${timerProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        )}
        <motion.div 
          className={styles.icon}
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {getIcon()}
        </motion.div>
        <motion.div 
          className={styles.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {message.label}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}