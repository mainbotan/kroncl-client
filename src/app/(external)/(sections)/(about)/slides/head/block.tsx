import { PageBlockProps } from "@/app/(external)/_types";
import clsx from "clsx";
import styles from './block.module.scss';
import Button, { ButtonProps } from "@/assets/ui-kit/button/button";

type HeadBlockVariants = 'accent' | 'default' | 'orange';
type HeadBlockLocation = 'center' | 'left'

interface HeadBlockProps extends PageBlockProps {
    title?: string;
    description?: string;
    actions?: ButtonProps[];
    variant?: HeadBlockVariants;
    location?: HeadBlockLocation;
}

export function HeadBlock({
    className,
    title,
    description,
    actions,
    variant = 'default',
    location = 'left'
}: HeadBlockProps) {
    return (
        <div className={clsx(styles.block, className, styles[variant], styles[location])}>
            <div className={styles.info}>
                {title && (<div className={styles.title}>{title}</div>)}
                {description && (<div className={styles.description}>{description}</div>)}
            </div>
            {actions && actions.length > 0 && (
                <div className={styles.actions}>
                    {actions.map((actionProps, index) => (
                        <Button
                            className={styles.action}
                            key={index}
                            {...actionProps}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}