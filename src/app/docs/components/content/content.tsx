'use client';

import { DocsSidePanel } from '../side-panel/panel';
import { DocsBreadcrumbs } from './breadcrumbs/block';
import styles from './content.module.scss';
import { useRef, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Button from '@/assets/ui-kit/button/button';
import { DocsNavSectionProps } from '../panel/components/nav-section/section';

export interface DocsContentProps {
    className?: string;
    children?: React.ReactNode;
    navigation: DocsNavSectionProps[];
}

// Функция для сбора всех страниц из навигации
const getAllPages = (sections: DocsNavSectionProps[]): { label: string; href: string }[] => {
    const pages: { label: string; href: string }[] = [];
    
    const traverse = (items: DocsNavSectionProps[]) => {
        items.forEach(item => {
            pages.push({ label: item.label, href: item.href });
            if (item.childrens?.length) {
                traverse(item.childrens);
            }
        });
    };
    
    traverse(sections);
    return pages;
};

export function DocsContent({
    className,
    children,
    navigation
}: DocsContentProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const [prevPage, setPrevPage] = useState<{ label: string; href: string } | null>(null);
    const [nextPage, setNextPage] = useState<{ label: string; href: string } | null>(null);

    // Находим текущую и соседние страницы
    useEffect(() => {
        const pages = getAllPages(navigation);
        const currentIndex = pages.findIndex(page => page.href === pathname);
        
        if (currentIndex > 0) {
            setPrevPage(pages[currentIndex - 1]);
        } else {
            setPrevPage(null);
        }
        
        if (currentIndex !== -1 && currentIndex < pages.length - 1) {
            setNextPage(pages[currentIndex + 1]);
        } else {
            setNextPage(null);
        }
    }, [pathname, navigation]);

    // Сброс скролла при смене страницы
    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.scrollTop = 0;
        }
    }, [pathname]);

    return (
        <div className={styles.content}>
            <DocsBreadcrumbs />
            <div ref={canvasRef} className={styles.canvas}>
                <DocsSidePanel 
                    className={styles.navigation} 
                    scrollContainerRef={canvasRef}
                    key={pathname}
                />
                {children}
                
                {(prevPage || nextPage) && (
                    <div className={styles.nextPrev}>
                        {prevPage && (
                            <Button 
                                variant='glass' 
                                as='link' 
                                href={prevPage.href}
                            >
                                Предыдущая
                            </Button>
                        )}
                        
                        <span className={styles.area} />
                        
                        {nextPage && (
                            <Button 
                                variant='accent' 
                                as='link' 
                                href={nextPage.href}
                            >
                                Следующая
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}