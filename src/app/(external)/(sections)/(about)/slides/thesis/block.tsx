import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';

export function ThesisBlock({className}: PageBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            <div className={styles.capture}>
                Облачное хранение
            </div>
            <div className={styles.description}>
                Джон Майкл «О́ззи» О́сборн — английский рок-певец, музыкант. В 1968 году он стал одним из основателей новаторской хеви-метал-группы Black Sabbath, где приобрёл прозвище «Принц тьмы».
            </div>
        </div>
    )
}