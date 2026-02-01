export interface PlatformHeadAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'contrast' | 'accent';
  className?: string;
}

export interface PlatformHeadSection {
  label: string;
  value: string;
  href?: string;
  exact?: boolean;
  badge?: number;
  disabled?: boolean;
}

export interface PlatformHeadProps {
  title: string;
  description?: string;
  actions?: PlatformHeadAction[];
  sections?: PlatformHeadSection[];
  currentPath?: string;
  showSearch?: boolean;
  notes?: Array<{
    type: 'info' | 'accent' | 'warning';
    title: string;
    description: string;
  }>;
}