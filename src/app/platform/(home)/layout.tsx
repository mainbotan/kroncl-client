import { useAuth } from "@/apps/account/auth/context/AuthContext";
import PlatformContent from "../components/content/content";
import { PanelSection } from "../components/panel/_types";
import ClientPanel from "../components/panel/client-panel";
import PlatformPanel from "../components/panel/server-panel";
import AuthGuard from "@/apps/account/auth/components/AuthGuard";
import { PlatformContentWrapper } from "../components/lib/wrapper/wrapper";

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const title = "Рабочая область";
  const sections: PanelSection[] = [
    {
      name: 'Аккаунт',
      href: '/platform/account',
      icon: 'account'
    },
    {
      name: 'Организации',
      href: '/platform/companies',
      icon: 'collection'
    },
    {
      name: 'Безопасность',
      href: '/platform/security',
      icon: 'keyhole'
    },
    {
      name: 'Активность',
      href: '/platform/activity',
      icon: 'history'
    },
  ];
  return (
    <>
      <PlatformPanel 
        sections={sections} 
        title={title} 
      />
      <PlatformContent>
        <PlatformContentWrapper>
          <AuthGuard>
            {children}
          </AuthGuard>
        </PlatformContentWrapper>
      </PlatformContent>
    </>
  );
}