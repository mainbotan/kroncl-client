'use client'; // Добавляем для использования хуков на клиенте

import { useRouter } from 'next/navigation';
import Arrow from '@/assets/ui-kit/icons/arrow';
import styles from './bar.module.scss';

export function GoHomeBar() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className={styles.container}>
            <div className={styles.focus}>
                <section 
                    className={styles.section} 
                    onClick={handleGoBack}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleGoBack();
                        }
                    }}
                    aria-label="Вернуться назад"
                >
                    <Arrow className={styles.arrow} />
                    Вернуться
                </section>
            </div>
        </div>
    )
}