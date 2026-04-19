import styles from './block.module.scss';
import { PageBlockProps } from "@/app/(external)/_types";
import clsx from "clsx";

export function WarningBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.container, className)}>

        </div>
    )
}