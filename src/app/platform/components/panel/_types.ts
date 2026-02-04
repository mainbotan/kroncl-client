import { ComponentType } from "react";
import { ButtonVariant } from '@/assets/ui-kit/button/button';

export type IconComponent = ComponentType<{ className?: string }>;

export interface PanelSection {
  name: string;
  href: string;
  icon?: string;
  exact?: boolean;
}

export interface CompanySection {
  name: string;
  href?: string;
  avatar?: string;
  icon?: string;
}

export interface PanelAction {
  label: string;
  variant?: ButtonVariant;
  icon?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}