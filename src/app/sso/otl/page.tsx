'use client';

import { LogoFull } from '@/assets/ui-kit/logo/full/full';
import styles from '../layout.module.scss';
import { LogoIco } from '@/assets/ui-kit/logo/ico/ico';
import { LogoText } from '@/assets/ui-kit/logo/text/text';
import Input from '@/assets/ui-kit/input/input';
import Button from '@/assets/ui-kit/button/button';
import Link from 'next/link';
import { authLinks } from '@/config/links.config';
import Select from '@/assets/ui-kit/select/select';
import { Warning } from '../components/warning/warning';
import Keyhole from '@/assets/ui-kit/icons/keyhole';

export default function Page() {
    return (
        <div className={styles.frame}>
            <div className={styles.head}>
                <Keyhole style={{width: "1em", height: "1em", color: "var(--color-icon-primary)"}}/>
                Вход по ключу
            </div>
            <div className={styles.credentials}>
                <section className={styles.section}>
                    <div className={styles.capture}>Приватный ключ</div>
                    <Input className={styles.input} variant='default' type='email' />
                </section>
            </div>
            <Warning />
            <div className={styles.actions}>
                <section className={styles.section}>
                    <Button className={styles.action} variant='contrast'>Войти</Button>
                </section>
            </div>
        </div>
    )
}