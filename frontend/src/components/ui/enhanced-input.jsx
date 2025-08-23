import React from 'react';
import { Input } from './input';
import { Label } from './label';
import { cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';

/**
 * Улучшенный компонент Input с полной поддержкой accessibility и UX
 */
export const EnhancedInput = React.forwardRef(({
  label,
  id,
  error,
  helperText,
  required = false,
  type = 'number',
  inputMode,
  min,
  max,
  step,
  placeholder,
  value,
  onChange,
  className,
  containerClassName,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  // Автоматическое определение inputMode на основе типа
  const getInputMode = () => {
    if (inputMode) return inputMode;
    
    switch (type) {
      case 'number':
        if (step && step !== 1) return 'decimal';
        return 'numeric';
      case 'tel':
        return 'tel';
      case 'email':
        return 'email';
      default:
        return undefined;
    }
  };

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <Label 
          htmlFor={inputId} 
          className={cn(
            'text-sm font-medium',
            required && "after:content-['*'] after:ml-1 after:text-red-500",
            error && 'text-red-600'
          )}
        >
          {label}
        </Label>
      )}
      
      <div className="relative">
        <Input
          ref={ref}
          id={inputId}
          type={type}
          inputMode={getInputMode()}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            'w-full transition-colors',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(errorId, helperId).trim() || undefined}
          {...props}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
      </div>

      {error && (
        <p 
          id={errorId}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p 
          id={helperId}
          className="text-sm text-gray-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

EnhancedInput.displayName = 'EnhancedInput';