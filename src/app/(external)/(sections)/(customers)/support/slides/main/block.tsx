import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import { SectionCard } from './section/section';
import { sectionsList } from './_sections';

export function MainBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            <div className={styles.grid}>
                {sectionsList.map((section, index) => (
                    <SectionCard key={index} {...section} />
                ))}
            </div>
        </div>
    )
}