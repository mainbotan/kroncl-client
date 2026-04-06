import { Partner } from "./block";
import styles from './block.module.scss';
import { AltcorLogo } from "./components/altcor";
import { EasyServiceLogo } from "./components/easy-service";

export const partnersList: Partner[] = [
    {
        name: 'Altcor',
        logo: <AltcorLogo className={styles.logo} />
    },
    {
        name: 'Easy Service',
        logo: <EasyServiceLogo className={styles.logo} />
    }
];