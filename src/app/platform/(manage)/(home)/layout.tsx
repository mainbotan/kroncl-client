import { useAuth } from "@/apps/account/auth/context/AuthContext";
import PlatformContent from "../../components/content/content";
import { PanelAction, PanelSection } from "../../components/panel/_types";
import ClientPanel from "../../components/panel/client-panel";
import PlatformPanel from "../../components/panel/server-panel";
import AuthGuard from "@/apps/account/auth/components/AuthGuard";
import { PlatformContentWrapper } from "../../components/lib/wrapper/wrapper";
import Plus from "@/assets/ui-kit/icons/plus";
import Package from "@/assets/ui-kit/icons/package";
import Edit from "@/assets/ui-kit/icons/edit";
import Collection from "@/assets/ui-kit/icons/collection";
import { sectionsList } from "./sections.config";
import { actionsList } from "./actions.config";
import { useCompanies } from "@/apps/account/companies/hooks/useCompanies";
import { ScreenProvider } from "../../components/screen-control/provider/provider";
import { ScreenControlWarning } from "../../components/screen-control/warning";

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const title = "Рабочая область";
  
  return (
    <>
      <ScreenProvider>
          <ScreenControlWarning />
          <PlatformPanel 
            actions={actionsList()}
            sections={sectionsList()} 
            title={title}
          />
          <PlatformContent>
            <PlatformContentWrapper>
              <AuthGuard>
                {children}
              </AuthGuard>
            </PlatformContentWrapper>
          </PlatformContent>
      </ScreenProvider>
    </>
  );
}