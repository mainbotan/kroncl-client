import AuthGuard from "@/apps/account/auth/components/AuthGuard";
import { PanelAction, PanelSection } from "../../components/panel/_types";
import PlatformPanel from "../../components/panel/server-panel";
import PlatformContent from "../../components/content/content";
import { AccountCompany } from "@/apps/account/companies/types";
import { CompanyProvider, useCompany } from "@/apps/company/provider";
import { notFound } from "next/navigation";
import { companiesApiSSR } from "@/apps/account/companies/api-ssr";
import { PlatformContentWrapper } from "../../components/lib/wrapper/wrapper";
import { StorageWidget } from "./storage/widgets/storage-widget/widget";
import { ModalPageProvider } from "../../components/lib/modal-page/context";
import { PlatformModalPage } from "../../components/lib/modal-page/modal";
import { PlatformSideContent } from "../../components/side-content/content";
import { SideContentProvider } from "../../components/side-content/context";
import { PlatformHead } from "../../components/lib/head/head";
import { PlatformCompanyPanelHead } from "./components/panel-head/head";
import { PLAN_MAX_LVL, sections } from "./components/injected-panel/sections.config";
import ClientPanel from "../../components/panel/client-panel";
import { PlatformInjectedPanel } from "./components/injected-panel/panel";

export interface CompanyLayoutProps extends CompanyParams {
  children: React.ReactNode;
}
export type CompanyParams = {
  params: {
    id: string;
  }
}

export async function getCompanyData(companyId: string): Promise<AccountCompany | null> {
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

  return (
    <>
      <SideContentProvider>
        <CompanyProvider company={company}>
          
          <PlatformInjectedPanel />

          <PlatformContent>
            <PlatformContentWrapper>
              <AuthGuard>
                  <ModalPageProvider> {/** not used yet */}
                      {children}
                    <PlatformModalPage />
                  </ModalPageProvider>
              </AuthGuard>
            </PlatformContentWrapper>
          </PlatformContent>

          <PlatformSideContent />

        </CompanyProvider>

      </SideContentProvider>
    </>
  );
}