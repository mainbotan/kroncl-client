import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import { TabId, tabs } from '../_sections';

interface SwitchBlockProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

export function SwitchBlock({ activeTab, onTabChange }: SwitchBlockProps) {
    return (
        <div className={clsx(styles.block)}>
            <div className={styles.grid}>
                {tabs.map((tab) => (
                    <section 
                        key={tab.id}
                        className={clsx(styles.section, activeTab === tab.id && styles.active)}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.label}
                    </section>
                ))}
            </div>
        </div>
    );
}