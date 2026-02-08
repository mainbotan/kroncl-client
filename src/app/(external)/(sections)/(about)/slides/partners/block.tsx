import { PageBlockProps } from "@/app/(external)/_types";
import clsx from "clsx";
import styles from './block.module.scss';
import Button from "@/assets/ui-kit/button/button";
import React from "react";

export type Partner = {
    name: string;
    logo: React.ReactNode;
}
interface PartnersBlockProps extends PageBlockProps {
    partners: Partner[];
}

export function PartnersBlock({
    className,
    partners = []
}: PartnersBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            <div className={styles.line}>
                {partners.map((partner, index) => (
                    <section key={index} className={styles.item}>
                        {partner.logo}
                    </section>
                ))}
            </div>
            <div className={styles.modal}>
                <span className={styles.slogan}>
                    Благодарим наших партнёров - вместе мы помогаем предпринимателям по всей России.
                </span>
                <span className={styles.actions}>
                    <Button as='link' href='/become-partner' className={styles.action} variant="contrast">Стать партнёром</Button>
                </span>
            </div>
        </div>
    )
}