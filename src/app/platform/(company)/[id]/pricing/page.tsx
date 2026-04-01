'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import clsx from 'clsx';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import styles from './page.module.scss';
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { DOCS_LINK_COMPANIES_PRICING } from "@/app/docs/(v1)/internal.config";
import { PricingPlan as PricingPlanComponent } from "@/app/platform/(home)/companies/new/components/pricing-plan/card";
import { pricingApi } from '@/apps/pricing/api';
import { usePricing } from '@/apps/company/modules';
import type { PricingPlan } from '@/apps/pricing/types';
import type { CompanyPricingPlan, PricingTransaction } from '@/apps/company/modules/pricing/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { Remained } from '@/assets/ui-kit/remained/remained';
import { pluralizeDays } from '@/assets/utils/date';
import { PayBlock } from './components/pay-block/block';
import { PaymentBlock } from './components/payment-block/block';

const blockVariants: Variants = {
    hidden: { opacity: 0, y: -20, height: 0, marginBottom: 0 },
    visible: { opacity: 1, y: 0, height: 'auto', marginBottom: 'var(--spacing-4)' },
    exit: { opacity: 0, y: -20, height: 0, marginBottom: 0 }
};

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;

    const pricingModule = usePricing();

    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [companyPlan, setCompanyPlan] = useState<CompanyPricingPlan | null>(null);
    const [goalPlan, setGoalPlan] = useState<PricingPlan | null>(null);
    const [pendingTransaction, setPendingTransaction] = useState<PricingTransaction | null>(null);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [loadingCompany, setLoadingCompany] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoadingPlans(true);
        setLoadingCompany(true);
        setLoadingTransactions(true);
        setError(null);

        try {
            const [plansResponse, companyPlanResponse, transactionsResponse] = await Promise.all([
                pricingApi.getPlans(),
                pricingModule.getPlan(),
                pricingModule.getTransactions()
            ]);

            if (plansResponse.status && plansResponse.data) {
                setPlans(plansResponse.data.plans);
            } else {
                setError('Не удалось загрузить тарифные планы');
            }

            if (companyPlanResponse.status && companyPlanResponse.data) {
                setCompanyPlan(companyPlanResponse.data);
            } else {
                setError('Не удалось загрузить текущий тариф компании');
            }

            if (transactionsResponse.status && transactionsResponse.data.transactions) {
                const pending = transactionsResponse.data.transactions.find(
                    t => t.status === 'pending'
                );
                if (pending) {
                    setPendingTransaction(pending);
                } else {
                    setPendingTransaction(null);
                }
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Ошибка загрузки данных');
            console.error('Error loading pricing data:', error);
        } finally {
            setLoadingPlans(false);
            setLoadingCompany(false);
            setLoadingTransactions(false);
        }
    }, [companyId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Устанавливаем goalPlan по умолчанию, если daysLeft === 0
    useEffect(() => {
        if (companyPlan && !goalPlan && !loadingCompany && !loadingPlans && plans.length > 0) {
            const daysLeft = companyPlan.days_left;
            const nextPlan = companyPlan.next_plan;
            
            if (daysLeft === 0) {
                if (nextPlan) {
                    const nextPlanFull = plans.find(p => p.code === nextPlan.code);
                    if (nextPlanFull) {
                        setGoalPlan(nextPlanFull);
                    }
                } else {
                    const currentPlanFull = plans.find(p => p.code === companyPlan.current_plan.code);
                    if (currentPlanFull) {
                        setGoalPlan(currentPlanFull);
                    }
                }
            }
        }
    }, [companyPlan, plans, goalPlan, loadingCompany, loadingPlans]);

    const handlePaymentSuccess = (transaction: PricingTransaction) => {
        setPendingTransaction(transaction);
        setGoalPlan(null);
    };

    const handlePaymentError = (error: string) => {
        console.error('Payment error:', error);
    };

    const handleRevokeSuccess = () => {
        fetchData();
        setGoalPlan(null);
    };

    const isLoading = loadingPlans || loadingCompany || loadingTransactions;
    const currentPlanCode = companyPlan?.current_plan.code;
    const daysLeft = companyPlan?.days_left || 0;
    const daysWord = pluralizeDays(daysLeft);
    const nextPlan = companyPlan?.next_plan;

    const handleSelectPlan = (plan: PricingPlan) => {
        if (goalPlan?.code === plan.code) {
            setGoalPlan(null);
        } else {
            setGoalPlan(plan);
        }
    };

    const isActivePlan = (plan: PricingPlan) => {
        if (goalPlan) {
            return goalPlan.code === plan.code;
        }
        return currentPlanCode === plan.code;
    };

    const getLabel = (plan: PricingPlan) => {
        if (currentPlanCode === plan.code) {
            if (companyPlan?.is_trial && daysLeft > 0) {
                return 'Пробный период';
            }
            if (daysLeft > 0) {
                return `${daysLeft} ${pluralizeDays(daysLeft)} осталось`;
            }
            if (nextPlan && !companyPlan?.is_trial) {
                return 'Тариф завершён';
            }
        }
        
        if (goalPlan?.code === plan.code) {
            if (daysLeft === 0 && nextPlan && plan.code === nextPlan.code) {
                return 'Требуется оплата';
            }
            if (daysLeft === 0 && !nextPlan && plan.code === currentPlanCode) {
                return 'Требуется оплата';
            }
        }
        
        return '';
    };

    const showPayBlock = () => {
        if (!companyPlan || !goalPlan) return false;
        if (pendingTransaction) return false;
        
        const daysLeft = companyPlan.days_left;
        return daysLeft === 0 || goalPlan.code !== currentPlanCode;
    };

    const showPaymentBlock = () => {
        return !!pendingTransaction;
    };

    return (
        <>
            <PlatformHead
                title="Тарификация организации"
                description="Смена тарифного плана. Просмотр остатка дней."
                docsEscort={{
                    href: DOCS_LINK_COMPANIES_PRICING,
                    title: 'Подробнее о тарификации организации.'
                }}
            />
            {isLoading && (
                <div className={styles.loading}>
                    <Spinner variant="accent" />
                </div>
            )}
            {error && (
                <div className={styles.error}>
                    <span className={styles.text}>{error}</span>
                </div>
            )}
            {!isLoading && !error && (
                <>
                <Remained
                    className={styles.remained} 
                    value={companyPlan?.days_left}
                    limit={companyPlan?.days_total}
                    >
                    {daysLeft > 0 ? (
                        <>
                            {daysLeft} {daysWord} осталось до окончания тарифа <span className={styles.accent}>«{companyPlan?.current_plan.name}»</span>                        
                        </>
                    ) : (
                        <>Тариф <span className={styles.accent}>«{companyPlan?.current_plan.name}»</span> завершён. Требуется оплата.</>
                    )}
                </Remained>
                
                <AnimatePresence mode="wait">
                    {showPayBlock() && companyPlan && goalPlan && (
                        <motion.div
                            key="pay-block"
                            variants={blockVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                        >
                            <PayBlock 
                                className={styles.payBlock} 
                                companyPlan={companyPlan}
                                goalPlan={goalPlan}
                                onSuccess={handlePaymentSuccess}
                                onError={handlePaymentError}
                            />
                        </motion.div>
                    )}

                    {showPaymentBlock() && pendingTransaction && (
                        <motion.div
                            key="payment-block"
                            variants={blockVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                        >
                            <PaymentBlock 
                                className={styles.paymentBlock} 
                                transaction={pendingTransaction}
                                onRevoke={handleRevokeSuccess}
                                onError={handlePaymentError}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={styles.grid}>
                    {plans.map((plan) => {
                        const active = isActivePlan(plan);
                        const label = getLabel(plan);

                        return (
                            <PricingPlanComponent
                                key={plan.code}
                                plan={plan}
                                label={label}
                                className={clsx(
                                    styles.item,
                                    active && styles.selected
                                )}
                                onClick={() => handleSelectPlan(plan)}
                            />
                        );
                    })}
                </div>
                </>
            )}
        </>
    );
}