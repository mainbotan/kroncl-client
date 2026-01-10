'use client';

import clsx from 'clsx';
import styles from './select.module.scss';
import { 
  SelectHTMLAttributes, 
  forwardRef, 
  useState, 
  useRef, 
  useEffect,
  useId 
} from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  size?: 'sm' | 'md' | 'bg';
  variant?: 'default' | 'leader' | 'contrast' | 'empty' | 'glass';
  error?: boolean;
  fullWidth?: boolean;
  options?: SelectOption[];
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size = 'md',
      variant = 'default',
      border = 'default',
      error = false,
      fullWidth = false,
      options = [],
      className,
      value,
      defaultValue,
      onChange,
      placeholder,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
    const selectRef = useRef<HTMLDivElement>(null);
    const id = useId();

    const selectedOption = options.find(opt => opt.value === selectedValue);
    const displayValue = selectedOption?.label || placeholder || '';

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionClick = (option: SelectOption) => {
      if (option.disabled) return;
      
      setSelectedValue(option.value);
      onChange?.(option.value);
      setIsOpen(false);
    };

    const handleTriggerClick = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          setIsOpen(!isOpen);
          break;
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) setIsOpen(true);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen) setIsOpen(true);
          break;
      }
    };

    return (
      <div 
        ref={selectRef}
        className={clsx(
          styles.selectWrapper,
          {
            [styles.fullWidth]: fullWidth,
            [styles.disabled]: disabled,
          }
        )}
      >
        {/* Скрытый нативный select для формы */}
        <select
          ref={ref}
          value={selectedValue}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={styles.hiddenSelect}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Кастомный триггер */}
        <div
          className={clsx(
            styles.selectTrigger,
            {
              [styles.sm]: size === 'sm',
              [styles.bg]: size === 'bg',
              [styles.default]: variant === 'default',
              [styles.leader]: variant === 'leader',
              [styles.contrast]: variant === 'contrast',
              [styles.empty]: variant === 'empty',
              [styles.glass]: variant === 'glass',
              [styles.error]: error,
              [styles.open]: isOpen,
              [styles.disabled]: disabled,
            },
            className
          )}
          onClick={handleTriggerClick}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-dropdown`}
          aria-label={props['aria-label'] || placeholder}
        >
          <span className={clsx(styles.selectedValue, {
            [styles.placeholder]: !selectedOption
          })}>
            {displayValue}
          </span>
          <svg 
            className={clsx(styles.chevron, { [styles.rotated]: isOpen })} 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="currentColor"
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        {/* Кастомный dropdown */}
        {isOpen && (
          <div 
            id={`${id}-dropdown`}
            className={clsx(styles.dropdown, {
              [styles.sm]: size === 'sm',
              [styles.bg]: size === 'bg',
              [styles.default]: variant === 'default',
              [styles.leader]: variant === 'leader',
              [styles.contrast]: variant === 'contrast',
              [styles.empty]: variant === 'empty',
              [styles.glass]: variant === 'glass',
            })}
            role="listbox"
          >
            {placeholder && (
              <div
                className={clsx(styles.option, styles.placeholderOption, {
                  [styles.selected]: !selectedOption
                })}
                onClick={() => handleOptionClick({ value: '', label: placeholder })}
                role="option"
                aria-selected={!selectedOption}
              >
                {placeholder}
              </div>
            )}
            
            {options.map((option) => (
              <div
                key={option.value}
                className={clsx(styles.option, {
                  [styles.selected]: option.value === selectedValue,
                  [styles.disabled]: option.disabled,
                })}
                onClick={() => handleOptionClick(option)}
                role="option"
                aria-selected={option.value === selectedValue}
                aria-disabled={option.disabled}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;