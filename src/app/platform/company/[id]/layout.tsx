import { useAuth } from "@/apps/account/auth/context/AuthContext";
import AuthGuard from "@/apps/account/auth/components/AuthGuard";
import { PanelSection } from "../../components/panel/_types";
import PlatformPanel from "../../components/panel/server-panel";
import PlatformContent from "../../components/content/content";

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const title = "Компания";
  const sections: PanelSection[] = [
    {
      name: 'Хранилище',
      href: '/platform/account',
      icon: 'storage'
    },
  ];
  return (
    <>
      <PlatformPanel
        sections={sections} 
        title={title} 
      />
      <PlatformContent>
        <AuthGuard>
          {children}
        </AuthGuard>
      </PlatformContent>
    </>
  );
}