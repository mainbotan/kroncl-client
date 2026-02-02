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