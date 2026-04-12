import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '../../layout.module.scss';
import { PAPERS_LINK_PLATFORM_USAGE, PAPERS_LINK_POLICY_PRIVACY } from '@/app/(external)/(sections)/(customers)/(papers)/navigation.config';

export function Warning() {
  return (
    <motion.div
      className={styles.warning}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: 0.2
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      Совершая любые действия с аккаунтом Kroncl, включая вход и регистрацию, вы принимаете{' '}
      <Link href={PAPERS_LINK_POLICY_PRIVACY}>
        <motion.span
          className={styles.link}
          whileHover={{ 
            color: "#0070f3", // Или ваш брендовый цвет
            textDecoration: "underline" 
          }}
          transition={{ duration: 0.2 }}
        >
          Политику конфиденциальности
        </motion.span>
      </Link>
      &nbsp; и &nbsp;
      <Link href={PAPERS_LINK_PLATFORM_USAGE}>
        <motion.span
          className={styles.link}
          whileHover={{ 
            color: "#0070f3", // Или ваш брендовый цвет
            textDecoration: "underline" 
          }}
          transition={{ duration: 0.2 }}
        >
          Правила использования платформы
        </motion.span>
      </Link>
      .
    </motion.div>
  );
}