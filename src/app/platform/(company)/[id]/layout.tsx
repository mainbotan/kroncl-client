import AuthGuard from "@/apps/account/auth/components/AuthGuard";
import { PanelAction, PanelSection } from "../../components/panel/_types";
import PlatformPanel from "../../components/panel/server-panel";
import PlatformContent from "../../components/content/content";
import { AccountCompany } from "@/apps/account/companies/types";
import { CompanyProvider } from "@/apps/company/provider";
import { notFound } from "next/navigation";
import { companiesApiSSR } from "@/apps/account/companies/api-ssr";
import { PlatformContentWrapper } from "../../components/lib/wrapper/wrapper";
import { CompanyStorageWidget } from "./storage/widget/widget";
import { ModalPageProvider } from "../../components/lib/modal-page/context";
import { PlatformModalPage } from "../../components/lib/modal-page/modal";
import { PlatformSideContent } from "../../components/side-content/content";
import { SideContentProvider } from "../../components/side-content/context";
import { PlatformHead } from "../../components/lib/head/head";
import { PlatformCompanyPanelHead } from "./components/panel-head/head";

export interface CompanyLayoutProps extends CompanyParams {
  children: React.ReactNode;
}
export type CompanyParams = {
  params: {
    id: string;
  }
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
      name: 'Каталог',
      href: `/platform/${companyId}/wm`,
      icon: 'catalog'
    },
    {
      name: 'Сотрудники',
      href: `/platform/${companyId}/hrm`,
      icon: 'team'
    },
    {
      name: 'Файлы',
      href: `/platform/${companyId}/files`,
      icon: 'files'
    },
    {
      name: 'Ресурсы бренда',
      href: `/platform/${companyId}/branding`,
      icon: 'branding'
    },
    {
      name: 'Активность',
      href: `/platform/${companyId}/activity`,
      icon: 'activity'
    },
    {
      name: 'Доступы',
      href: `/platform/${companyId}/accesses`,
      icon: 'accesses'
    },
    {
      name: 'Хранилище',
      href: `/platform/${companyId}/storage`,
      icon: 'storage'
    },
    {
      name: 'Поддержка',
      href: `/platform/${companyId}/support`,
      icon: 'support'
    },
  ];

  const storageWidget = <CompanyStorageWidget />;

  const actions: PanelAction[] = [
    {
      children: "Новая сделка",
      href: `/platform/${companyId}/dm/new`,
      variant: 'accent',
      as: 'link'
    }
  ];

  return (
    <>
      <SideContentProvider>
        <PlatformPanel
          sections={sections} 
          title={company.name} 
          children={storageWidget}
          actions={actions}
          // head={<PlatformCompanyPanelHead />}
        />

        <PlatformContent>
          <PlatformContentWrapper>
            <AuthGuard>
              <CompanyProvider company={company}>
                <ModalPageProvider> {/** not used yet */}
                    {children}
                  <PlatformModalPage />
                </ModalPageProvider>
              </CompanyProvider>
            </AuthGuard>
          </PlatformContentWrapper>
        </PlatformContent>
        
        <PlatformSideContent />

      </SideContentProvider>
    </>
  );
}