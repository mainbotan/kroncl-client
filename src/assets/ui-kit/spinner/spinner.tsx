'use client';

import clsx from 'clsx';
import styles from './spinner.module.scss';
import { HTMLAttributes } from 'react';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'leader' | 'contrast' | 'accent' | 'brand';
}

export default function Spinner({
  size = 'md',
  variant = 'default',
  className,
  ...props
}: SpinnerProps) {
  return (
    <div
      className={clsx(
        styles.spinner,
        {
          [styles.sm]: size === 'sm',
          [styles.lg]: size === 'lg',
          [styles.default]: variant === 'default',
          [styles.leader]: variant === 'leader',
          [styles.contrast]: variant === 'contrast',
          [styles.accent]: variant === 'accent',
          [styles.brand]: variant === 'brand',
        },
        className
      )}
      {...props}
    />
  );
}