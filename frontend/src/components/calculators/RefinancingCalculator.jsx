import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { RefreshCw, Calculator, TrendingDown, AlertTriangle } from "lucide-react";

const RefinancingCalculator = () => {
  // Текущий кредит
  const [currentBalance, setCurrentBalance] = useState("");
  const [currentRate, setCurrentRate] = useState("");
  const [currentTerm, setCurrentTerm] = useState("");
  
  // Новый кредит
  const [newRate, setNewRate] = useState("");
  const [newTerm, setNewTerm] = useState("");
  const [refinancingFees, setRefinancingFees] = useState("");
  
  const [currency, setCurrency] = useState("RUB");
  const [result, setResult] = useState(null);

  const currencies = [
    { value: "RUB", label: "₽ Рубли", symbol: "₽" },
    { value: "USD", label: "$ Доллары", symbol: "$" },
    { value: "EUR", label: "€ Евро", symbol: "€" }
  ];

  const calculateRefinancing = useCallback(() => {
    const balance = parseFloat(currentBalance);
    const currentR = parseFloat(currentRate) / 100 / 12; // месячная ставка
    const currentT = parseFloat(currentTerm) * 12; // в месяцах
    const newR = parseFloat(newRate) / 100 / 12; // месячная ставка
    const newT = parseFloat(newTerm) * 12; // в месяцах
    const fees = parseFloat(refinancingFees) || 0;

    if (!balance || !currentRate || !currentTerm || !newRate || !newTerm || 
        balance <= 0 || currentRate <= 0 || currentTerm <= 0 || newRate <= 0 || newTerm <= 0) return;

    // Расчет текущего ежемесячного платежа
    const currentMonthlyPayment = balance * (currentR * Math.pow(1 + currentR, currentT)) / (Math.pow(1 + currentR, currentT) - 1);
    
    // Расчет нового ежемесячного платежа (с учетом комиссий, добавленных к остатку)
    const newBalance = balance + fees;
    const newMonthlyPayment = newBalance * (newR * Math.pow(1 + newR, newT)) / (Math.pow(1 + newR, newT) - 1);
    
    // Общие суммы выплат
    const currentTotalPayment = currentMonthlyPayment * currentT;
    const newTotalPayment = newMonthlyPayment * newT;
    
    // Экономия
    const monthlyPaymentSavings = currentMonthlyPayment - newMonthlyPayment;
    const totalSavings = currentTotalPayment - newTotalPayment;
    
    // Переплата по процентам
    const currentTotalInterest = currentTotalPayment - balance;
    const newTotalInterest = newTotalPayment - newBalance;
    const interestSavings = currentTotalInterest - newTotalInterest;
    
    // Период окупаемости комиссий
    const breakEvenMonths = fees > 0 && monthlyPaymentSavings > 0 ? fees / monthlyPaymentSavings : 0;
    
    // Анализ выгодности
    const isWorthwhile = totalSavings > 0;
    const paybackTime = breakEvenMonths <= newT ? breakEvenMonths : Infinity;
    
    const selectedCurrency = currencies.find(c => c.value === currency);

    setResult({
      currentBalance: balance,
      newBalance: newBalance,
      refinancingFees: fees,
      currentRate: parseFloat(currentRate),
      newRate: parseFloat(newRate),
      currentTerm: parseFloat(currentTerm),
      newTerm: parseFloat(newTerm),
      currentMonthlyPayment: currentMonthlyPayment,
      newMonthlyPayment: newMonthlyPayment,
      monthlyPaymentSavings: monthlyPaymentSavings,
      currentTotalPayment: currentTotalPayment,
      newTotalPayment: newTotalPayment,
      totalSavings: totalSavings,
      currentTotalInterest: currentTotalInterest,
      newTotalInterest: newTotalInterest,
      interestSavings: interestSavings,
      breakEvenMonths: breakEvenMonths,
      paybackTime: paybackTime,
      isWorthwhile: isWorthwhile,
      currency: selectedCurrency,
      savingsPercentage: currentTotalPayment > 0 ? (totalSavings / currentTotalPayment) * 100 : 0
    });
  }, [currentBalance, currentRate, currentTerm, newRate, newTerm, refinancingFees, currency]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(num);
  };

  const formatMonths = (months) => {
    if (!isFinite(months)) return "Никогда";
    if (months < 1) return "Меньше месяца";
    if (months < 12) return `${Math.round(months)} мес.`;
    return `${(months / 12).toFixed(1)} лет`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор рефинансирования</CardTitle>
              <CardDescription>
                Расчет выгоды от перекредитования займа
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800">Текущий кредит</h3>
              
              <div className="space-y-2">
                <Label htmlFor="currentBalance">Остаток задолженности</Label>
                <Input
                  id="currentBalance"
                  type="number"
                  placeholder="1500000"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentRate">Текущая ставка (% годовых)</Label>
                <Input
                  id="currentRate"
                  type="number"
                  step="0.1"
                  placeholder="12.5"
                  value={currentRate}
                  onChange={(e) => setCurrentRate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentTerm">Оставшийся срок (лет)</Label>
                <Input
                  id="currentTerm"
                  type="number"
                  step="0.1"
                  placeholder="15"
                  value={currentTerm}
                  onChange={(e) => setCurrentTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800">Новый кредит</h3>
              
              <div className="space-y-2">
                <Label htmlFor="newRate">Новая ставка (% годовых)</Label>
                <Input
                  id="newRate"
                  type="number"
                  step="0.1"
                  placeholder="9.5"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newTerm">Новый срок (лет)</Label>
                <Input
                  id="newTerm"
                  type="number"
                  step="0.1"
                  placeholder="15"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refinancingFees">Комиссии за рефинансирование</Label>
                <Input
                  id="refinancingFees"
                  type="number"
                  placeholder="50000"
                  value={refinancingFees}
                  onChange={(e) => setRefinancingFees(e.target.value)}
                />
              </div>
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
              onClick={calculateRefinancing} 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать выгоду
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className={`bg-gradient-to-r ${result.isWorthwhile ? 'from-green-50 to-emerald-50 border-green-200' : 'from-red-50 to-orange-50 border-red-200'}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {result.isWorthwhile ? (
                        <TrendingDown className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      {result.isWorthwhile ? 'Рефинансирование выгодно' : 'Рефинансирование невыгодно'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Общая экономия</p>
                      <p className={`text-3xl font-bold ${result.totalSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.totalSavings >= 0 ? '+' : ''}{formatNumber(result.totalSavings)} {result.currency.symbol}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {result.savingsPercentage.toFixed(1)}% экономии
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-600">Текущий платеж</p>
                        <p className="text-lg font-semibold">
                          {formatNumber(result.currentMonthlyPayment)} {result.currency.symbol}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-600">Новый платеж</p>
                        <p className={`text-lg font-semibold ${result.monthlyPaymentSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatNumber(result.newMonthlyPayment)} {result.currency.symbol}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Экономия в месяц</p>
                      <p className={`text-2xl font-bold ${result.monthlyPaymentSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.monthlyPaymentSavings >= 0 ? '+' : ''}{formatNumber(result.monthlyPaymentSavings)} {result.currency.symbol}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-600">Общие выплаты (текущий)</p>
                        <p className="text-lg font-semibold">
                          {formatNumber(result.currentTotalPayment)} {result.currency.symbol}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-600">Общие выплаты (новый)</p>
                        <p className="text-lg font-semibold">
                          {formatNumber(result.newTotalPayment)} {result.currency.symbol}
                        </p>
                      </div>
                    </div>

                    {result.refinancingFees > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Срок окупаемости комиссий</p>
                        <p className="text-xl font-bold text-orange-600">
                          {formatMonths(result.breakEvenMonths)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Комиссии: {formatNumber(result.refinancingFees)} {result.currency.symbol}
                        </p>
                      </div>
                    )}

                    <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                      <p><strong>Ставка:</strong> {result.currentRate}% → {result.newRate}%</p>
                      <p><strong>Срок:</strong> {result.currentTerm} → {result.newTerm} лет</p>
                      <p><strong>Экономия на процентах:</strong> {formatNumber(result.interestSavings)} {result.currency.symbol}</p>
                      <p><strong>Остаток долга:</strong> {formatNumber(result.currentBalance)} {result.currency.symbol}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите параметры для расчета выгоды рефинансирования
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* When to Refinance */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Когда стоит рефинансировать</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">✅ Стоит рефинансировать</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Снижение ставки на 1-2% и более</li>
                <li>• Улучшение кредитной истории</li>
                <li>• Рост доходов</li>
                <li>• Консолидация нескольких кредитов</li>
                <li>• Изменение условий в лучшую сторону</li>
                <li>• Экономия покрывает все расходы</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">❌ Не стоит рефинансировать</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Минимальная разница в ставках</li>
                <li>• Высокие комиссии за перекредитование</li>
                <li>• Короткий оставшийся срок</li>
                <li>• Ухудшение кредитной истории</li>
                <li>• Снижение доходов</li>
                <li>• Штрафы за досрочное погашение</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>О рефинансировании кредитов</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p>
            Рефинансирование — это получение нового кредита для погашения существующего, 
            обычно на более выгодных условиях.
          </p>
          
          <h3>Виды рефинансирования:</h3>
          <ul>
            <li><strong>В том же банке</strong> — пересмотр условий действующего кредита</li>
            <li><strong>В другом банке</strong> — полное перекредитование</li>
            <li><strong>Консолидация</strong> — объединение нескольких кредитов в один</li>
          </ul>

          <h3>Возможные расходы:</h3>
          <ul>
            <li>Комиссия за рассмотрение заявки</li>
            <li>Комиссия за выдачу кредита</li>
            <li>Страхование (если требуется)</li>
            <li>Оценка залога (для ипотеки)</li>
            <li>Штраф за досрочное погашение текущего кредита</li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Советы по рефинансированию:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Сравните предложения минимум 3-5 банков</li>
              <li>• Учитывайте все дополнительные расходы</li>
              <li>• Проверьте свою кредитную историю заранее</li>
              <li>• Рассмотрите возможность досрочного погашения части долга</li>
              <li>• Изучите условия страхования в новом банке</li>
              <li>• Уточните возможность изменения условий в будущем</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefinancingCalculator;