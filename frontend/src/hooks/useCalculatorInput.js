import { useState, useCallback, useEffect } from 'react';

/**
 * Хук для улучшенных input полей калькуляторов с валидацией и debounce
 */
export const useCalculatorInput = (initialValue = '', options = {}) => {
  const {
    min = 0,
    max = Infinity,
    required = false,
    type = 'number',
    debounceMs = 300,
    validator = null,
    onValidChange = null
  } = options;

  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  // Функция валидации
  const validateValue = useCallback((val) => {
    if (required && (!val || val.trim() === '')) {
      return 'Поле обязательно для заполнения';
    }

    if (type === 'number' && val !== '') {
      const numVal = parseFloat(val);
      
      if (isNaN(numVal)) {
        return 'Введите число больше нуля';
      }
      
      if (numVal < min) {
        return `Введите число больше ${min}`;
      }
      
      if (numVal > max) {
        return `Введите число меньше ${max}`;
      }
    }

    // Пользовательская валидация
    if (validator && typeof validator === 'function') {
      const customError = validator(val);
      if (customError) return customError;
    }

    return '';
  }, [min, max, required, type, validator]);

  // Обработчик изменения
  const handleChange = useCallback((newValue) => {
    setValue(newValue);
    
    const errorMsg = validateValue(newValue);
    setError(errorMsg);
    setIsValid(!errorMsg);
  }, [validateValue]);

  // Debounce для автоматического пересчета
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      
      // Вызываем callback только для валидных значений
      if (isValid && onValidChange) {
        onValidChange(value);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, isValid, debounceMs, onValidChange]);

  // Сброс значений
  const reset = useCallback(() => {
    setValue(initialValue);
    setError('');
    setIsValid(true);
    setDebouncedValue(initialValue);
  }, [initialValue]);

  return {
    value,
    debouncedValue,
    error,
    isValid,
    handleChange,
    reset,
    // Дополнительные свойства для accessibility
    hasError: !!error,
    errorId: error ? `error-${Math.random().toString(36).substr(2, 9)}` : null
  };
};

/**
 * Хук для управления состоянием результатов калькулятора
 */
export const useCalculatorResults = () => {
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculate = useCallback((calculationFn) => {
    setIsCalculating(true);
    
    // Используем requestIdleCallback для оптимизации производительности
    const performCalculation = () => {
      try {
        const result = calculationFn();
        setResults(result);
        setHasCalculated(true);
      } catch (error) {
        console.error('Ошибка при расчете:', error);
        setResults(null);
      } finally {
        setIsCalculating(false);
      }
    };

    // Разбиваем тяжелые вычисления для предотвращения блокировки UI
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(performCalculation);
    } else {
      setTimeout(performCalculation, 0);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setHasCalculated(false);
    setIsCalculating(false);
  }, []);

  return {
    results,
    isCalculating,
    hasCalculated,
    calculate,
    clearResults
  };
};