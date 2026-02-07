import { ReactNode } from 'react';

export type MessageVariant = 'default' | 'error' | 'success' | 'warning';

export interface MessageConfig {
  id: string;
  label: string;
  icon?: ReactNode;
  about?: string;
  variant?: MessageVariant;
  duration?: number;
  showTimer?: boolean;
  onClose?: () => void;
}

export interface MessageContextType {
  showMessage: (config: Omit<MessageConfig, 'id'>) => void;
  hideMessage: (id: string) => void;
  clearMessages: () => void;
}