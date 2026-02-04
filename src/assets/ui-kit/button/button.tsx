'use client';

import clsx from 'clsx';
import styles from './button.module.scss';
import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import Spinner from '../spinner/spinner';
import Link, { LinkProps } from 'next/link';

export type ButtonVariant = 'default' | 'leader' | 'light' | 'contrast' | 'elevated' | 'empty' | 'glass' | 'brand' | 'accent';

interface CommonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
  disabled?: boolean;
}

type ButtonProps = CommonProps & (
  | ({ as?: 'button' } & ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ as: 'a' } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ as: 'link' } & LinkProps)
);

export default function Button({
  children,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  loading = false,
  className,
  disabled = false,
  as = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const commonClasses = clsx(
    styles.button,
    {
      [styles.default]: variant === 'default',
      [styles.leader]: variant === 'leader',
      [styles.contrast]: variant === 'contrast',
      [styles.light]: variant === 'light',
      [styles.elevated]: variant === 'elevated',
      [styles.empty]: variant === 'empty',
      [styles.glass]: variant === 'glass',
      [styles.brand]: variant === 'brand',
      [styles.accent]: variant === 'accent',
      [styles.fullWidth]: fullWidth,
      [styles.sm]: size === 'sm',
      [styles.lg]: size === 'lg',
      [styles.loading]: loading,
      [styles.disabled]: disabled
    },
    className
  );

  if (as === 'a') {
    const { href, target, rel, ...rest } = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={commonClasses}
        {...rest}
      >
        {loading ? (
          <div className={styles.loadingContent}>
            <Spinner size="sm" />
            <span>{children}</span>
          </div>
        ) : (
          children
        )}
      </a>
    );
  }

  if (as === 'link') {
    const { href, ...rest } = props as LinkProps;
    return (
      <Link
        href={href}
        className={commonClasses}
        {...rest}
      >
        {loading ? (
          <div className={styles.loadingContent}>
            <Spinner size="sm" />
            <span>{children}</span>
          </div>
        ) : (
          children
        )}
      </Link>
    );
  }

  // По умолчанию рендерим button
  return (
    <button
      className={commonClasses}
      disabled={isDisabled}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {loading ? (
        <div className={styles.loadingContent}>
          <Spinner size="sm" />
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}