'use client';

import { useAuth } from "@/apps/account/auth/context/AuthContext";
import PlatformContent from "../components/content/content";
import { PanelSection } from "../components/panel/_types";
import ClientPanel from "../components/panel/client-panel";
import { useState, useEffect } from 'react';

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const title = "Рабочая область";
  const [initialCollapsed, setInitialCollapsed] = useState(false);
  
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
  ];

  // Читаем localStorage на клиенте
  useEffect(() => {
    const savedState = localStorage.getItem('panel-collapsed');
    if (savedState !== null) {
      setInitialCollapsed(JSON.parse(savedState));
    }
  }, []);

  return (
    <>
      <ClientPanel 
        initialCollapsed={initialCollapsed}
        sections={sections} 
        title={title} 
      />
      <PlatformContent>
        {children}
      </PlatformContent>
    </>
  );
}