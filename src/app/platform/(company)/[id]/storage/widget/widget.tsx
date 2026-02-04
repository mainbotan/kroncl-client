'use client';

import styles from './widget.module.scss';

export function CompanyStorageWidget() {
    return (
        <div className={styles.widget}>
            <div className={styles.line}><span /></div>
            <div className={styles.text}>
                Использовано 115КБ/1ГБ хранилища
            </div>
        </div>
    )
}