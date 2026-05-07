'use client';

import clsx from 'clsx';
import styles from './panel.module.scss';
import { LogoIco } from '@/assets/ui-kit/logo/ico/ico';
import { isSectionActive, NavigationSection } from '@/assets/utils/sections';
import Home from '@/assets/ui-kit/icons/home';
import Package from '@/assets/ui-kit/icons/package';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import Support from '@/assets/ui-kit/icons/support';
import Business from '@/assets/ui-kit/icons/business';
import { sectionsList } from './navigation.config';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { APP_VERSION } from '@/config/version.config';
import { useAdmin } from '@/apps/admin/auth/context/AdminContext';

export interface TechPanelSectionProps extends NavigationSection {
    className?: string;
    title: string;
    icon?: React.ReactNode;
    label?: string | number;
    isActive?: boolean;
    requiredLevel: number;
}

function TechPanelSection({
    title,
    icon,
    className,
    label,
    href,
    isActive = false
}: TechPanelSectionProps) {
    return (
        <Link href={href} className={clsx(styles.item, className, isActive && styles.active)}>
            <div className={styles.icon}>{icon && icon}</div>
            <div className={styles.title}>{title}</div>

            {label && (
                <span className={styles.label}>{label}</span>
            )}
        </Link>
    )
}

export interface TechPanelProps {
    className?: string;
}

export function TechPanel({
    className
}: TechPanelProps) {
    const pathname = usePathname();
    const { adminLevel } = useAdmin();


    return (
        <div className={clsx(styles.container, className)}>
            <Link href='/tech' className={styles.head}>
                <LogoIco className={styles.icon} color='var(--color-text-secondary)' />
                <div className={styles.info}>
                    <div className={styles.title}>tech.</div>
                    <div className={styles.description}>для разработчиков</div>
                </div>
            </Link>
            <div className={styles.sections}>
                <div className={styles.grid}>
                    {sectionsList.map((group, index) => {
                    if (adminLevel < group.requiredLevel) {
                        return
                    }
                    return (
                    <div key={index} className={styles.section}>
                        {group.capture && (<div className={styles.capture}>{group.capture}</div>)}
                        {group.sections.map((section, index) => {
                            if (adminLevel < section.requiredLevel) {
                                return
                            }
                            const isActive = isSectionActive(pathname, {
                                href: section.href,
                                exact: section.exact
                            });
                            return (
                                <TechPanelSection 
                                    key={index}
                                    isActive={isActive}
                                    {...section}
                                />
                            )
                        })}
                    </div>
                    )})}

                    <div className={styles.bottom}>
                        Актуальная сборка клиента платформы <span className={styles.accent}>{APP_VERSION}</span>
                    </div>
                </div>
            </div>
            <div className={styles.bar}>
                Kroncl | {APP_VERSION}
            </div>
        </div>
    )
}