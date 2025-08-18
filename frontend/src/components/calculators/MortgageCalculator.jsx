import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Home, Calculator, TrendingDown } from "lucide-react";

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
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

  const calculateMortgage = useCallback(() => {
    const loan = parseFloat(loanAmount);
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate) / 100 / 12; // месячная ставка
    const term = parseFloat(loanTerm) * 12; // срок в месяцах

    if (!loan || !interestRate || !loanTerm || loan <= 0 || interestRate <= 0 || loanTerm <= 0) {
      return;
    }

    const principalAmount = loan - down;
    
    if (principalAmount <= 0) {
      return;
    }

    // Формула аннуитетного платежа
    const monthlyPayment = principalAmount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - principalAmount;

    const selectedCurrency = currencies.find(c => c.value === currency);

    setResult({
      loanAmount: loan,
      downPayment: down,
      principalAmount: principalAmount,
      monthlyPayment: monthlyPayment,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      currency: selectedCurrency,
      loanTerm: parseFloat(loanTerm),
      interestRate: parseFloat(interestRate)
    });
  }, [loanAmount, downPayment, interestRate, loanTerm, currency]);

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
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Ипотечный калькулятор</CardTitle>
              <CardDescription>
                Рассчитайте ежемесячные платежи и переплату по ипотеке
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Стоимость недвижимости</Label>
              <Input
                id="loanAmount"
                type="number"
                placeholder="5000000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment">Первоначальный взнос</Label>
              <Input
                id="downPayment"
                type="number"
                placeholder="1000000"
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
                placeholder="12.5"
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
                placeholder="20"
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
              onClick={calculateMortgage} 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать ипотеку
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
                          {formatNumber(result.principalAmount)} {result.currency.symbol}
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
                        {((result.totalInterest / result.principalAmount) * 100).toFixed(1)}% от суммы кредита
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                      <p><strong>Общая сумма выплат:</strong> {formatNumber(result.totalPayment)} {result.currency.symbol}</p>
                      <p><strong>Срок:</strong> {result.loanTerm} лет ({result.loanTerm * 12} месяцев)</p>
                      <p><strong>Ставка:</strong> {result.interestRate}% годовых</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите параметры ипотеки для расчета платежей
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Советы по ипотеке</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-green-600">Способы экономии:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Увеличьте первоначальный взнос</li>
                <li>• Рассмотрите разные банки и программы</li>
                <li>• Используйте материнский капитал</li>
                <li>• Подайте заявку на льготную ипотеку</li>
                <li>• Рассмотрите возможность досрочного погашения</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-600">Важно учесть:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Дополнительные расходы на оформление</li>
                <li>• Страхование недвижимости и жизни</li>
                <li>• Возможность изменения ставки</li>
                <li>• Штрафы за досрочное погашение</li>
                <li>• Налоговые вылеты по процентам</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>О расчете ипотеки</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p>
            Ипотечный калькулятор поможет вам рассчитать ежемесячные платежи, 
            общую стоимость кредита и размер переплаты по ипотечному займу.
          </p>
          
          <h3>Формула аннуитетного платежа:</h3>
          <p><strong>ПМ = С × [r(1+r)^n] / [(1+r)^n - 1]</strong></p>
          <ul>
            <li><strong>ПМ</strong> — ежемесячный платеж</li>
            <li><strong>С</strong> — сумма кредита</li>
            <li><strong>r</strong> — месячная процентная ставка</li>
            <li><strong>n</strong> — количество месяцев</li>
          </ul>

          <h3>Виды ипотечных программ:</h3>
          <ul>
            <li><strong>Стандартная ипотека</strong> — обычные условия кредитования</li>
            <li><strong>Льготная ипотека</strong> — субсидированная государством</li>
            <li><strong>Военная ипотека</strong> — для военнослужащих</li>
            <li><strong>Семейная ипотека</strong> — для семей с детьми</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MortgageCalculator;