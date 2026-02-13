import { ButtonProps } from "@/assets/ui-kit/button/button";
import { InputVariant } from "@/assets/ui-kit/input/input";
import { ReactNode } from "react";

export interface PlatformFormBodyProps {
  className?: string;
  children: ReactNode;
}

export interface PlatformFormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ButtonProps[];
}

export interface PlatformFormInputProps {
  type?: 'text' | 'password' | 'email' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  variant?: InputVariant;
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