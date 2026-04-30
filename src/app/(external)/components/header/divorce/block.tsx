import clsx from 'clsx';
import { NavigationSubItem } from '../navigation.config';
import styles from './block.module.scss';
import Link from 'next/link';
import Button from '@/assets/ui-kit/button/button';
import { authLinks, linksConfig } from '@/config/links.config';
import { LogoFull } from '@/assets/ui-kit/logo/full/full';
import Kanban from '@/assets/ui-kit/icons/kanban';
import Github from '@/assets/ui-kit/logos/github';

export interface DivorceBlockProps {
    className?: string;
    items?: NavigationSubItem[];
}

export function DivorceBlock({
    className,
    items
}: DivorceBlockProps) {
    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.grid}>
                <div className={styles.capture}>Продукт | Платформа</div>
                {items && items.map((subItem, index) => (
                    <Link href={subItem.href} key={index} className={styles.section}>
                        <span className={styles.icon}>{subItem.icon || undefined}</span>
                        <span className={styles.info}>
                            <div className={styles.title}>{subItem.name}</div>
                            <div className={styles.description}>{subItem.description || 'Читать'}</div>
                        </span>
                    </Link>
                ))}
            </div>
            <div className={styles.side}>
                <Link target='_blank' href={linksConfig.developerGithub} className={clsx(styles.block, styles.github)}>
                    <div className={styles.area}>
                        <Github className={styles.logo} />
                        <div className={styles.capture}>Разрабатывайте с нами</div>
                    </div>
                </Link>
                <Link href='/become-partner' className={clsx(styles.block, styles.brand)}>
                    <div className={styles.area}>
                        <LogoFull className={styles.logo} color='#fff' />
                        <div className={styles.capture}>Станьте партнёром</div>
                    </div>
                </Link>
            </div>
            <div className={styles.side2}>
                <div className={styles.slogan}>
                    Лучшие инструменты
                    для <br /><span className={styles.accent}>малого бизнеса.</span>
                </div>
            </div>


            {/* {items && items.map((subItem, index) => (
                <Link href={subItem.href} key={index} className={styles.subItem}>
                    {subItem.icon && (<span className={styles.miniIcon}>{subItem.icon}</span>)}
                    <span className={styles.info}>
                        <div className={styles.capture}>{subItem.name}</div>
                        <div className={styles.description}>{subItem.description || 'Открыть страницу'}</div>
                    </span>
                </Link>
            ))}
            <div className={styles.subAction}>
                <Button href={authLinks.registration} as='link' variant='contrast' className={styles.act}>
                    Начать сейчас
                </Button>
            </div> */}
        </div>
    )
}