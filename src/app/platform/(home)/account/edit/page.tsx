'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { PlatformHeadAction } from '@/app/platform/components/lib/head/_types';
import Input from '@/assets/ui-kit/input/input';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus, PlatformFormUnify, PlatformFormVariants } from '@/app/platform/components/lib/form';
import Button from '@/assets/ui-kit/button/button';
import Guard from '@/assets/ui-kit/icons/guard';

export default function Page() {
    return (
        <>
        <PlatformHead
            title="Редактирование аккаунта"
        />
        <PlatformFormBody>
            <section className={styles.actions}>
                <Button
                    variant="accent"
                >
                Сохранить изменения
                </Button>
            </section>
            </PlatformFormBody>
        </>
    )
}