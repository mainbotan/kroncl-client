'use client';

import clsx from 'clsx';
import styles from './input.module.scss';
import { InputHTMLAttributes, forwardRef } from 'react';

export type InputVariant = 'default' | 'light' | 'leader' | 'contrast' | 'elevated' | 'empty' | 'glass' | 'brand' | 'accent';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
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
          styles[variant],
          styles[size],
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