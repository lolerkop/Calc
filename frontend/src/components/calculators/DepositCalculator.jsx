import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Piggy Bank, Calculator, TrendingUp } from "lucide-react";

const DepositCalculator = () => {
  const [depositAmount, setDepositAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [depositTerm, setDepositTerm] = useState("");
  const [termUnit, setTermUnit] = useState("months");
  const [capitalization, setCapitalization] = useState("monthly");
  const [currency, setCurrency] = useState("RUB");
  const [result, setResult] = useState(null);

  const currencies = [
    { value: "RUB", label: "₽ Рубли", symbol: "₽" },
    { value: "USD", label: "$ Доллары", symbol: "$" },
    { value: "EUR", label: "€ Евро", symbol: "€" }
  ];

  const termUnits = [
    { value: "days", label: "Дни" },
    { value: "months", label: "Месяцы" },
    { value: "years", label: "Годы" }
  ];

  const capitalizationOptions = [
    { value: "daily", label: "Ежедневная" },
    { value: "monthly", label: "Ежемесячная" },
    { value: "quarterly", label: "Ежеквартальная" },
    { value: "annual", label: "Ежегодная" },
    { value: "end", label: "В конце срока" }
  ];

  const calculateDeposit = useCallback(() => {
    const principal = parseFloat(depositAmount);
    const annualRate = parseFloat(interestRate) / 100;
    let termInYears = parseFloat(depositTerm);

    if (!principal || !annualRate || !termInYears || principal <= 0 || annualRate < 0 || termInYears <= 0) {
      return;
    }

    // Преобразуем срок в годы
    if (termUnit === "days") {
      termInYears = termInYears / 365;
    } else if (termUnit === "months") {
      termInYears = termInYears / 12;
    }

    let finalAmount;
    let periodsPerYear;

    // Определяем количество периодов капитализации в году
    switch (capitalization) {
      case "daily":
        periodsPerYear = 365;
        break;
      case "monthly":
        periodsPerYear = 12;
        break;
      case "quarterly":
        periodsPerYear = 4;
        break;
      case "annual":
        periodsPerYear = 1;
        break;
      case "end":
        periodsPerYear = 0;
        break;
      default:
        periodsPerYear = 12;
    }

    if (capitalization === "end" || periodsPerYear === 0) {
      // Простые проценты (капитализация в конце срока)
      finalAmount = principal * (1 + annualRate * termInYears);
    } else {
      // Сложные проценты
      finalAmount = principal * Math.pow(1 + annualRate / periodsPerYear, periodsPerYear * termInYears);
    }

    const totalInterest = finalAmount - principal;
    const effectiveRate = (finalAmount / principal - 1) / termInYears * 100;

    const selectedCurrency = currencies.find(c => c.value === currency);

    setResult({
      principal: principal,
      finalAmount: finalAmount,
      totalInterest: totalInterest,
      termInYears: termInYears,
      annualRate: parseFloat(interestRate),
      effectiveRate: effectiveRate,
      currency: selectedCurrency,
      termDisplay: `${depositTerm} ${termUnits.find(u => u.value === termUnit)?.label.toLowerCase()}`,
      capitalizationType: capitalizationOptions.find(c => c.value === capitalization)?.label
    });
  }, [depositAmount, interestRate, depositTerm, termUnit, capitalization, currency]);

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
              <Piggy Bank className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор вклада</CardTitle>
              <CardDescription>
                Расчет доходности банковского депозита с учетом капитализации
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="depositAmount">Сумма вклада</Label>
              <Input
                id="depositAmount"
                type="number"
                placeholder="500000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Процентная ставка (% годовых)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                placeholder="7.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="depositTerm">Срок</Label>
                <Input
                  id="depositTerm"
                  type="number"
                  placeholder="12"
                  value={depositTerm}
                  onChange={(e) => setDepositTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Единица времени</Label>
                <Select value={termUnit} onValueChange={setTermUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {termUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Капитализация процентов</Label>
              <Select value={capitalization} onValueChange={setCapitalization}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {capitalizationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              onClick={calculateDeposit} 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать вклад
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Результаты вклада
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Сумма к получению</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatNumber(result.finalAmount)} {result.currency.symbol}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-sm text-gray-600">Вложено</p>
                        <p className="text-lg font-semibold">
                          {formatNumber(result.principal)} {result.currency.symbol}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-sm text-gray-600">Проценты</p>
                        <p className="text-lg font-semibold text-green-600">
                          +{formatNumber(result.totalInterest)} {result.currency.symbol}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Эффективная доходность</p>
                      <p className="text-2xl font-bold text-green-600">
                        {result.effectiveRate.toFixed(2)}%
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        Годовых с учетом капитализации
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                      <p><strong>Срок:</strong> {result.termDisplay}</p>
                      <p><strong>Ставка:</strong> {result.annualRate}% годовых</p>
                      <p><strong>Капитализация:</strong> {result.capitalizationType}</p>
                      <p><strong>Прирост:</strong> {((result.finalAmount / result.principal - 1) * 100).toFixed(1)}%</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <Piggy Bank className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите параметры вклада для расчета доходности
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bank Rates Comparison */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Примерные ставки по вкладам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Краткосрочные (до 1 года)</h4>
              <p className="text-2xl font-bold text-blue-600 mb-2">5-7%</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Быстрый доступ к средствам</li>
                <li>• Меньшая доходность</li>
                <li>• Подходит для резервного фонда</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Долгосрочные (1-3 года)</h4>
              <p className="text-2xl font-bold text-green-600 mb-2">7-10%</p>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Оптимальное соотношение</li>
                <li>• Ежемесячная капитализация</li>
                <li>• Стабильный доход</li>
              </ul>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2">Специальные условия</h4>
              <p className="text-2xl font-bold text-amber-600 mb-2">10-15%</p>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Новые клиенты</li>
                <li>• Крупные суммы</li>
                <li>• Ограниченные предложения</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>О депозитах и вкладах</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p>
            Банковский вклад — это надежный способ сохранения и приумножения денежных средств 
            с гарантированной доходностью и страхованием вкладов.
          </p>
          
          <h3>Виды капитализации процентов:</h3>
          <ul>
            <li><strong>Ежедневная</strong> — максимальная доходность, проценты начисляются каждый день</li>
            <li><strong>Ежемесячная</strong> — оптимальный вариант для большинства вкладов</li>
            <li><strong>Ежеквартальная</strong> — начисление каждые 3 месяца</li>
            <li><strong>В конце срока</strong> — простые проценты, минимальная доходность</li>
          </ul>

          <h3>Важные моменты:</h3>
          <ul>
            <li>Вклады до 1,4 млн рублей застрахованы АСВ</li>
            <li>Досрочное расторжение может снизить доходность</li>
            <li>Налог на проценты свыше 1 млн рублей в год</li>
            <li>Сравнивайте предложения разных банков</li>
          </ul>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-green-800 mb-2">💡 Советы по вкладам:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Диверсифицируйте вклады по разным банкам</li>
              <li>• Учитывайте инфляцию при выборе ставки</li>
              <li>• Изучайте условия досрочного расторжения</li>
              <li>• Рассматривайте накопительные счета как альтернативу</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepositCalculator;