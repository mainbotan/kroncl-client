import clsx from 'clsx';
import Link from 'next/link';
import styles from './pagination.module.scss';
import { PaginationMeta } from '@/apps/shared/pagination/types';

interface PlatformPaginationProps {
    meta: PaginationMeta;
    baseUrl: string;
    queryParams?: Record<string, string | number | boolean>;
    onPageChange?: (page: number) => void;
    className?: string;
}

export function PlatformPagination({
    meta,
    baseUrl,
    queryParams = {},
    onPageChange,
    className
}: PlatformPaginationProps) {
    const { page, pages } = meta;
    
    if (pages <= 1) {
        return null;
    }

    const handlePageChange = (newPage: number) => {
        if (onPageChange) {
            onPageChange(newPage);
        }
    };

    const buildPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams();
        
        // Добавляем параметры пагинации
        params.set('page', pageNumber.toString());
        if (meta.limit) {
            params.set('limit', meta.limit.toString());
        }
        
        // Добавляем остальные query параметры
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.set(key, String(value));
            }
        });
        
        return `${baseUrl}?${params.toString()}`;
    };

    const renderPageNumbers = () => {
        const items = [];
        const maxVisible = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
        let endPage = startPage + maxVisible - 1;
        
        if (endPage > pages) {
            endPage = pages;
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        // Первая страница
        if (startPage > 1) {
            items.push(
                <Link
                    key={1}
                    href={buildPageUrl(1)}
                    className={clsx(styles.page, page === 1 && styles.active)}
                    onClick={() => handlePageChange(1)}
                >
                    1
                </Link>
            );
            
            if (startPage > 2) {
                items.push(<span key="dots1" className={styles.dots}>...</span>);
            }
        }
        
        // Страницы
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Link
                    key={i}
                    href={buildPageUrl(i)}
                    className={clsx(styles.page, page === i && styles.active)}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Link>
            );
        }
        
        // Последняя страница
        if (endPage < pages) {
            if (endPage < pages - 1) {
                items.push(<span key="dots2" className={styles.dots}>...</span>);
            }
            
            items.push(
                <Link
                    key={pages}
                    href={buildPageUrl(pages)}
                    className={clsx(styles.page, page === pages && styles.active)}
                    onClick={() => handlePageChange(pages)}
                >
                    {pages}
                </Link>
            );
        }
        
        return items;
    };

    return (
        <div className={clsx(styles.pagination, className)}>
            <Link
                href={buildPageUrl(Math.max(1, page - 1))}
                className={clsx(styles.section, page === 1 && styles.disabled)}
                onClick={(e) => {
                    if (page === 1) {
                        e.preventDefault();
                        return;
                    }
                    handlePageChange(page - 1);
                }}
            >
                Предыдущая
            </Link>
            
            <div className={styles.pages}>
                {renderPageNumbers()}
            </div>
            
            <Link
                href={buildPageUrl(Math.min(pages, page + 1))}
                className={clsx(styles.section, page === pages && styles.disabled)}
                onClick={(e) => {
                    if (page === pages) {
                        e.preventDefault();
                        return;
                    }
                    handlePageChange(page + 1);
                }}
            >
                Следующая
            </Link>
        </div>
    );
}