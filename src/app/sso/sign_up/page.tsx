import { LogoFull } from '@/assets/ui-kit/logo/full/full';
import styles from '../layout.module.scss';
import { LogoIco } from '@/assets/ui-kit/logo/ico/ico';
import { LogoText } from '@/assets/ui-kit/logo/text/text';
import Input from '@/assets/ui-kit/input/input';
import Button from '@/assets/ui-kit/button/button';
import Link from 'next/link';
import { authLinks } from '@/config/links.config';
import Select from '@/assets/ui-kit/select/select';

export default function Page() {
    return (
        <div className={styles.frame}>
            <div className={styles.head}>
                <LogoIco className={styles.logo} />
                Создать аккаунт
            </div>
            <div className={styles.credentials}>
                <section className={styles.section}>
                    <div className={styles.capture}>Имя / псевдоним</div>
                    <Input className={styles.input} variant='default' />
                </section>
                <section className={styles.section}>
                    <div className={styles.capture}>Кто вы?</div>
                    <Select className={styles.input} />
                </section>
                <section className={styles.section}>
                    <div className={styles.capture}>Почта</div>
                    <Input className={styles.input} variant='default' type='email' />
                </section>
                <section className={styles.split}>
                    <section className={styles.section}>
                        <div className={styles.capture}>Пароль</div>
                        <Input className={styles.input} variant='default' type='password' />
                    </section>
                    <section className={styles.section}>
                        <div className={styles.capture}>Пароль ещё раз</div>
                        <Input className={styles.input} variant='default' type='password' />
                    </section>
                </section>
            </div>
            <div className={styles.actions}>
                <section className={styles.section}>
                    <Button className={styles.action} variant='contrast'>Создать</Button>
                </section>
            </div>
        </div>
    )
}