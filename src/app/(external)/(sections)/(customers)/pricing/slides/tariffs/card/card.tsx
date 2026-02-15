import Button from '@/assets/ui-kit/button/button';
import styles from './card.module.scss';
import clsx from 'clsx';
import Clients from '@/assets/ui-kit/icons/clients';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import { useAuth } from '@/apps/account/auth/context/AuthContext';
import { accountActionsLinks, authLinks } from '@/config/links.config';

// вынести в apps
export type BillingPeriod = 'monthly' | 'annual';

export interface TariffBilling {
    period: BillingPeriod;
    amount_rub: number;
}

export interface TariffTesis {
    about: string;
    marker?: boolean;
}

export interface Tariff {
    name: string;
    billing: TariffBilling[];
    description?: string;
    theses?: TariffTesis[];
    trial?: boolean;
    trial_days?: number;
}

export interface TariffCardProps {
    tariff: Tariff;
    billing_period?: BillingPeriod;
    variant?: 'default' | 'accent';
    className?: string;
}

export function TariffCard({
    billing_period = 'monthly',
    tariff,
    variant = 'default',
    className
}: TariffCardProps) {
    const { status } = useAuth();

    const currentBilling = tariff.billing.find(b => b.period === billing_period)

    if (!currentBilling) return null;

    const formattedAmount = currentBilling.amount_rub.toLocaleString('ru-RU');

    return (
        <div className={clsx(styles.card, styles[variant], className)}>
            <span className={styles.marks}>
                {(tariff.trial && tariff.trial_days) && (
                    <span className={styles.mark}>{tariff.trial_days} дней бесплатно</span>
                )}
            </span>
            <div className={styles.info}>
                <div className={styles.value}>
                    {formattedAmount} ₽
                </div>
                <div className={styles.afterValue}>
                    / {billing_period === 'monthly' ? 'месяц' : 'год'} для 1 организации
                </div>
                <div className={styles.name}>{tariff.name}</div>
                {tariff.description && <div className={styles.description}>{tariff.description}</div>}
                {tariff.theses && (
                    <>
                    <span className={styles.line} />
                    <div className={styles.theses}>
                        {/* <div className={styles.capture}>В составе</div> */}
                        {tariff.theses.map((thesis, index) => (
                        <div className={styles.thesis} key={index}>
                            <span className={styles.icon}>{thesis.marker && (<SuccessStatus />)}</span>
                            <span className={styles.about}>{thesis.about}</span>
                        </div>
                        ))}
                    </div>
                    </>
                )}
            </div>
            <div className={styles.actions}>
                {status === 'authenticated' ? (
                    <Button as='link' href={`${accountActionsLinks.createCompany}`} className={styles.action} variant='accent' fullWidth>
                        Создать организацию
                    </Button>
                ) : (
                    <Button as='link' href={`${authLinks.login}?to=${accountActionsLinks.createCompany}`} className={styles.action} variant='accent' fullWidth>
                        Создать организацию
                    </Button>
                ) }
            </div>
        </div>
    );
}