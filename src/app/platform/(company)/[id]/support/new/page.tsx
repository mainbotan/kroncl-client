'use client';

import { PlatformFormBody, PlatformFormSection, PlatformFormVariants } from "@/app/platform/components/lib/form";
import { PlatformFormVariantOption } from "@/app/platform/components/lib/form/_types";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Button from "@/assets/ui-kit/button/button";
import Textarea from "@/assets/ui-kit/textarea/textarea";
import { Scrollable } from "../components/scrollable/content";
import { usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { useState } from "react";
import { useSupport } from "@/apps/company/modules";
import { useParams, useRouter } from "next/navigation";
import { useMessage } from "@/app/platform/components/lib/message/provider";
import { supportEvents } from "@/apps/company/modules/support/events";

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const companyId = params.id as string;
    const supportModule = useSupport();
    const { showMessage } = useMessage();
    
    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.SUPPORT_TICKETS_CREATE);
    
    // form state
    const [selectedTheme, setSelectedTheme] = useState('technical_issue');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    const themes: PlatformFormVariantOption[] = [
        {
            value: 'technical_issue',
            label: 'Техническая проблема',
            description: 'Ошибки в работе системы, баги, некорректное отображение данных, проблемы с загрузкой',
        },
        {
            value: 'billing_payment',
            label: 'Биллинг и оплата',
            description: 'Вопросы по тарифам, списаниям, выставлению счетов, продлению подписки',
        },
        {
            value: 'access_rights',
            label: 'Доступ и права',
            description: 'Проблемы с входом, восстановление пароля, настройка прав доступа сотрудников',
        },
        {
            value: 'feature_request',
            label: 'Предложение по функционалу',
            description: 'Идеи по улучшению системы, новый функционал, доработка существующих возможностей',
        },
        {
            value: 'consultation',
            label: 'Консультация',
            description: 'Помощь в работе с системой, обучение сотрудников, рекомендации по настройке',
        },
    ];
    
    const isValid = selectedTheme && message.trim().length >= 10 && message.trim().length <= 3000;
    
    const handleSubmit = async () => {
        if (!isValid || submitting) return;
        
        setSubmitting(true);
        try {
            const response = await supportModule.createTicket({
                theme: selectedTheme,
                text: message.trim()
            });
            
            if (response.status && response.data) {
                // Уведомляем Panel об обновлении
                supportEvents.emit();

                showMessage({
                    label: 'Тикет успешно создан',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/support/${response.data.id}`);
            } else {
                throw new Error(response.message || 'Не удалось создать тикет');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Ошибка при создании тикета',
                variant: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };
    
    if (ALLOW_PAGE.isLoading) return <PlatformLoading />;
    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return <PlatformNotAllowed permission={PERMISSIONS.SUPPORT_TICKETS_CREATE} />;
    
    return (
        <Scrollable>
            <div style={{padding: '.8rem'}}>
                <PlatformHead
                    title="Создание тикета"
                    description="Тикет - новый диалог с техническими специалистами Kroncl."
                />
                <PlatformFormBody>
                    <PlatformFormSection title='Тема обращения'>
                        <PlatformFormVariants
                            value={selectedTheme}
                            options={themes}
                            onChange={setSelectedTheme}
                        />
                    </PlatformFormSection>
                    <PlatformFormSection title='Сообщение тикета'>
                        <Textarea
                            placeholder="Подробно объясните суть проблемы (от 10 до 3000 символов)"
                            style={{minHeight: '10em'}}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </PlatformFormSection>

                    <section>
                        <Button
                            variant='accent'
                            onClick={handleSubmit}
                            disabled={!isValid || submitting}
                            loading={submitting}
                        >
                            Открыть тикет
                        </Button>
                    </section>
                </PlatformFormBody>
            </div>
        </Scrollable>
    );
}