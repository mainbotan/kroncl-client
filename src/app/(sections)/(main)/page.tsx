'use client';

import { DemoSlide } from "./slides/demo/slide";
import { StartSlide } from "./slides/start/slide";
import styles from './page.module.scss';
import clsx from "clsx";
import { ProfitabilitySlide } from "./slides/profitability/slide";
import { MultiOrganizationsSlide } from "./slides/multi-organizations/slide";
import { MultiUsersSlide } from "./slides/multi-users/slide";
import { CloudNativeSlide } from "./slides/cloud-native/slide";
import { ScalingSlide } from "./slides/scaling/slide";
import Arrow from "@/assets/ui-kit/svgs/arrow/arrow";

export default function Page() {
    return (
        <>
            <div className={styles.block}>
                <StartSlide />
                <DemoSlide />
            </div>
            <ProfitabilitySlide />
            <MultiOrganizationsSlide />
            <CloudNativeSlide />
            <div className={clsx(styles.block, styles.blue)}>
                <MultiUsersSlide />
            </div>
            <ScalingSlide />
        </>
    )
}