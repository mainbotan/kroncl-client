// components/lib/wrapper/dynamic-wrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import { PlatformContentWrapper } from './wrapper';

const routeConfig = {
  '/support': { padding: false },
} as const;

function matchesRoute(pathname: string, route: string): boolean {
    // Проверяем, содержит ли путь сегмент /support
    // Разбиваем путь на сегменты и ищем support
    const segments = pathname.split('/');
    return segments.includes(route.replace('/', ''));
}

function getRouteSettings(pathname: string) {
  // Для отладки - посмотрим что приходит
  console.log('Current pathname:', pathname);
  
  for (const [route, settings] of Object.entries(routeConfig)) {
    if (matchesRoute(pathname, route)) {
      console.log('Matched route:', route);
      return settings;
    }
  }
  return { padding: true };
}

export function PlatformDynamicContentWrapper({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const settings = getRouteSettings(pathname || '');
  
  console.log('Settings padding:', settings.padding);
  
  return (
    <PlatformContentWrapper padding={settings.padding}>
      {children}
    </PlatformContentWrapper>
  );
}