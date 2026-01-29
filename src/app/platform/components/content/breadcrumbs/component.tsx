'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getBreadcrumbName, getBreadcrumbPath } from './dictionary';
import styles from './styles.module.scss';

export function Breadcrumbs() {
    const pathname = usePathname();
    
    const pathWithoutPlatform = pathname.replace(/^\/platform\/?/, '');

    const segments = pathWithoutPlatform.split('/').filter(segment => segment.length > 0);
    
    if (segments.length === 0) {
        return (
            <div className={styles.breadcrumbs}>
                <div className={styles.grid}>
                    <Link href='/platform' className={styles.point}>Платформа</Link>
                </div>
            </div>
        );
    }
    
    // Собираем массив элементов
    const elements: JSX.Element[] = [];
    
    // Всегда добавляем "Платформа"
    elements.push(
        <Link key="platform" href='/platform' className={styles.point}>Платформа</Link>
    );
    elements.push(<span key="sep-platform" className={styles.inter}>/</span>);
    
    segments.forEach((segment, index) => {
        const isLast = index === segments.length - 1;
        const name = getBreadcrumbName(segment);
        
        if (isLast) {
            elements.push(
                <span key={`item-${index}`} className={styles.point}>
                    {name}
                </span>
            );
        } else {
            elements.push(
                <Link 
                    key={`link-${index}`} 
                    href={getBreadcrumbPath(segments, index + 1)} 
                    className={styles.point}
                >
                    {name}
                </Link>
            );
            elements.push(
                <span key={`sep-${index}`} className={styles.inter}>/</span>
            );
        }
    });
    
    return (
        <div className={styles.breadcrumbs}>
            <div className={styles.grid}>
                {elements}
            </div>
        </div>
    );
}