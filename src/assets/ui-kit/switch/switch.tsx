'use client';

import clsx from 'clsx';
import styles from './switch.module.scss';
import { InputHTMLAttributes, ReactNode } from 'react';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  variant?: 'default' | 'leader' | 'contrast' | 'elevated' | 'empty' | 'glass' | 'brand' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function Switch({
  label,
  variant = 'default',
  size = 'md',
  disabled = false,
  className,
  ...props
}: SwitchProps) {
  return (
    <label className={clsx(
      styles.switchWrapper,
      {
        [styles.disabled]: disabled,
        [styles.sm]: size === 'sm',
        [styles.lg]: size === 'lg',
      },
      className
    )}>
      <input
        type="checkbox"
        className={clsx(styles.switch)}
        disabled={disabled}
        {...props}
      />
      <span className={clsx(
        styles.slider,
        styles[variant]
      )} />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}