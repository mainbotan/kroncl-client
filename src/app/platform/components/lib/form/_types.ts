import { ReactNode } from "react";

export interface PlatformFormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export interface PlatformFormInputProps {
  type?: 'text' | 'password' | 'email' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  variant?: 'elevated' | 'empty';
  className?: string;
}

export interface PlatformFormVariantOption {
  value: string;
  label: ReactNode;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface PlatformFormVariantsProps {
  options: PlatformFormVariantOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export interface PlatformFormStatusProps {
  type: 'error' | 'success' | 'info';
  message: string;
  icon?: ReactNode;
  className?: string;
}

export interface PlatformFormUnifyProps {
  children: ReactNode;
  className?: string;
}