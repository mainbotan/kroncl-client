'use client';

import clsx from 'clsx';
import styles from './input.module.scss';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'leader' | 'contrast' | 'elevated' | 'empty' | 'glass' | 'brand' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  fullWidth?: boolean;
  label?: string | false;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      variant = 'default',
      error = false,
      fullWidth = false,
      label = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        className={clsx(
          styles.input,
          {
            [styles.default]: variant === 'default',
            [styles.leader]: variant === 'leader',
            [styles.contrast]: variant === 'contrast',
            [styles.elevated]: variant === 'elevated',
            [styles.empty]: variant === 'empty',
            [styles.glass]: variant === 'glass',
            [styles.brand]: variant === 'brand',
            [styles.accent]: variant === 'accent',
            [styles.fullWidth]: fullWidth,
            [styles.sm]: size === 'sm',
            [styles.bg]: size === 'lg'
          },
          { [styles.fullWidth]: fullWidth },
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;