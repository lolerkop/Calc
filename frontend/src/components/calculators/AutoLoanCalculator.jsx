import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Car, Calculator, TrendingDown } from "lucide-react";

const AutoLoanCalculator = () => {
  const [carPrice, setCarPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [currency, setCurrency] = useState("RUB");
  const [result, setResult] = useState(null);

  const currencies = [
    { value: "RUB", label: "₽ Рубли", symbol: "₽" },
    { value: "USD", label: "$ Доллары", symbol: "$" },
    { value: "EUR", label: "€ Евро", symbol: "€" }
  ];

  const calculateAutoLoan = useCallback(() => {
    const price = parseFloat(carPrice);
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate) / 100 / 12; // месячная ставка
    const term = parseFloat(loanTerm) * 12; // срок в месяцах

    if (!price || !interestRate || !loanTerm || price <= 0 || interestRate <= 0 || loanTerm <= 0) {
      return;
    }

    const loanAmount = price - down;
    
    if (loanAmount <= 0) {
      return;
    }

    // Формула аннуитетного платежа
    const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - loanAmount;
    
    // Расчет дополнительных расходов
    const insurance = price * 0.05; // 5% от стоимости авто на страхование
    const registration = price * 0.003; // 0.3% на регистрацию
    const totalCost = price + totalInterest + insurance + registration;

    const selectedCurrency = currencies.find(c => c.value === currency);

    setResult({
      carPrice: price,
      downPayment: down,
      loanAmount: loanAmount,
      monthlyPayment: monthlyPayment,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      insurance: insurance,
      registration: registration,
      totalCost: totalCost,
      currency: selectedCurrency,
      loanTerm: parseFloat(loanTerm),
      interestRate: parseFloat(interestRate)
    });
  }, [carPrice, downPayment, interestRate, loanTerm, currency]);

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
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор автокредита</CardTitle>
              <CardDescription>
                Специальный калькулятор для автомобильных кредитов с учетом всех расходов
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="carPrice">Стоимость автомобиля</Label>
              <Input
                id="carPrice"
                type="number"
                placeholder="2000000"
                value={carPrice}
                onChange={(e) => setCarPrice(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment">Первоначальный взнос</Label>
              <Input
                id="downPayment"
                type="number"
                placeholder="400000"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Процентная ставка (% годовых)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                placeholder="14.5"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanTerm">Срок кредита (лет)</Label>
              <Input
                id="loanTerm"
                type="number"
                placeholder="7"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
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
              onClick={calculateAutoLoan} 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать автокредит
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-blue-600" />
                      Результаты расчета
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Ежемесячный платеж</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {formatNumber(result.monthlyPayment)} {result.currency.symbol}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-sm text-gray-600">Сумма кредита</p>
                        <p className="text-lg font-semibold">
                          {formatNumber(result.loanAmount)} {result.currency.symbol}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-sm text-gray-600">Первый взнос</p>
                        <p className="text-lg font-semibold">
                          {formatNumber(result.downPayment)} {result.currency.symbol}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Общая переплата</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatNumber(result.totalInterest)} {result.currency.symbol}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {((result.totalInterest / result.loanAmount) * 100).toFixed(1)}% от суммы кредита
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 border border-blue-200 flex justify-between">
                        <span className="text-sm text-gray-600">Страхование (~5%)</span>
                        <span className="font-semibold">{formatNumber(result.insurance)} {result.currency.symbol}</span>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-blue-200 flex justify-between">
                        <span className="text-sm text-gray-600">Регистрация</span>
                        <span className="font-semibold">{formatNumber(result.registration)} {result.currency.symbol}</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Общая стоимость владения</p>
                      <p className="text-xl font-bold text-orange-600">
                        {formatNumber(result.totalCost)} {result.currency.symbol}
                      </p>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                      <p><strong>Стоимость авто:</strong> {formatNumber(result.carPrice)} {result.currency.symbol}</p>
                      <p><strong>Срок:</strong> {result.loanTerm} лет ({result.loanTerm * 12} мес.)</p>
                      <p><strong>Ставка:</strong> {result.interestRate}% годовых</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите параметры автокредита для расчета
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
          <CardTitle>Особенности автокредитования</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Преимущества автокредита</h3>
              <ul className="text-sm space-y-1">
                <li>• Более низкая ставка чем у потребительского кредита</li>
                <li>• Автомобиль остается в залоге у банка</li>
                <li>• Возможность получить большую сумму</li>
                <li>• Длительные сроки погашения до 7-10 лет</li>
                <li>• Специальные программы от производителей</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Дополнительные расходы</h3>
              <ul className="text-sm space-y-1">
                <li>• Обязательное страхование КАСКО</li>
                <li>• Регистрация в ГИБДД</li>
                <li>• Комиссии банка за оформление</li>
                <li>• Оценка автомобиля (для б/у)</li>
                <li>• Техосмотр и диагностика</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Советы по автокредиту:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Увеличивайте первоначальный взнос для снижения переплаты</li>
              <li>• Сравнивайте предложения разных банков</li>
              <li>• Учитывайте стоимость страхования при выборе авто</li>
              <li>• Рассмотрите возможность досрочного погашения</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoLoanCalculator;