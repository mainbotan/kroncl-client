'use client';

import clsx from 'clsx';
import styles from './panel.module.scss';
import { useEffect, useState, useCallback, RefObject } from 'react';
import { usePathname } from 'next/navigation';

export interface DocsSidePanelProps {
    className?: string;
    scrollContainerRef?: RefObject<HTMLElement | null>;
}

export function DocsSidePanel({
    className,
    scrollContainerRef,
}: DocsSidePanelProps) {
    const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const pathname = usePathname();

    // Функция для генерации ID из текста заголовка
    const generateId = (text: string): string => {
        return text
            .toLowerCase()
            .replace(/[^a-zа-яё0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    // Сбор заголовков при загрузке страницы и при смене pathname
    useEffect(() => {
        // Даём время на рендер контента
        const timeout = setTimeout(() => {
            const elements = Array.from(document.querySelectorAll('h1, h2, h3'));
            
            const items = elements.map((el) => {
                const text = el.textContent || '';
                const id = generateId(text);
                
                if (!el.id) {
                    el.id = id;
                }
                
                return {
                    id: el.id,
                    text: text
                };
            });

            setHeadings(items);
            setActiveId(''); // Сбрасываем активный заголовок
        }, 100);

        return () => clearTimeout(timeout);
    }, [pathname]); // Перезапускаем при смене пути

    // Отслеживание активного заголовка при скролле
    useEffect(() => {
        if (!scrollContainerRef?.current) return;

        const container = scrollContainerRef.current;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                root: container,
                rootMargin: '0px 0px -70% 0px',
                threshold: 0,
            }
        );

        document.querySelectorAll('h1, h2, h3').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, [pathname, scrollContainerRef]); // Перезапускаем при смене страницы

    // Плавный скролл к заголовку внутри контейнера
    const scrollToHeading = useCallback((id: string) => {
        const element = document.getElementById(id);
        const container = scrollContainerRef?.current;
        
        if (element && container) {
            const offset = 80;
            const elementPosition = element.offsetTop;
            container.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth',
            });
        }
    }, [scrollContainerRef]);

    if (headings.length === 0) {
        return null;
    }

    return (
        <div className={clsx(styles.panel, className)}>
            <div className={styles.capture}>На этой странице</div>
            <div className={styles.grid}>
                {headings.map((heading) => (
                    <div
                        key={heading.id}
                        className={clsx(
                            styles.section,
                            activeId === heading.id && styles.active
                        )}
                        onClick={() => scrollToHeading(heading.id)}
                    >
                        {heading.text}
                    </div>
                ))}
            </div>
        </div>
    );
}