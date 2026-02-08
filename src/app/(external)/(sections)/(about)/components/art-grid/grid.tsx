'use client';

import { PageBlockProps } from '@/app/(external)/_types';
import styles from './grid.module.scss';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function ArtGrid({className}: PageBlockProps) {
    const [svgContent, setSvgContent] = useState('');

    useEffect(() => {
        fetch('/images/art/grid.svg')
            .then(res => res.text())
            .then(data => {
                const svgWithClass = data.replace(
                    '<svg',
                    '<svg class="art-svg"'
                );
                setSvgContent(svgWithClass);
            });
    }, []);

    if (!svgContent) {
        return <div className={clsx(styles.container, styles.loading, className)} />;
    }

    return (
        <div className={clsx(styles.container, className)}>
            <div dangerouslySetInnerHTML={{ __html: svgContent }} />
        </div>
    );
}