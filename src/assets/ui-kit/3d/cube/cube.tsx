'use client';

import React from 'react';
import styles from './cube.module.scss';

interface CubeProps {
  variant?: 'default' | 'withShadow' | 'withMask';
}

export default function Cube({ variant = 'default' }: CubeProps) {
  return (
    <div className={styles.cubeContainer}>
      <div className={`${styles.cube} ${styles[variant]}`}>
        <div className={`${styles.face} ${styles.front}`} />
        <div className={`${styles.face} ${styles.back}`} />
        <div className={`${styles.face} ${styles.top}`} />
        <div className={`${styles.face} ${styles.bottom}`} />
        <div className={`${styles.face} ${styles.left}`} />
        <div className={`${styles.face} ${styles.right}`} />
      </div>
    </div>
  );
}