'use client';

import Input from '@/assets/ui-kit/input/input';
import styles from './page.module.scss';
import Button from '@/assets/ui-kit/button/button';
import clsx from 'clsx';
import Earth from '@/assets/ui-kit/icons/earth';
import Guard from '@/assets/ui-kit/icons/guard';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { generateSlug } from '@/assets/utils/slug';
import { companyInitApi } from '@/apps/company/init/api';

type FormData = {
  companyName: string;
  slug: string;
  visibility: 'private' | 'public';
  region: 'ru' | 'kz';
};

type SlugStatus = 'idle' | 'checking' | 'available' | 'not_available' | 'error';

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    slug: '',
    visibility: 'private',
    region: 'ru'
  });

  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle');
  const [slugMessage, setSlugMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Функция проверки уникальности slug с дебаунсом
  const checkSlugUnique = async (slug: string) => {
    // Очищаем предыдущий таймер
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController
    abortControllerRef.current = new AbortController();

    // Устанавливаем таймер дебаунса (500ms)
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
          // Запрос был отменен, ничего не делаем
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

    // Проверяем уникальность нового slug
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

    // Проверяем уникальность slug
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

  // Обработчик отправки формы
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await companyInitApi.createCompany({
        name: formData.companyName,
        slug: formData.slug,
        description: '',
        avatar_url: '',
        is_public: formData.visibility === 'public'
      });

      if (response.status) {
        alert(`✅ Компания "${formData.companyName}" успешно создана!\n\nID: ${response.data.id}\nSlug: ${response.data.slug}`);
        // Можно добавить редирект позже
        // router.push(`/company/${response.data.id}`);
      } else {
        alert(`❌ Ошибка: ${response.message}`);
      }
    } catch (error) {
      console.error('❌ Ошибка при создании компании:', error);
      alert('❌ Ошибка при создании компании');
    } finally {
      setIsSubmitting(false);
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
          message: 'Имя компании не доступно'
        };
      default:
        return {
          className: '',
          icon: null,
          message: ''
        };
    }
  };

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
              disabled={isSubmitting}
            />
            <Input 
              className={styles.input} 
              variant='empty' 
              value={formData.slug}
              onChange={handleSlugChange}
              placeholder='@'
              readOnly={isSubmitting}
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
              onClick={() => !isSubmitting && handleVisibilitySelect('private')}
            >
              <div className={styles.name}><Guard className={styles.icon} /> Приватная</div>
              <div className={styles.description}>
                Доступ только по приглашению. Скрыть из глобального поиска.
              </div>
            </div>
            <div 
              className={clsx(styles.item, formData.visibility === 'public' && styles.active)} 
              data-value='public'
              onClick={() => !isSubmitting && handleVisibilitySelect('public')}
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
              onClick={() => !isSubmitting && handleRegionSelect('ru')}
            >
              <div className={styles.name}>РФ <span className={styles.secondary}>ru-RU</span></div>
              <div className={styles.descriptio}>Расчёты системы в российских рублях.</div>
            </div>
            <div 
              className={clsx(styles.item, formData.region === 'kz' && styles.active)} 
              data-value='kz'
              onClick={() => !isSubmitting && handleRegionSelect('kz')}
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
            onClick={handleSubmit}
            disabled={isSubmitting || slugStatus !== 'available'}
          >
            {isSubmitting ? 'Создание...' : 'Создать компанию'}
          </Button>
        </section>
      </div>
    </div>
  );
}