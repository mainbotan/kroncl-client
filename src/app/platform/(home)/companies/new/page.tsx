'use client';

import Input from '@/assets/ui-kit/input/input';
import styles from './page.module.scss';
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

type FormData = {
  companyName: string;
  slug: string;
  visibility: 'private' | 'public';
  region: 'ru' | 'kz';
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
    region: 'ru'
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
  
  // Используем ref для текущего companyId, чтобы избежать замыкания
  const currentCompanyIdRef = useRef<string | null>(null);

  // Функция проверки уникальности slug с дебаунсом
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

  // Обработчик изменения названия компании
  const handleCompanyNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const newSlug = generateSlug(name);
    
    setFormData(prev => ({
      ...prev,
      companyName: name,
      slug: newSlug
    }));

    checkSlugUnique(newSlug);
  };

  // Обработчик изменения slug (ручное редактирование)
  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cleanedSlug = generateSlug(input);
    
    setFormData(prev => ({
      ...prev,
      slug: cleanedSlug
    }));

    checkSlugUnique(cleanedSlug);
  };

  // Обработчик выбора видимости
  const handleVisibilitySelect = (value: 'private' | 'public') => {
    setFormData(prev => ({
      ...prev,
      visibility: value
    }));
  };

  // Обработчик выбора региона
  const handleRegionSelect = (value: 'ru' | 'kz') => {
    setFormData(prev => ({
      ...prev,
      region: value
    }));
  };

  // Валидация формы
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

    return true;
  };

  // Проверка статуса хранилища (используем useCallback для стабильной ссылки)
  const checkStorageStatus = useCallback(async (companyId: string) => {
    try {
      const response = await companyInitApi.getCompanyStorage(companyId);
      
      if (response.status) {
        const storageStatus = response.data.status;
        setProvisioningAttempts(prev => prev + 1);
        
        switch (storageStatus) {
          case 'active':
            // Успешное развертывание
            clearProvisioningInterval();
            setPageState('success');
            break;
            
          case 'failed':
          case 'deprecated':
            // Ошибка развертывания
            clearProvisioningInterval();
            setPageState('error');
            setProvisioningMessage(`Статус хранилища: ${storageStatus}`);
            break;
            
          case 'provisioning':
            // Продолжаем проверять
            setProvisioningMessage(`Готовим экземпляр учётной системы...`);
            break;
            
          default:
            // Неизвестный статус, продолжаем проверять
            setProvisioningMessage(`Статус: ${storageStatus}`);
        }
      } else {
        // Ошибка при запросе статуса
        setProvisioningMessage(`Ошибка проверки статуса: ${response.message}`);
      }
    } catch (error) {
      console.error('Ошибка при проверке статуса хранилища:', error);
      setProvisioningMessage('Ошибка соединения');
    }
  }, [provisioningAttempts]);

  // Очистка интервала проверки
  const clearProvisioningInterval = () => {
    if (provisioningIntervalRef.current) {
      clearInterval(provisioningIntervalRef.current);
      provisioningIntervalRef.current = null;
    }
  };

  // Обработчик создания компании
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
        is_public: formData.visibility === 'public'
      });

      if (response.status) {
        // Сохраняем данные компании
        const companyData = {
          id: response.data.id,
          name: response.data.name,
          slug: response.data.slug
        };
        
        setCreatedCompany(companyData);
        currentCompanyIdRef.current = response.data.id;
        
        // Проверяем статус хранилища
        if (response.data.storage.status === 'active') {
          // Если сразу active, показываем успех
          setPageState('success');
        } else {
          // Иначе начинаем периодическую проверку
          setPageState('provisioning');
          setProvisioningAttempts(1);
          setProvisioningMessage('Начинаем проверку статуса развертывания...');
          
          // Первая проверка сразу
          checkStorageStatus(response.data.id);
          
          // Устанавливаем интервал проверки каждые 5 секунд
          provisioningIntervalRef.current = setInterval(() => {
            const companyId = currentCompanyIdRef.current;
            if (companyId) {
              console.log(`Проверяем статус хранилища для компании ${companyId}`);
              checkStorageStatus(companyId);
            }
          }, 5000);
        }
      } else {
        // Ошибка при создании
        setPageState('error');
      }
    } catch (error) {
      console.error('❌ Ошибка при создании компании:', error);
      setPageState('error');
    }
  };

  // Очистка при размонтировании компонента
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

  // Определяем статус для отображения
  const getStatusInfo = () => {
    switch (slugStatus) {
      case 'idle':
        return {
          className: '',
          icon: null,
          message: slugMessage
        };
      case 'checking':
        return {
          className: styles.checking,
          icon: null,
          message: slugMessage
        };
      case 'available':
        return {
          className: styles.success,
          icon: <SuccessStatus className={styles.svg} />,
          message: slugMessage
        };
      case 'not_available':
      case 'error':
        return {
          className: styles.error,
          icon: <ErrorStatus className={styles.svg} />,
          message: slugMessage || 'Имя компании не доступно'
        };
      default:
        return {
          className: '',
          icon: null,
          message: ''
        };
    }
  };

  // Определяем состояние страницы
  switch (pageState) {
    case 'creating':
      return (
        <PlatformLoading capture="Создаём компанию..." />
      );
      
    case 'provisioning':
      return (
        <PlatformLoading capture={provisioningMessage} />
      );
      
    case 'success':
      return (
        <PlatformResult
          title="Компания создана!"
          description={`Компания "${createdCompany?.name}" успешно создана и развернута. Теперь вы можете начать работу.`}
          actions={[
            {
              label: 'Открыть компанию',
              href: `/platform/${createdCompany?.id}`,
              variant: 'contrast' as const
            }
          ]}
          redirect={{
            href: `/platform/${createdCompany?.id}`,
            delay: 5000,
            label: 'Автоматический переход в компанию через {seconds} сек.'
          }}
          showIcon
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
        <div className={styles.container}>
          <div className={styles.title}>
            Создание компании
          </div>
          <div className={styles.description}>Создание пространства учётной системы для новой компании.</div>
          <div className={styles.body}>
            <div className={styles.section}>
              <div className={styles.capture}>Название компании</div>
              <div className={styles.unify}>
                <Input 
                  className={styles.input} 
                  variant='elevated' 
                  placeholder='До 32 символов'
                  value={formData.companyName}
                  onChange={handleCompanyNameChange}
                  maxLength={32}
                  disabled={pageState !== 'form'}
                />
                <Input 
                  className={styles.input} 
                  variant='empty' 
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder='@'
                  readOnly={pageState !== 'form'}
                />
              </div>
              {slugStatus !== 'idle' && (
                <div className={clsx(styles.status, statusInfo.className)}>
                  {statusInfo.icon}
                  <span className={styles.name}>{statusInfo.message}</span>
                </div>
              )}
            </div>
            
            <div className={styles.section}>
              <div className={styles.capture}>Видимость</div>
              <div className={styles.description}>Настройки видимости позволяют регулировать кто из пользователей сможет видеть компанию в глобальном поиске.</div>
              <div className={styles.variants}>
                <div 
                  className={clsx(styles.item, formData.visibility === 'private' && styles.active)} 
                  data-value='private'
                  onClick={() => pageState === 'form' && handleVisibilitySelect('private')}
                >
                  <div className={styles.name}><Guard className={styles.icon} /> Приватная</div>
                  <div className={styles.description}>
                    Доступ только по приглашению. Скрыть из глобального поиска.
                  </div>
                </div>
                <div 
                  className={clsx(styles.item, formData.visibility === 'public' && styles.active)} 
                  data-value='public'
                  onClick={() => pageState === 'form' && handleVisibilitySelect('public')}
                >
                  <div className={styles.name}><Earth className={styles.icon} /> Публичная</div>
                  <div className={styles.description}>
                    Компания отображается в глобальном поиске.
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.section}>
              <div className={styles.capture}>Регион</div>
              <div className={styles.description}>Выбор рабочей валюты компании и другие региональные настройки.</div>
              <div className={styles.variants}>
                <div 
                  className={clsx(styles.item, formData.region === 'ru' && styles.active)} 
                  data-value='ru'
                  onClick={() => pageState === 'form' && handleRegionSelect('ru')}
                >
                  <div className={styles.name}>РФ <span className={styles.secondary}>ru-RU</span></div>
                  <div className={styles.descriptio}>Расчёты системы в российских рублях.</div>
                </div>
                <div 
                  className={clsx(styles.item, formData.region === 'kz' && styles.active)} 
                  data-value='kz'
                  onClick={() => pageState === 'form' && handleRegionSelect('kz')}
                >
                  <div className={styles.name}>Казахстан <span className={styles.secondary}>kz-KZ</span></div>
                  <div className={styles.descriptio}>Расчёты системы в тенге.</div>
                </div>
              </div>
            </div>
            
            <section className={styles.actions}>
              <Button 
                className={styles.action} 
                variant='contrast'
                onClick={handleCreateCompany}
                disabled={pageState !== 'form' || slugStatus !== 'available'}
              >
                Создать компанию
              </Button>
            </section>
          </div>
        </div>
      );
  }
}