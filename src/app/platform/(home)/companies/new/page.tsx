'use client';

import Input from '@/assets/ui-kit/input/input';
import Button from '@/assets/ui-kit/button/button';
import clsx from 'clsx';
import Earth from '@/assets/ui-kit/icons/earth';
import Guard from '@/assets/ui-kit/icons/guard';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import { useState, ChangeEvent, useEffect, useRef, useCallback } from 'react';
import { generateSlug } from '@/assets/utils/slug';
import { companyInitApi } from '@/apps/company/init/api';
import { PlatformResult } from '@/app/platform/components/lib/result/result';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { useRouter } from 'next/navigation';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus, PlatformFormUnify, PlatformFormVariants } from '@/app/platform/components/lib/form';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { DOCS_LINK_COMPANIES, DOCS_LINK_COMPANIES_PRICING } from '@/app/docs/(v1)/internal.config';
import { SelectPlanBlock } from './components/select-plan-block/block';

type FormData = {
  companyName: string;
  slug: string;
  visibility: 'private' | 'public';
  region: 'ru' | 'kz';
  planCode: string; // добавляем planCode
};

type SlugStatus = 'idle' | 'checking' | 'available' | 'not_available' | 'error';

type PageState = 
  | 'form' 
  | 'creating' 
  | 'provisioning' 
  | 'success' 
  | 'error';

export default function Page() {
  const router = useRouter();
  
  const [pageState, setPageState] = useState<PageState>('form');
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    slug: '',
    visibility: 'private',
    region: 'ru',
    planCode: '' // инициализируем пустым
  });

  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle');
  const [slugMessage, setSlugMessage] = useState<string>('');
  
  const [createdCompany, setCreatedCompany] = useState<{
    id: string;
    name: string;
    slug: string;
  } | null>(null);
  
  const [provisioningAttempts, setProvisioningAttempts] = useState(0);
  const [provisioningMessage, setProvisioningMessage] = useState('');

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const provisioningIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentCompanyIdRef = useRef<string | null>(null);

  // Проверка уникальности slug
  const checkSlugUnique = async (slug: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    debounceTimeoutRef.current = setTimeout(async () => {
      if (!slug || slug.length < 2) {
        setSlugStatus('idle');
        setSlugMessage(slug && slug.length < 2 ? 'Минимум 2 символа' : '');
        return;
      }

      setSlugStatus('checking');
      setSlugMessage('Проверяем уникальность...');

      try {
        const response = await companyInitApi.debouncedCheckSlugUnique(
          slug,
          abortControllerRef.current?.signal
        );

        if (response) {
          if (response.status && response.data.unique) {
            setSlugStatus('available');
            setSlugMessage('Имя компании доступно');
          } else {
            setSlugStatus('not_available');
            setSlugMessage(response.message || 'Slug уже занят');
          }
        } else {
          setSlugStatus('idle');
          setSlugMessage('');
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        
        console.error('Ошибка при проверке slug:', error);
        setSlugStatus('error');
        setSlugMessage('Ошибка проверки');
      }
    }, 500);
  };

  const handleCompanyNameChange = (value: string) => {
    const name = value;
    const newSlug = generateSlug(name);
    
    setFormData(prev => ({
      ...prev,
      companyName: name,
      slug: newSlug
    }));

    checkSlugUnique(newSlug);
  };

  const handleSlugChange = (value: string) => {
    const input = value;
    const cleanedSlug = generateSlug(input);
    
    setFormData(prev => ({
      ...prev,
      slug: cleanedSlug
    }));

    checkSlugUnique(cleanedSlug);
  };

  const handleVisibilitySelect = (value: string) => {
    setFormData(prev => ({
      ...prev,
      visibility: value as 'private' | 'public'
    }));
  };

  const handleRegionSelect = (value: string) => {
    setFormData(prev => ({
      ...prev,
      region: value as 'ru' | 'kz'
    }));
  };

  // Обработчик выбора плана
  const handlePlanSelect = (planCode: string) => {
    setFormData(prev => ({
      ...prev,
      planCode
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.companyName.trim()) {
      setSlugStatus('error');
      setSlugMessage('Введите название компании');
      return false;
    }

    if (!formData.slug.trim()) {
      setSlugStatus('error');
      setSlugMessage('Slug не может быть пустым');
      return false;
    }

    if (formData.slug.length < 2) {
      setSlugStatus('error');
      setSlugMessage('Slug должен содержать минимум 2 символа');
      return false;
    }

    if (slugStatus !== 'available') {
      setSlugStatus('error');
      setSlugMessage('Проверьте уникальность slug');
      return false;
    }

    if (!formData.planCode) {
      alert('Выберите тарифный план');
      return false;
    }

    return true;
  };

  const checkStorageStatus = useCallback(async (companyId: string) => {
    try {
      const response = await companyInitApi.getCompanyStorage(companyId);
      
      if (response.status) {
        const storageStatus = response.data.status;
        setProvisioningAttempts(prev => prev + 1);
        
        switch (storageStatus) {
          case 'active':
            clearProvisioningInterval();
            setPageState('success');
            break;
            
          case 'failed':
          case 'deprecated':
            clearProvisioningInterval();
            setPageState('error');
            setProvisioningMessage(`Статус хранилища: ${storageStatus}`);
            break;
            
          case 'provisioning':
            setProvisioningMessage(`Готовим экземпляр учётной системы. Процесс не займёт больше минуты.`);
            break;
            
          default:
            setProvisioningMessage(`Статус: ${storageStatus}`);
        }
      } else {
        setProvisioningMessage(`Ошибка проверки статуса: ${response.message}`);
      }
    } catch (error) {
      console.error('Ошибка при проверке статуса хранилища:', error);
      setProvisioningMessage('Ошибка соединения');
    }
  }, []);

  const clearProvisioningInterval = () => {
    if (provisioningIntervalRef.current) {
      clearInterval(provisioningIntervalRef.current);
      provisioningIntervalRef.current = null;
    }
  };

  const handleCreateCompany = async () => {
    if (!validateForm()) {
      return;
    }

    setPageState('creating');

    try {
      const response = await companyInitApi.createCompany({
        name: formData.companyName,
        slug: formData.slug,
        description: '',
        avatar_url: '',
        is_public: formData.visibility === 'public',
        plan_code: formData.planCode // передаём выбранный план
      });

      if (response.status) {
        const companyData = {
          id: response.data.id,
          name: response.data.name,
          slug: response.data.slug
        };
        
        setCreatedCompany(companyData);
        currentCompanyIdRef.current = response.data.id;
        
        if (response.data.storage.status === 'active') {
          setPageState('success');
        } else {
          setPageState('provisioning');
          setProvisioningAttempts(1);
          setProvisioningMessage('Начинаем проверку статуса развертывания...');
          
          checkStorageStatus(response.data.id);
          
          provisioningIntervalRef.current = setInterval(() => {
            const companyId = currentCompanyIdRef.current;
            if (companyId) {
              console.log(`Проверяем статус хранилища для компании ${companyId}`);
              checkStorageStatus(companyId);
            }
          }, 5000);
        }
      } else {
        setPageState('error');
      }
    } catch (error) {
      console.error('❌ Ошибка при создании компании:', error);
      setPageState('error');
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      clearProvisioningInterval();
    };
  }, []);

  const getStatusInfo = () => {
    switch (slugStatus) {
      case 'idle':
        return {
          type: 'info' as const,
          icon: null,
          message: slugMessage
        };
      case 'checking':
        return {
          type: 'info' as const,
          icon: null,
          message: slugMessage
        };
      case 'available':
        return {
          type: 'success' as const,
          icon: <SuccessStatus />,
          message: slugMessage
        };
      case 'not_available':
      case 'error':
        return {
          type: 'error' as const,
          icon: <ErrorStatus />,
          message: slugMessage || 'Имя компании не доступно'
        };
      default:
        return {
          type: 'info' as const,
          icon: null,
          message: ''
        };
    }
  };

  switch (pageState) {
    case 'creating':
      return <PlatformLoading capture="Создаём компанию..." />;
      
    case 'provisioning':
      return <PlatformLoading capture={provisioningMessage} />;
      
    case 'success':
      return (
        <PlatformResult
          title="Компания создана."
          description={`Компания "${createdCompany?.name}" успешно создана и развернута. Теперь вы можете начать работу.`}
          redirect={{
            href: `/platform/${createdCompany?.id}`,
            delay: 0,
            label: 'Перенаправляем...'
          }}
          status="success"
        />
      );
      
    case 'error':
      return (
        <PlatformResult
          title="Ошибка создания"
          description="Не удалось создать компанию. Возможно, возникла ошибка при развертывании хранилища."
          actions={[
            {
              label: 'Попробовать снова',
              href: '/platform/companies/new',
              variant: 'contrast' as const
            },
            {
              label: 'Домой',
              href: '/platform',
              variant: 'default' as const
            }
          ]}
          showIcon
          status="error"
        />
      );
      
    case 'form':
    default:
      const statusInfo = getStatusInfo();
      
      return (
        <>
          <PlatformHead
            title="Создание компании"
            description='Создание пространства учётной системы для новой компании.'
            docsEscort={{
              href: DOCS_LINK_COMPANIES,
              title: 'Подробнее об организациях на платформе Kroncl.'
            }}
          />
          <PlatformFormBody>
            <PlatformFormSection title="Название компании">
              <PlatformFormUnify>
                <PlatformFormInput
                  value={formData.companyName}
                  onChange={handleCompanyNameChange}
                  placeholder="До 32 символов"
                  maxLength={32}
                  disabled={pageState !== 'form'}
                />
                <PlatformFormInput
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="@"
                  variant="empty"
                  readOnly={pageState !== 'form'}
                />
              </PlatformFormUnify>
              {slugStatus !== 'idle' && (
                <PlatformFormStatus
                  type={statusInfo.type}
                  message={statusInfo.message}
                  icon={statusInfo.icon}
                />
              )}
            </PlatformFormSection>

            <PlatformFormSection
              title="Видимость"
              description="Настройки видимости позволяют регулировать кто из пользователей сможет видеть компанию в глобальном поиске."
            >
              <PlatformFormVariants
                options={[
                  {
                    value: 'private',
                    label: 'Приватная',
                    description: 'Доступ только по приглашению. Скрыть из глобального поиска.',
                    icon: <Guard />
                  },
                  {
                    value: 'public',
                    label: 'Публичная',
                    description: 'Компания отображается в глобальном поиске.',
                    icon: <Earth  />
                  }
                ]}
                value={formData.visibility}
                onChange={handleVisibilitySelect}
                disabled={pageState !== 'form'}
              />
            </PlatformFormSection>

            <PlatformFormSection
              title="Регион"
              description="Выбор рабочей валюты компании и другие региональные настройки."
            >
              <PlatformFormVariants
                options={[
                  {
                    value: 'ru',
                    label: <>РФ</>,
                    description: 'Расчёты системы в российских рублях.'
                  },
                  {
                    value: 'kz',
                    label: <>Казахстан</>,
                    description: 'Расчёты системы в тенге.'
                  }
                ]}
                value={formData.region}
                onChange={handleRegionSelect}
                disabled={pageState !== 'form'}
              />
            </PlatformFormSection>

            <PlatformFormSection
              title="Тарификация"
              description="После окончания тестового периода."
              link={DOCS_LINK_COMPANIES_PRICING}
              linkText='Подробнее о правилах тарификации организаций на платформе Kroncl.'
            >
              <SelectPlanBlock onSelect={handlePlanSelect} />
            </PlatformFormSection>

            <section>
              <Button
                variant="accent"
                onClick={handleCreateCompany}
                disabled={pageState !== 'form' || slugStatus !== 'available' || !formData.planCode}
              >
                Создать компанию
              </Button>
            </section>
          </PlatformFormBody>
        </>
      );
  }
}