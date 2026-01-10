'use client';
import { useState, useRef, KeyboardEvent, useCallback } from 'react';
import clsx from 'clsx';
import styles from './verification-code-input.module.scss';

export interface VerificationCodeInputProps {
  length?: number;
  onCodeComplete: (code: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const VerificationCodeInput = ({ 
  length = 6, 
  onCodeComplete, 
  error, 
  disabled = false,
  className 
}: VerificationCodeInputProps) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const setRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
    inputsRef.current[index] = el;
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '')) {
      onCodeComplete(newCode.join(''));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Переход к предыдущему инпуту при Backspace
        e.preventDefault();
        setTimeout(() => {
          inputsRef.current[index - 1]?.focus();
        }, 10);
      } else if (code[index]) {
        // Очистка текущего инпута
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
    
    // Навигация стрелками
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, length);
    
    if (digits.length > 0) {
      const newCode = [...Array(length).fill('')];
      digits.forEach((digit, index) => {
        if (index < length) {
          newCode[index] = digit;
        }
      });
      setCode(newCode);
      
      // Фокус на последний заполненный инпут
      const lastFilledIndex = Math.min(digits.length - 1, length - 1);
      setTimeout(() => {
        inputsRef.current[lastFilledIndex]?.focus();
      }, 10);
      
      if (digits.length === length) {
        onCodeComplete(newCode.join(''));
      }
    }
  };

  // Обработчик клика по инпуту - всегда фокусируемся
  const handleClick = (index: number) => {
    setTimeout(() => {
      inputsRef.current[index]?.focus();
    }, 10);
  };

  return (
    <div className={clsx(styles.verificationCode, className)}>
      <div className={styles.codeInputs}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={setRef(index)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onClick={() => handleClick(index)}
            disabled={disabled}
            className={clsx(
              styles.codeInput,
              error && styles.error,
              digit && styles.filled,
              'codeInput'
            )}
          />
        ))}
      </div>
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
};