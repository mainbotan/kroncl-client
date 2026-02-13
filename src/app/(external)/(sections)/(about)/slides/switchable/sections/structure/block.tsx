import { thesesList } from './_theses';
import styles from './block.module.scss';
import { ThesisBlock } from './thesis/block';

export function StructureBlock() {
    return (
        <div className={styles.theses}>
            {thesesList.map((thesis, index) => (
                <ThesisBlock className={styles.block} key={index} {...thesis} />
            ))}
        </div>
    )
}