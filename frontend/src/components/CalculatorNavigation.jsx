import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronRight, Calculator } from 'lucide-react';
import { calculatorData } from '../utils/calculatorData';

/**
 * Компонент навигации между калькуляторами
 */
const CalculatorNavigation = ({ currentCalculatorId }) => {
  const { calculatorId } = useParams();
  const activeCalculatorId = currentCalculatorId || calculatorId;

  // Получаем текущий калькулятор и его категорию
  const getCurrentCalculatorInfo = () => {
    for (const category of Object.values(calculatorData)) {
      const calculator = category.calculators.find(calc => calc.id === activeCalculatorId);
      if (calculator) {
        return { calculator, category };
      }
    }
    return null;
  };

  const currentInfo = getCurrentCalculatorInfo();
  if (!currentInfo) return null;

  const { calculator: currentCalculator, category: currentCategory } = currentInfo;

  // Получаем популярные калькуляторы из той же категории и других категорий
  const getRelatedCalculators = () => {
    const sameCategory = currentCategory.calculators
      .filter(calc => calc.id !== activeCalculatorId)
      .slice(0, 3);
    
    // Если в текущей категории мало калькуляторов, добавляем из других категорий
    if (sameCategory.length < 3) {
      const otherCalculators = Object.values(calculatorData)
        .filter(cat => cat !== currentCategory)
        .flatMap(cat => cat.calculators)
        .filter(calc => calc.featured || calc.popular)
        .slice(0, 3 - sameCategory.length);
      
      return [...sameCategory, ...otherCalculators];
    }
    
    return sameCategory;
  };

  const relatedCalculators = getRelatedCalculators();

  return (
    <Card className="mt-8">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Другие калькуляторы</h3>
          <Badge variant="secondary" className="ml-auto">
            {currentCategory.name}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link
              key={calc.id}
              to={`/calculator/${calc.id}`}
              className="group block p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {calc.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {calc.description}
                  </p>
                  {calc.featured && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      Популярный
                    </Badge>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors ml-2 flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link
            to={`/category/${currentCategory.id}`}
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Все калькуляторы категории "{currentCategory.name}"
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatorNavigation;