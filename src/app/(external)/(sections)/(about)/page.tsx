import styles from './page.module.scss';
import { GridSlide } from "./slides/grid/slide";
import { PromoSlide } from "./slides/promo/slide";
import { Singleton2Slide } from './slides/singleton-2/slide';
import { SingletonSlide } from "./slides/singleton/slide";
import { StartSlide } from "./slides/start/slide";
import { TwoSidesSlide } from "./slides/two-sides/slide";

export default function Page() {
    return (
        <>
        <StartSlide />
        <div className={styles.gradient}>
            <TwoSidesSlide />
            <PromoSlide />
        </div>
        <SingletonSlide />
        <Singleton2Slide />
        </>
    )
}