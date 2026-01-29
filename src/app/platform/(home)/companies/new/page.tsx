import Input from '@/assets/ui-kit/input/input';
import styles from './page.module.scss';
import Select from '@/assets/ui-kit/select/select';
import Button from '@/assets/ui-kit/button/button';

export default function Page() {
    const visibleTypes = [
        { value: 'public', label: 'Публичная' },
        { value: 'private', label: 'Приватная' },
    ]
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                Создание компании
            </div>
            <div className={styles.description}>Создание пространства учётной системы для новой компании.</div>
            <div className={styles.body}>
                <div className={styles.section}>
                    <div className={styles.capture}>Название компании</div>
                    <div className={styles.unify}>
                        <Input className={styles.input} variant='elevated' />
                        <Input className={styles.input} variant='elevated' readOnly/>
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.capture}>Тип</div>

                </div>
                <section className={styles.actions}>
                    <Button className={styles.action} variant='contrast'>Создать компанию</Button>
                </section>
            </div>
        </div>
    )
}