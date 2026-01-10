export interface NavigationSection {
  href: string;
  exact?: boolean;
  slug?: string;
}

export interface ExtendedNavigationSection extends NavigationSection {
  guideAbout?: string;
  guideIcon?: string;
  guideId?: string;
  guidePriority?: string;
  guidePosition?: string;
}

export const isSectionActive = (pathname: string, section: NavigationSection): boolean => {
  if (!pathname || !section?.href) return false;
  
  if (section.exact) {
    return pathname === section.href;
  }
  
  // Для вложенных путей проверяем начало пути
  return pathname.startsWith(`${section.href}/`) || pathname === section.href;
};