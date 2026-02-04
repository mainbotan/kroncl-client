import { cookies } from 'next/headers';
import { CompanySection, PanelAction, PanelSection } from './_types';
import ClientPanel from './client-panel';

interface ServerPanelProps {
  className?: string;
  title?: string;
  sections?: PanelSection[];
  companies?: CompanySection[];
  actions?: PanelAction[];
  children?: React.ReactNode;
}

export default async function PlatformPanel({
  className,
  title = 'Ваш аккаунт',
  sections = [],
  companies = [],
  actions = [],
  children = ''
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
    />
  );
}