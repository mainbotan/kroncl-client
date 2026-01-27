import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '../../layout.module.scss';

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
      Совершая любые действия с аккаунтом Kroncl, вы принимаете{' '}
      <Link href="/privacy-policy">
        <motion.span
          className={styles.link}
          whileHover={{ 
            color: "#0070f3", // Или ваш брендовый цвет
            textDecoration: "underline" 
          }}
          transition={{ duration: 0.2 }}
        >
          Политику конфиденциальности и условия использования платформы
        </motion.span>
      </Link>
      .
    </motion.div>
  );
}