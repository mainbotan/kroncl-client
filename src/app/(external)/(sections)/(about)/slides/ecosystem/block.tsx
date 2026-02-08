import { PageBlockProps } from "@/app/(external)/_types";
import clsx from "clsx";
import styles from './block.module.scss';
import Button from "@/assets/ui-kit/button/button";

export function EcosystemBlock({className}: PageBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>

            <svg className={styles.svg} viewBox="0 0 423 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.375 105.188C70.0417 26.188 251.975 -84.412 422.375 105.188" />
            </svg>
        </div>
    )
}