import clsx from 'clsx';
import styles from './quick-links.module.scss';
import { PageBlockProps } from '@/app/(external)/_types';
import Link from 'next/link';

export interface QuickLink {
    capture: string;
    description?: string;
    href: string;
}

export interface QuickLinksProps extends PageBlockProps {
    title?: string;
    links: QuickLink[];
}

export function QuickLinksBlock({
    title = 'Может быть полезно',
    links,
    className
}: QuickLinksProps) {
    return (
        <div className={clsx(styles.block)}>
            <div className={clsx(styles.capture, className)}>{title}</div>
            {links.map((link, index) => (
                <Link key={index} href={link.href} className={clsx(styles.link, className)}>{link.capture}</Link>
            ))}
        </div>
    )
}