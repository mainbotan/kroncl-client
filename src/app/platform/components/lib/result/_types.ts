export interface Action {
  label: string;
  href: string;
  variant?: 'default' | 'contrast';
  onClick?: () => void;
}

export interface PlatformResultProps {
  title: string;
  description: string;
  actions?: Action[];
  redirect?: {
    href: string;
    delay?: number; // ms
    label?: string;
  };
  className?: string;
  status?: 'success' | 'error';
  showIcon?: boolean;
}