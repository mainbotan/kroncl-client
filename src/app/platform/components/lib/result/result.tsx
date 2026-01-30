import { useEffect, useState } from 'react';
import styles from './result.module.scss';
import Link from 'next/link';
import Button from '@/assets/ui-kit/button/button';
import { PlatformResultProps } from './_types';
import HappyPeople from '@/assets/ui-kit/icons/people/happy';
import clsx from 'clsx';
import SadPeople from '@/assets/ui-kit/icons/people/sad';
import { motion } from 'framer-motion';
import { fadeInUp, fadeInScale } from './_animations';

export function PlatformResult({
  title,
  description,
  actions = [],
  redirect,
  className = '',
  status = 'success',
  showIcon = true
}: PlatformResultProps & {
  status?: 'success' | 'error';
  showIcon?: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState<number>(redirect?.delay || 3000);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!redirect) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timer);
          setIsRedirecting(true);
          // Выполняем редирект
          if (typeof window !== 'undefined') {
            window.location.href = redirect.href;
          }
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirect]);

  const formatTime = (ms: number): string => {
    const seconds = Math.ceil(ms / 1000);
    return seconds.toString();
  };

  // Выбор иконки в зависимости от статуса
  const IconComponent = status === 'success' ? HappyPeople : SadPeople;

  return (
    <motion.div 
      className={clsx(styles.container, className)}
      {...fadeInUp}
    >
      {showIcon && (
        <motion.div 
          className={clsx(styles.icon, styles[status])}
          {...fadeInScale}
        >
          <IconComponent className={styles.svg} />
        </motion.div>
      )}
      
      <motion.div 
        className={styles.capture}
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.1 }}
      >
        {title}
      </motion.div>
      
      <motion.div 
        className={styles.description}
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.2 }}
      >
        {description}
      </motion.div>
      
      {redirect && timeLeft > 0 && (
        <motion.div 
          className={styles.redirect}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {redirect.label 
            ? redirect.label.replace('{seconds}', formatTime(timeLeft))
            : `Через ${formatTime(timeLeft)} сек. произойдет автоматический переход...`
          }
        </motion.div>
      )}
      
      {isRedirecting && (
        <motion.div 
          className={styles.redirecting}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Перенаправляем...
        </motion.div>
      )}
      
      {actions.length > 0 && (
        <motion.div 
          className={styles.actions}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {actions.map((action, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href={action.href}
                className={styles.actionLink}
              >
                <Button
                  variant={action.variant || 'contrast'}
                  onClick={action.onClick}
                  disabled={isRedirecting}
                >
                  {action.label}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}