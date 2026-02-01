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
  
  // Разделяем путь и query параметры
  const [sectionPath, sectionQuery] = section.href.split('?');
  const [currentPath, currentQuery] = pathname.split('?');
  
  // Сравниваем пути
  const pathMatches = currentPath.startsWith(`${sectionPath}/`) || currentPath === sectionPath;
  
  if (!pathMatches) return false;
  
  // Если в секции есть query параметры, сравниваем их
  if (sectionQuery) {
    if (!currentQuery) return false;
    
    const sectionParams = new URLSearchParams(sectionQuery);
    const currentParams = new URLSearchParams(currentQuery);
    
    // Проверяем, что все параметры секции присутствуют в текущем URL
    for (const [key, value] of sectionParams.entries()) {
      if (currentParams.get(key) !== value) {
        return false;
      }
    }
  }
  
  return true;
};