import { ComponentType } from "react";
import { ButtonProps, ButtonVariant } from '@/assets/ui-kit/button/button';

export type IconComponent = ComponentType<{ className?: string }>;

export interface PanelSection {
  name: string;
  href: string;
  icon?: string;
  exact?: boolean;
}

export type PanelAction = ButtonProps;