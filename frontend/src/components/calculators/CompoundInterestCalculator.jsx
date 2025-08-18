import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { TrendingUp, Calculator, DollarSign } from "lucide-react";

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState("12");
  const [currency, setCurrency] = useState("RUB");
  const [result, setResult] = useState(null);

  const currencies = [
    { value: "RUB", label: "₽ Рубли", symbol: "₽" },
    { value: "USD", label: "$ Доллары", symbol: "$" },
    { value: "EUR", label: "€ Евро", symbol: "€" }
  ];

  const frequencies = [
    { value: "1", label: "Ежегодно" },
    { value: "2", label: "Каждые 6 месяцев" },
    { value: "4", label: "Ежеквартально" },
    { value: "12", label: "Ежемесячно" },
    { value: "365", label: "Ежедневно" }
  ];

  const calculateCompoundInterest = useCallback(() => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const n = parseFloat(frequency);
    const t = parseFloat(time);

    if (!P || !r || !t || P <= 0 || r <= 0 || t <= 0) {
      return;
    }

    // Формула сложного процента: A = P(1 + r/n)^(nt)
    const amount = P * Math.pow((1 + r / n), n * t);
    const interest = amount - P;

    const selectedCurrency = currencies.find(c => c.value === currency);

    setResult({
      principal: P,
      amount: amount,
      interest: interest,
      currency: selectedCurrency,
      time: t,
      rate: parseFloat(rate),
      frequency: n
    });
  }, [principal, rate, time, frequency, currency]);

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
              <CardTitle className="text-2xl">Калькулятор сложного процента</CardTitle>
              <CardDescription>
                Рассчитайте рост капитала с учетом реинвестирования процентов
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="principal">Начальная сумма</Label>
              <Input
                id="principal"
                type="number"
                placeholder="100000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Годовая процентная ставка (%)</Label>
              <Input
                id="rate"
                type="number"
                step="0.1"
                placeholder="8.5"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Срок инвестирования (лет)</Label>
              <Input
                id="time"
                type="number"
                placeholder="10"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Частота капитализации</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
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
              onClick={calculateCompoundInterest} 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать
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
                      Результаты расчета
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Начальная сумма</p>
                        <p className="text-lg font-semibold">
                          {formatNumber(result.principal)} {result.currency.symbol}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Конечная сумма</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatNumber(result.amount)} {result.currency.symbol}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Прибыль от процентов</p>
                      <p className="text-2xl font-bold text-green-600">
                        +{formatNumber(result.interest)} {result.currency.symbol}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        Рост на {((result.amount / result.principal - 1) * 100).toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                      <p><strong>Срок:</strong> {result.time} лет</p>
                      <p><strong>Ставка:</strong> {result.rate}% годовых</p>
                      <p><strong>Капитализация:</strong> {frequencies.find(f => f.value === result.frequency.toString())?.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите данные и нажмите "Рассчитать" для получения результата
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>О калькуляторе сложного процента</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p>
            Сложный процент — это процент, который начисляется не только на основную сумму, 
            но и на проценты, полученные в предыдущие периоды. Это один из самых мощных 
            инструментов для увеличения капитала.
          </p>
          
          <h3>Формула расчета:</h3>
          <p><strong>A = P(1 + r/n)^(nt)</strong></p>
          <ul>
            <li><strong>A</strong> — итоговая сумма</li>
            <li><strong>P</strong> — начальная сумма</li>
            <li><strong>r</strong> — годовая процентная ставка (в десятичном виде)</li>
            <li><strong>n</strong> — количество начислений процентов в год</li>
            <li><strong>t</strong> — время в годах</li>
          </ul>

          <h3>Примеры использования:</h3>
          <ul>
            <li>Планирование долгосрочных инвестиций</li>
            <li>Расчет доходности депозитов</li>
            <li>Оценка эффективности реинвестирования</li>
            <li>Сравнение различных инвестиционных стратегий</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompoundInterestCalculator;