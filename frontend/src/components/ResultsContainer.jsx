import React from 'react';
import { Card, CardContent } from './ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Фиксированный контейнер для результатов калькулятора
 * Предотвращает Cumulative Layout Shift (CLS)
 */
const ResultsContainer = ({ 
  children, 
  isCalculating = false, 
  hasResults = false,
  emptyState,
  className,
  minHeight = 'min-h-[300px]' 
}) => {
  return (
    <div 
      className={cn(
        'relative transition-all duration-300',
        minHeight,
        className
      )}
    >
      {/* Состояние загрузки */}
      {isCalculating && (
        <Card className="absolute inset-0">
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
              <p className="text-gray-500">Выполняем расчет...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Состояние с результатами */}
      {!isCalculating && hasResults && (
        <div className="animate-fade-in">
          {children}
        </div>
      )}

      {/* Пустое состояние */}
      {!isCalculating && !hasResults && (
        <Card className="bg-gray-50 border-dashed border-2 border-gray-300">
          <CardContent className="flex items-center justify-center h-full text-center py-12">
            {emptyState || (
              <div className="space-y-3 text-gray-500">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 bg-gray-400 rounded opacity-50" />
                </div>
                <p>Введите данные для расчета</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsContainer;