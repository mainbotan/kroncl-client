'use client';

import clsx from 'clsx';
import styles from './checkbox.module.scss';
import { InputHTMLAttributes, ReactNode } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  variant?: 'classic' | 'contrast' | 'accent' | 'alternative' | 'brand';
  checkboxSize?: 'sm' | 'md' | 'bg';
  disabled?: boolean;
}

export default function Checkbox({
  label,
  variant = 'classic',
  checkboxSize = 'md',
  disabled = false,
  className,
  ...props
}: CheckboxProps) {
  return (
    <label className={clsx(
      styles.checkboxWrapper,
      styles[checkboxSize],
      { [styles.disabled]: disabled },
      className
    )}>
      <input
        type="checkbox"
        className={clsx(
          styles.checkbox,
          styles[variant]
        )}
        disabled={disabled}
        {...props}
      />
      <span className={styles.checkmark} />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}