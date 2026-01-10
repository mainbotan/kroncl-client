'use client';

import { motion } from 'framer-motion';
import styles from './pulsing-circles.module.scss';

const PulsingSquare = () => {
  const circles = [
    // Верхняя линия (плотно)
    { left: -4, top: 2 }, { left: -3, top: 2 }, { left: -2, top: 2 }, { left: -1, top: 2 }, 
    { left: 0, top: 2 }, { left: 1, top: 2 }, { left: 2, top: 2 }, { left: 3, top: 2 }, { left: 4, top: 2 },
    // Правая линия
    { left: 4, top: 3 }, { left: 4, top: 4 }, { left: 4, top: 5 }, { left: 4, top: 6 }, 
    { left: 4, top: 7 }, { left: 4, top: 8 },
    // Нижняя линия
    { left: 4, top: 9 }, { left: 3, top: 9 }, { left: 2, top: 9 }, { left: 1, top: 9 },
    { left: 0, top: 9 }, { left: -1, top: 9 }, { left: -2, top: 9 }, { left: -3, top: 9 }, { left: -4, top: 9 },
    // Левая линия
    { left: -4, top: 8 }, { left: -4, top: 7 }, { left: -4, top: 6 }, { left: -4, top: 5 },
    { left: -4, top: 4 }, { left: -4, top: 3 }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.canvas}>
        {circles.map((pos, index) => (
          <motion.div
            key={index}
            className={styles.circle}
            style={{
              left: `calc(50% + ${pos.left}em)`,
              top: `${pos.top}em`
            }}
            animate={{
              scale: [1, 2.2, 1],
              opacity: [1, 0.4, 1],
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.5)',
                '0 0 40px rgba(59, 130, 246, 0.8)',
                '0 0 20px rgba(59, 130, 246, 0.5)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: index * 0.12,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PulsingSquare;
