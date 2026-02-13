'use client';

import clsx from 'clsx';
import styles from './form.module.scss';
import Input from '@/assets/ui-kit/input/input';
import { 
  PlatformFormSectionProps, 
  PlatformFormInputProps,
  PlatformFormVariantsProps,
  PlatformFormStatusProps,
  PlatformFormUnifyProps,
  PlatformFormBodyProps
} from './_types';
import Button from '@/assets/ui-kit/button/button';


export function PlatformFormBody({
  children,
  className
}: Readonly<PlatformFormBodyProps>) {
  return <div className={clsx(styles.form, className)}>{children}</div>;
}

export function PlatformFormSection({
  title,
  description,
  children,
  className,
  actions
}: Readonly<PlatformFormSectionProps>) {
  return (
    <div className={clsx(styles.section, className)}>
      {(title || actions) && (
        <div className={styles.top}>
            {title && <div className={styles.capture}>{title}</div>}
            {actions && (
              <span className={styles.actions}>
                {actions.map((action, index) => (
                  <Button key={index} className={clsx(styles.action, action.className)} {...action} />
                ))}
              </span>
            )}
        </div>
      )}
      {description && <div className={styles.description}>{description}</div>}
      {children}
    </div>
  );
}

export function PlatformFormInput({
  type = 'text',
  value,
  onChange,
  placeholder,
  maxLength,
  disabled,
  readOnly,
  variant = 'elevated',
  className
}: Readonly<PlatformFormInputProps>) {
  return (
    <Input
      type={type}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} // Исправляем здесь
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      readOnly={readOnly}
      variant={variant}
      className={clsx(styles.input, className)}
    />
  );
}

export function PlatformFormVariants({
  options,
  value,
  onChange,
  disabled,
  className
}: Readonly<PlatformFormVariantsProps>) {
  return (
    <div className={clsx(styles.variants, className)}>
      {options.map((option) => (
        <div
          key={option.value}
          className={clsx(
            styles.item,
            value === option.value && styles.active,
            disabled && styles.disabled
          )}
          data-value={option.value}
          onClick={() => !disabled && !option.disabled && onChange(option.value)}
        >
          <div className={styles.name}>
            {option.icon}
            {option.label}
          </div>
          {option.description && (
            <div className={styles.description}>{option.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function PlatformFormStatus({
  type,
  message,
  icon,
  className
}: Readonly<PlatformFormStatusProps>) {
  return (
    <div className={clsx(styles.status, styles[type], className)}>
      {icon}
      <span className={styles.name}>{message}</span>
    </div>
  );
}

export function PlatformFormUnify({
  children,
  className
}: Readonly<PlatformFormUnifyProps>) {
  return <div className={clsx(styles.unify, className)}>{children}</div>;
}