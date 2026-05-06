'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { useParams } from 'next/navigation';
import Textarea from '@/assets/ui-kit/textarea/textarea';
import Send from '@/assets/ui-kit/icons/send';
import { Tooltip } from 'recharts';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import clsx from 'clsx';
import Link from 'next/link';
import Upload from '@/assets/ui-kit/icons/upload';
import Arrow from '@/assets/ui-kit/icons/arrow';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import Button from '@/assets/ui-kit/button/button';

export interface MessageProps {
    className?: string;
    isAnswer?: boolean;
}

export function Message({
    className,
    isAnswer = false
}: MessageProps) {
    return (
        <div className={clsx(styles.message, isAnswer && styles.answer, className)}>
            <div className={styles.text}>
                Сегодня я хочу рассказать про то, как гетеросексуальный бэкендер (до этого момента коим я себя в той или иной степени считал) переживает болезненный опыт построения клиентской части платформы. Ради интереса недавно я посмотрел, сколько примерно строк на данный момент насчитывает репозиторий фронтенда Kroncl (название платформы), и приятно удивился числу 70.
            </div>
            <div className={styles.meta}>
                Отправлено 6 мая, 2026 в 7:46 | <Link href={`/tech/accounts/0x`} className={styles.accent}>Serafim</Link>
            </div>
        </div>   
    )
}

export default function Page() {
    const params = useParams();
    const ticketId = params.ticketId as string;

    return (
        <>
        <div className={styles.container}>
            <PlatformHead 
                title={`Тикет #${ticketId}`}
                description={`Создан 5 мая, 2026 - Взят в обработку.`}
                actions={[
                    {
                        children: 'Отказаться',
                        variant: 'glass'
                    },
                    {
                        children: 'Закрыть тикет',
                        variant: 'light'
                    }
                ]}
            />
            <div className={styles.dialog}>
                <div className={styles.grid}>
                    <Message />
                    <Message isAnswer={true} />
                    <Message />
                    <Message />
                    <Message isAnswer={true} />
                    <Message />
                </div>
            </div>
            <div className={styles.dialogActions}>
                <ModalTooltip content='Обновить диалог'>
                    <button 
                        children={<Upload />}
                        // children={<Spinner variant='accent' />}
                        className={clsx(styles.action)} />
                </ModalTooltip>
                <ModalTooltip content='Промотать вниз'>
                    <button 
                        children={<Arrow />}
                        className={clsx(styles.action, styles.rotated)} />
                </ModalTooltip>
            </div>
            
            {/* если тикент принят другим */}
            <div className={styles.textablePlug}>
                <div className={styles.info}>
                    <div className={styles.capture}>Тикет обрабатывается другим админом</div>
                    <div className={styles.description}>
                        Отправка сообщений в диалог доступна только ответственному за тикет админу. 
                        Если он сбросит тикет - вы сможете его перенять.
                    </div>
                </div>
            </div>

            {/* если тикент ещё никем не принят */}
            {/* <div className={styles.textablePlug}>
                <div className={styles.info}>
                    <div className={styles.capture}>Принять тикет</div>
                    <div className={styles.description}>
                        Для отправки сообщений в диалог примите тикет в обработку
                    </div>
                </div>
                <div className={styles.actions}>
                    <Button
                        className={styles.action}
                        variant='accent'
                        children='Принять тикет'
                    />
                </div>
            </div> */}

            {/* если текущий аккаунт принял тикет */}
            {/* <div className={styles.textable}>
                <Textarea
                    fullWidth
                    placeholder='Ответ клиенту'
                    className={styles.textarea}
                />
                <ModalTooltip content='Отправить ответ на тикет'>
                    <button
                        className={styles.send}
                    >
                        <Send className={styles.svg} />
                    </button>
                </ModalTooltip>
            </div> */}
        </div>
        </>
    )
}