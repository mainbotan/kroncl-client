import { cookies } from 'next/headers';
import { PanelAction, PanelSection } from './_types';
import ClientPanel from './client-panel';
import React from 'react';
import { AccountCompany } from '@/apps/account/companies/types';

interface ServerPanelProps {
  className?: string;
  title?: string;
  sections?: PanelSection[];
  companies?: AccountCompany[];
  actions?: PanelAction[];
  children?: React.ReactNode;
  head?: React.ReactNode;
}

export default async function PlatformPanel({
  className,
  title = 'Ваш аккаунт',
  sections = [],
  companies = [],
  actions = [],
  children = '',
  head
}: ServerPanelProps) {
  const cookieStore = await cookies();
  const initialCollapsed = cookieStore.get('panel-collapsed')?.value === 'true';
  
  const transformedSections: PanelSection[] = sections.map(section => ({
    ...section
  }));

  return (
    <ClientPanel
      initialCollapsed={initialCollapsed}
      className={className}
      title={title}
      sections={transformedSections}
      companies={companies}
      actions={actions}
      children={children}
      head={head}
    />
  );
}