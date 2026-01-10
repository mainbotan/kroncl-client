'use client';

import clsx from 'clsx';
import styles from './textarea.module.scss';
import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'leader' | 'contrast' | 'elevated' | 'empty' | 'glass' | 'brand' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  fullWidth?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      variant = 'default',
      error = false,
      fullWidth = false,
      resize = 'both',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          styles.textarea,
          {
            [styles.sm]: size === 'sm',
            [styles.lg]: size === 'lg',
            [styles.default]: variant === 'default',
            [styles.leader]: variant === 'leader',
            [styles.contrast]: variant === 'contrast',
            [styles.elevated]: variant === 'elevated',
            [styles.empty]: variant === 'empty',
            [styles.glass]: variant === 'glass',
            [styles.brand]: variant === 'brand',
            [styles.accent]: variant === 'accent',
            [styles.error]: error,
            [styles.fullWidth]: fullWidth,
            [styles.resizeNone]: resize === 'none',
            [styles.resizeHorizontal]: resize === 'horizontal',
            [styles.resizeVertical]: resize === 'vertical',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;