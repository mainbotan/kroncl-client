import { LogoFull } from '@/assets/ui-kit/logo/full/full';
import styles from './page.module.scss';
import { LogoIco } from '@/assets/ui-kit/logo/ico/ico';
import { LogoText } from '@/assets/ui-kit/logo/text/text';
import Input from '@/assets/ui-kit/input/input';
import Button from '@/assets/ui-kit/button/button';
import Link from 'next/link';
import { authLinks } from '@/config/links.config';

export default function Page() {
    return (
        <div className={styles.container}>
            <div className={styles.line}>Вход в аккаунт</div>
            <div className={styles.frame}>
                <div className={styles.head}>
                    <LogoIco animate />
                </div>
                <div className={styles.block}>
                    <div className={styles.hello}>
                        <span className={styles.brand}>Рады видеть</span> вас снова.
                    </div>
                    <div className={styles.credentials}>
                        <div className={styles.section}>
                            <div className={styles.name}>Почта</div>
                            <Input className={styles.input} variant='glass' fullWidth />
                        </div>
                        <div className={styles.section}>
                            <div className={styles.name}>Пароль</div>
                            <Input className={styles.input} variant='glass' fullWidth type='password' />
                        </div>
                        <Link href='/platform'><Button className={styles.submit} variant='contrast' fullWidth>Войти</Button></Link>
                        <Link href={authLinks.registration}><Button className={styles.submit} variant='accent' fullWidth>Создать аккаунт</Button></Link>
                    </div>
                </div>
                <div className={styles.afterword}>
                    Совершая любые действия с аккаунтом <span className={styles.brand}>Kroncl</span>, вы принимаете <span className={styles.accent}>политику конфиденциальности.</span>
                </div>
            </div>
        </div>
    )
}