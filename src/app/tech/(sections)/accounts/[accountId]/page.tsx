'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useParams } from "next/navigation";
import styles from './page.module.scss';

export default function Page() {
    const params = useParams();
    const accountId = params.accountId as string;

    return (
        <>
        <PlatformHead
            title={`Аккаунт`}
            description={`${accountId}`}
        />
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.field}>Имя</div>
                <div className={styles.value}>Serafim</div>
            </div>
            <div className={styles.row}>
                <div className={styles.field}>Имя</div>
                <div className={styles.value}>Serafim</div>
            </div>
            <div className={styles.row}>
                <div className={styles.field}>Имя</div>
                <div className={styles.value}>Serafim</div>
            </div>
        </div>
        <div className={styles.u}>
            
        </div>
        </>
    )
}