import Button from '@/assets/ui-kit/button/button';
import styles from './slide.module.scss';

export function PromoSlide() {
    return (
        <div className={styles.slide}>
            <div className={styles.focus}>
                <div className={styles.col}>
                    <div className={styles.title}>Увеличьте пенис - <span className={styles.brand}>прямо сейчас.</span></div>
                    <div className={styles.description}>
                        Агрегат прошёл все необходимые проверки на тестовом стенде с нагрузкой и готов к установке на машину.
                        Цена в объявлении указана с учётом обмена на неисправный.
                    </div>
                    <div className={styles.actions}>
                        <Button className={styles.action} variant='empty'>Читать больше</Button>
                        <div className={styles.info}>
                            <div className={styles.capture}>Узнайте больше.</div>
                            <div className={styles.about}>Как мы Kroncl разгоняем?</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}