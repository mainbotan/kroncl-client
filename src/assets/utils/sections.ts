export interface NavigationSection {
  href: string;
  exact?: boolean;
  slug?: string;
  strongParams?: boolean;
}

export interface ExtendedNavigationSection extends NavigationSection {
  guideAbout?: string;
  guideIcon?: string;
  guideId?: string;
  guidePriority?: string;
  guidePosition?: string;
}

export const isSectionActive = (currentUrl: string, section: NavigationSection): boolean => {
  if (!currentUrl || !section?.href) return false;
  
  // Разделяем на путь и query параметры
  const [sectionPath, sectionQuery] = section.href.split('?');
  const [currentPath, currentQuery] = currentUrl.split('?');
  
  // Проверяем точное совпадение пути (если exact: true)
  if (section.exact) {
    const pathsMatch = currentPath === sectionPath;
    
    // Если exact И strongParams - проверяем всё строго
    if (section.strongParams) {
      if (!pathsMatch) return false;
      
      // Проверяем query параметры
      if (sectionQuery) {
        if (!currentQuery) return false;
        
        const sectionParams = new URLSearchParams(sectionQuery);
        const currentParams = new URLSearchParams(currentQuery);
        
        // ВСЕ параметры секции должны быть в текущем URL с теми же значениями
        // ИГНОРИРУЕМ параметры limit и page
        for (const [key, sectionValue] of sectionParams.entries()) {
          if (key === 'limit' || key === 'page' || key === 'start_date' || key === 'end_date') continue;
          if (currentParams.get(key) !== sectionValue) {
            return false;
          }
        }
        return true;
      }
      
      // Если у секции нет query параметров, а у текущего URL есть - не совпадает
      // Но если в текущем URL только limit/page - игнорируем
      if (currentQuery) {
        const currentParams = new URLSearchParams(currentQuery);
        const hasNonPaginationParams = Array.from(currentParams.keys())
          .some(key => key !== 'limit' && key !== 'page');
        return !hasNonPaginationParams;
      }
      return true;
    }
    
    // Только exact без strongParams - только путь
    return pathsMatch;
  }
  
  // Не exact - проверяем путь как префикс
  const isSamePath = currentPath === sectionPath;
  const isSubPath = currentPath.startsWith(sectionPath + '/');
  
  if (!isSamePath && !isSubPath) {
    return false;
  }
  
  // Если strongParams === false/null - игнорируем параметры
  if (section.strongParams === false || section.strongParams === null) {
    return true;
  }
  
  // Проверяем query параметры (если strongParams: true или undefined)
  if (sectionQuery) {
    if (!currentQuery) return false;
    
    const sectionParams = new URLSearchParams(sectionQuery);
    const currentParams = new URLSearchParams(currentQuery);
    
    // ИГНОРИРУЕМ параметры limit и page при сравнении
    for (const [key, sectionValue] of sectionParams.entries()) {
      if (key === 'limit' || key === 'page') continue;
      if (currentParams.get(key) !== sectionValue) {
        return false;
      }
    }
    return true;
  }
  
  return true;
};