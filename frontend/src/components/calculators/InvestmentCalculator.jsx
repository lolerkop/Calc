import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { TrendingUp, Calculator, DollarSign } from "lucide-react";

const InvestmentCalculator = () => {
  const [initialAmount, setInitialAmount] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [annualReturn, setAnnualReturn] = useState("");
  const [investmentPeriod, setInvestmentPeriod] = useState("");
  const [currency, setCurrency] = useState("RUB");
  const [result, setResult] = useState(null);

  const currencies = [
    { value: "RUB", label: "₽ Рубли", symbol: "₽" },
    { value: "USD", label: "$ Доллары", symbol: "$" },
    { value: "EUR", label: "€ Евро", symbol: "€" }
  ];

  const calculateInvestment = useCallback(() => {
    const initial = parseFloat(initialAmount) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const annualRate = parseFloat(annualReturn) / 100;
    const years = parseFloat(investmentPeriod);

    if ((!initial && !monthly) || !annualRate || !years || years <= 0) {
      return;
    }

    const monthlyRate = annualRate / 12;
    const totalMonths = years * 12;

    // Формула для расчета будущей стоимости с регулярными взносами
    let futureValue = 0;
    
    // Сложный процент на начальную сумму
    if (initial > 0) {
      futureValue += initial * Math.pow(1 + annualRate, years);
    }

    // Будущая стоимость аннуитета (ежемесячных взносов)
    if (monthly > 0 && monthlyRate > 0) {
      futureValue += monthly * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    } else if (monthly > 0) {
      futureValue += monthly * totalMonths;
    }

    const totalContributions = initial + (monthly * totalMonths);
    const totalGain = futureValue - totalContributions;

    const selectedCurrency = currencies.find(c => c.value === currency);

    setResult({
      initialAmount: initial,
      monthlyContribution: monthly,
      investmentPeriod: years,
      annualReturn: parseFloat(annualReturn),
      totalContributions: totalContributions,
      futureValue: futureValue,
      totalGain: totalGain,
      currency: selectedCurrency
    });
  }, [initialAmount, monthlyContribution, annualReturn, investmentPeriod, currency]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(num);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Инвестиционный калькулятор</CardTitle>
              <CardDescription>
                Планирование инвестиционного портфеля и расчет доходности
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="initialAmount">Начальная сумма инвестиций</Label>
              <Input
                id="initialAmount"
                type="number"
                placeholder="100000"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyContribution">Ежемесячные взносы</Label>
              <Input
                id="monthlyContribution"
                type="number"
                placeholder="10000"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualReturn">Ожидаемая годовая доходность (%)</Label>
              <Input
                id="annualReturn"
                type="number"
                step="0.1"
                placeholder="12"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentPeriod">Период инвестирования (лет)</Label>
              <Input
                id="investmentPeriod"
                type="number"
                placeholder="10"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Валюта</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
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

            <Button 
              onClick={calculateInvestment} 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать инвестиции
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Результаты инвестирования
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Итоговая сумма</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatNumber(result.futureValue)} {result.currency.symbol}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-sm text-gray-600">Всего вложено</p>
                        <p className="text-lg font-semibold">
                          {formatNumber(result.totalContributions)} {result.currency.symbol}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-sm text-gray-600">Прибыль</p>
                        <p className="text-lg font-semibold text-green-600">
                          +{formatNumber(result.totalGain)} {result.currency.symbol}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Рост капитала</p>
                      <p className="text-2xl font-bold text-green-600">
                        {((result.futureValue / result.totalContributions - 1) * 100).toFixed(1)}%
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        За {result.investmentPeriod} лет
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                      <p><strong>Начальная сумма:</strong> {formatNumber(result.initialAmount)} {result.currency.symbol}</p>
                      <p><strong>Ежемесячно:</strong> {formatNumber(result.monthlyContribution)} {result.currency.symbol}</p>
                      <p><strong>Годовая доходность:</strong> {result.annualReturn}%</p>
                      <p><strong>Период:</strong> {result.investmentPeriod} лет</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите параметры инвестиций для расчета доходности
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Investment Strategies */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Популярные инвестиционные стратегии</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Консервативная</h4>
              <p className="text-sm text-blue-600 mb-2">Доходность: 5-8% годовых</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Облигации (70-80%)</li>
                <li>• Банковские депозиты</li>
                <li>• Акции (20-30%)</li>
                <li>• Низкий риск</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Умеренная</h4>
              <p className="text-sm text-green-600 mb-2">Доходность: 8-12% годовых</p>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Акции (50-60%)</li>
                <li>• Облигации (30-40%)</li>
                <li>• ETF и фонды</li>
                <li>• Средний риск</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">Агрессивная</h4>
              <p className="text-sm text-red-600 mb-2">Доходность: 12-20% годовых</p>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• Акции (80-90%)</li>
                <li>• Стартапы и IPO</li>
                <li>• Криптовалюты (5-10%)</li>
                <li>• Высокий риск</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>О инвестиционном планировании</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p>
            Инвестиционное планирование — это процесс определения финансовых целей 
            и создания стратегии их достижения через различные инвестиционные инструменты.
          </p>
          
          <h3>Принципы успешного инвестирования:</h3>
          <ul>
            <li><strong>Диверсификация</strong> — не вкладывайте все средства в один актив</li>
            <li><strong>Долгосрочность</strong> — инвестируйте на срок от 3-5 лет</li>
            <li><strong>Регулярность</strong> — делайте постоянные взносы</li>
            <li><strong>Реинвестирование</strong> — используйте силу сложного процента</li>
          </ul>

          <h3>Факторы, влияющие на доходность:</h3>
          <ul>
            <li>Экономическая ситуация в стране и мире</li>
            <li>Инфляция и изменение курсов валют</li>
            <li>Политические события и решения регуляторов</li>
            <li>Отраслевые тенденции и технологические изменения</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-amber-800 mb-2">⚠️ Важно помнить:</h4>
            <p className="text-sm text-amber-700">
              Прошлая доходность не гарантирует будущих результатов. 
              Инвестиции связаны с риском потери капитала. 
              Всегда консультируйтесь с финансовыми консультантами перед принятием решений.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentCalculator;