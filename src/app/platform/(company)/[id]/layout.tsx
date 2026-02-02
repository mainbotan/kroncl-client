import AuthGuard from "@/apps/account/auth/components/AuthGuard";
import { PanelSection } from "../../components/panel/_types";
import PlatformPanel from "../../components/panel/server-panel";
import PlatformContent from "../../components/content/content";
import { AccountCompany } from "@/apps/account/companies/types";
import { CompanyProvider } from "@/apps/company/provider";
import { notFound } from "next/navigation";
import { companiesApiSSR } from "@/apps/account/companies/api-ssr";
import { PlatformContentWrapper } from "../../components/lib/wrapper/wrapper";

interface CompanyLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

async function getCompanyData(companyId: string): Promise<AccountCompany | null> {
  return companiesApiSSR.getCompany(companyId);
}

export default async function CompanyLayout({
  children,
  params
}: CompanyLayoutProps) {
  const companyId = params.id;
  
  if (!companyId) {
    notFound();
  }
  
  const company = await getCompanyData(companyId);
  
  if (!company) {
    notFound();
  }
  
  const sections: PanelSection[] = [
    {
      name: 'Сделки',
      href: `/platform/${companyId}/dm`,
      icon: 'deals'
    },
    {
      name: 'Клиенты',
      href: `/platform/${companyId}/crm`,
      icon: 'clients'
    },
    {
      name: 'Финансы',
      href: `/platform/${companyId}/fm`,
      icon: 'wallet'
    },
    {
      name: 'Услуги',
      href: `/platform/${companyId}/sm`,
      icon: 'services'
    },
    {
      name: 'Склад',
      href: `/platform/${companyId}/wm`,
      icon: 'warehouse'
    },
    {
      name: 'Логистика',
      href: `/platform/${companyId}/lm`,
      icon: 'logistic'
    },
    {
      name: 'Сотрудники',
      href: `/platform/${companyId}/hrm`,
      icon: 'team'
    },
    {
      name: 'Доступы',
      href: `/platform/${companyId}/accesses`,
      icon: 'accesses'
    },
    {
      name: 'Активность',
      href: `/platform/${companyId}/activity`,
      icon: 'activity'
    },
    {
      name: 'Хранилище',
      href: `/platform/${companyId}/storage`,
      icon: 'storage'
    },
  ];

  return (
    <>
      <PlatformPanel
        sections={sections} 
        title={company.name} 
      />
      <PlatformContent>
        <PlatformContentWrapper>
          <AuthGuard>
            <CompanyProvider company={company}>
              {children}
            </CompanyProvider>
          </AuthGuard>
        </PlatformContentWrapper>
      </PlatformContent>
    </>
  );
}