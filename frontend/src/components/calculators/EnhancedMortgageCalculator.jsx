import React, { useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { EnhancedInput } from "../ui/enhanced-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Home, Calculator, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { useCalculatorInput, useCalculatorResults } from "../../hooks/useCalculatorInput";
import ResultsContainer from "../ResultsContainer";

const EnhancedMortgageCalculator = () => {
  // Управление состоянием через хуки с валидацией
  const loanAmountInput = useCalculatorInput('', {
    min: 100000,
    max: 50000000,
    required: true,
    debounceMs: 300
  });

  const downPaymentInput = useCalculatorInput('', {
    min: 0,
    max: 49000000,
    debounceMs: 300
  });

  const interestRateInput = useCalculatorInput('', {
    min: 0.1,
    max: 50,
    required: true,
    debounceMs: 300
  });

  const loanTermInput = useCalculatorInput('', {
    min: 1,
    max: 50,
    required: true,
    debounceMs: 300
  });

  const [currency, setCurrency] = React.useState("RUB");
  const { results, isCalculating, hasCalculated, calculate, clearResults } = useCalculatorResults();

  const currencies = [
    { value: "RUB", label: "₽ Рубли", symbol: "₽" },
    { value: "USD", label: "$ Доллары", symbol: "$" },
    { value: "EUR", label: "€ Евро", symbol: "€" }
  ];

  // Автоматический расчет при изменении валидных значений
  const triggerCalculation = useCallback(() => {
    if (
      loanAmountInput.isValid && loanAmountInput.debouncedValue &&
      interestRateInput.isValid && interestRateInput.debouncedValue &&
      loanTermInput.isValid && loanTermInput.debouncedValue
    ) {
      calculate(calculateMortgage);
    } else {
      clearResults();
    }
  }, [
    loanAmountInput.isValid, 
    loanAmountInput.debouncedValue,
    interestRateInput.isValid, 
    interestRateInput.debouncedValue,
    loanTermInput.isValid,
    loanTermInput.debouncedValue,
    downPaymentInput.debouncedValue,
    currency
  ]);

  // Функция расчета ипотеки
  const calculateMortgage = useCallback(() => {
    const loan = parseFloat(loanAmountInput.debouncedValue);
    const down = parseFloat(downPaymentInput.debouncedValue) || 0;
    const rate = parseFloat(interestRateInput.debouncedValue) / 100 / 12; // месячная ставка
    const term = parseFloat(loanTermInput.debouncedValue) * 12; // срок в месяцах

    const principalAmount = loan - down;
    
    if (principalAmount <= 0) {
      throw new Error('Первоначальный взнос не может превышать стоимость недвижимости');
    }

    // Формула аннуитетного платежа
    const monthlyPayment = principalAmount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - principalAmount;

    const selectedCurrency = currencies.find(c => c.value === currency);

    return {
      loanAmount: loan,
      downPayment: down,
      principalAmount: principalAmount,
      monthlyPayment: monthlyPayment,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      currency: selectedCurrency,
      loanTerm: parseFloat(loanTermInput.debouncedValue),
      interestRate: parseFloat(interestRateInput.debouncedValue),
      paymentToIncomeRatio: null // можно добавить расчет при наличии дохода
    };
  }, [
    loanAmountInput.debouncedValue,
    downPaymentInput.debouncedValue,
    interestRateInput.debouncedValue,
    loanTermInput.debouncedValue,
    currency,
    currencies
  ]);

  // Запуск автоматического расчета
  React.useEffect(() => {
    triggerCalculation();
  }, [triggerCalculation]);

  // Валидация первоначального взноса относительно стоимости недвижимости
  const downPaymentValidator = useMemo(() => {
    return (value) => {
      if (!value) return '';
      const downPayment = parseFloat(value);
      const loanAmount = parseFloat(loanAmountInput.value);
      
      if (loanAmount && downPayment >= loanAmount) {
        return 'Первоначальный взнос не может быть больше стоимости недвижимости';
      }
      return '';
    };
  }, [loanAmountInput.value]);

  // Форматирование чисел
  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(num);
  };

  // Пустое состояние для результатов
  const emptyState = (
    <div className="space-y-3 text-gray-500">
      <Home className="w-16 h-16 text-gray-300 mx-auto" />
      <div>
        <p className="font-medium">Введите параметры ипотеки</p>
        <p className="text-sm">Заполните все обязательные поля для расчета</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Ипотечный калькулятор</CardTitle>
              <CardDescription>
                Рассчитайте ежемесячные платежи и переплату по ипотеке с автоматическим обновлением результатов
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Форма ввода */}
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800 text-sm font-medium mb-2">
                  <AlertCircle className="w-4 h-4" />
                  Автоматический расчет
                </div>
                <p className="text-blue-700 text-sm">
                  Результаты обновляются автоматически при изменении значений
                </p>
              </div>

              <EnhancedInput
                label="Стоимость недвижимости"
                id="loanAmount"
                type="number"
                inputMode="numeric"
                min={100000}
                max={50000000}
                placeholder="5000000"
                value={loanAmountInput.value}
                onChange={(e) => loanAmountInput.handleChange(e.target.value)}
                error={loanAmountInput.error}
                required
                helperText="Полная стоимость квартиры или дома"
              />

              <EnhancedInput
                label="Первоначальный взнос"
                id="downPayment"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="1000000"
                value={downPaymentInput.value}
                onChange={(e) => downPaymentInput.handleChange(e.target.value)}
                error={downPaymentInput.error || downPaymentValidator(downPaymentInput.value)}
                helperText="Сумма, которую вы готовы внести сразу"
              />

              <EnhancedInput
                label="Процентная ставка (% годовых)"
                id="interestRate"
                type="number"
                inputMode="decimal"
                step={0.1}
                min={0.1}
                max={50}
                placeholder="12.5"
                value={interestRateInput.value}
                onChange={(e) => interestRateInput.handleChange(e.target.value)}
                error={interestRateInput.error}
                required
                helperText="Годовая процентная ставка по ипотеке"
              />

              <EnhancedInput
                label="Срок кредита (лет)"
                id="loanTerm"
                type="number"
                inputMode="numeric"
                min={1}
                max={50}
                placeholder="20"
                value={loanTermInput.value}
                onChange={(e) => loanTermInput.handleChange(e.target.value)}
                error={loanTermInput.error}
                required
                helperText="Период погашения ипотеки"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Валюта</label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Индикатор статуса расчета */}
              <div className="flex items-center gap-2 text-sm">
                {hasCalculated && !isCalculating ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-700">Расчет выполнен</span>
                  </>
                ) : isCalculating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-blue-700">Выполняется расчет...</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Заполните все поля</span>
                  </>
                )}
              </div>
            </div>

            {/* Результаты */}
            <div className="space-y-4">
              <ResultsContainer
                isCalculating={isCalculating}
                hasResults={hasCalculated && results}
                emptyState={emptyState}
                minHeight="min-h-[500px]"
              >
                {results && (
                  <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-blue-600" />
                        Результаты расчета
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Основной результат */}
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">Ежемесячный платеж</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {formatNumber(results.monthlyPayment)} {results.currency.symbol}
                        </p>
                      </div>
                      
                      {/* Дополнительные показатели */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <p className="text-sm text-gray-600">Сумма кредита</p>
                          <p className="text-lg font-semibold">
                            {formatNumber(results.principalAmount)} {results.currency.symbol}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <p className="text-sm text-gray-600">Первый взнос</p>
                          <p className="text-lg font-semibold">
                            {formatNumber(results.downPayment)} {results.currency.symbol}
                          </p>
                        </div>
                      </div>

                      {/* Переплата */}
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">Общая переплата</p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatNumber(results.totalInterest)} {results.currency.symbol}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          {((results.totalInterest / results.principalAmount) * 100).toFixed(1)}% от суммы кредита
                        </Badge>
                      </div>

                      {/* Детальная информация */}
                      <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                        <p><strong>Общая сумма выплат:</strong> {formatNumber(results.totalPayment)} {results.currency.symbol}</p>
                        <p><strong>Срок:</strong> {results.loanTerm} лет ({results.loanTerm * 12} месяцев)</p>
                        <p><strong>Ставка:</strong> {results.interestRate}% годовых</p>
                        <p><strong>Долг к стоимости:</strong> {((results.principalAmount / results.loanAmount) * 100).toFixed(1)}%</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </ResultsContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Дополнительная информация */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Советы по ипотеке</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-green-600">Способы экономии:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Увеличьте первоначальный взнос до 20-30%</li>
                <li>• Сравните предложения разных банков</li>
                <li>• Используйте материнский капитал</li>
                <li>• Рассмотрите льготные программы</li>
                <li>• Планируйте досрочное погашение</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-600">Важно учесть:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Комиссии банка и страхование</li>
                <li>• Возможность изменения ставки</li>
                <li>• Штрафы за досрочное погашение</li>
                <li>• Налоговые вычеты по процентам</li>
                <li>• Резерв на дополнительные расходы</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMortgageCalculator;