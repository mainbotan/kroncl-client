import { ComponentType } from "react";

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