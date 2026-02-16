import { QuickLinksBlock } from '@/app/(external)/components/quick-links/quick-links';
import styles from './page.module.scss';
import { ForPartnersBlock } from './slides/for-partners/block';
import { StartBlock } from './slides/start/block';
import { TariffsBlock } from './slides/tariffs/block';
import { linksList } from './_links';

export default function Page() {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <StartBlock className={styles.block} />
                {/* <ForPartnersBlock className={styles.block} /> */}
                <TariffsBlock className={styles.block} />
                <QuickLinksBlock links={linksList} className={styles.block} />
            </div>
        </div>
    )
}