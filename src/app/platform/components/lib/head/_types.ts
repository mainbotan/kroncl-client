import { ButtonVariant } from "@/assets/ui-kit/button/button";

export interface PlatformHeadAction {
  label?: string;
  onClick?: () => void;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  icon?: React.ReactNode;
}

export interface PlatformHeadSection {
  label: string;
  value?: string;
  href: string;
  exact?: boolean;
  badge?: number;
  disabled?: boolean;
  strongParams?: boolean;
}

export interface PlatformHeadNote {
  type: 'info' | 'accent' | 'warning';
  title: string;
  description: string;
}

export interface PlatformHeadProps {
  title: string;
  description?: string;
  actions?: PlatformHeadAction[];
  sections?: PlatformHeadSection[];
  currentPath?: string;
  showSearch?: boolean;
  searchProps?: {
    placeholder?: string;
    defaultValue?: string;
    onSearch?: (value: string) => void;
    onInputChange?: (value: string) => void;
    debounceMs?: number;
    searchButton?: boolean;
  };
  notes?: PlatformHeadNote[];
}