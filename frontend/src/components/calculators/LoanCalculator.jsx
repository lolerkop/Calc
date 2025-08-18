import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CreditCard, Calculator } from "lucide-react";

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [currency, setCurrency] = useState("RUB");
  const [result, setResult] = useState(null);

  const currencies = [
    { value: "RUB", label: "₽ Рубли", symbol: "₽" },
    { value: "USD", label: "$ Доллары", symbol: "$" },
    { value: "EUR", label: "€ Евро", symbol: "€" }
  ];

  const calculateLoan = useCallback(() => {
    const loan = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const term = parseFloat(loanTerm) * 12;

    if (!loan || !interestRate || !loanTerm || loan <= 0 || interestRate <= 0 || loanTerm <= 0) {
      return;
    }

    const monthlyPayment = loan * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - loan;

    const selectedCurrency = currencies.find(c => c.value === currency);

    setResult({
      loanAmount: loan,
      monthlyPayment: monthlyPayment,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      currency: selectedCurrency,
      loanTerm: parseFloat(loanTerm),
      interestRate: parseFloat(interestRate)
    });
  }, [loanAmount, interestRate, loanTerm, currency]);

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
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор кредита</CardTitle>
              <CardDescription>
                Расчет параметров потребительского кредита
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Сумма кредита</Label>
              <Input
                id="loanAmount"
                type="number"
                placeholder="500000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Процентная ставка (% годовых)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                placeholder="15.5"
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
                placeholder="5"
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
              onClick={calculateLoan} 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать кредит
            </Button>
          </div>

          <div className="space-y-4">
            {result ? (
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="pt-6 space-y-4">
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
                      <p className="text-sm text-gray-600">Переплата</p>
                      <p className="text-lg font-semibold text-red-600">
                        {formatNumber(result.totalInterest)} {result.currency.symbol}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                    <p><strong>Общая сумма выплат:</strong> {formatNumber(result.totalPayment)} {result.currency.symbol}</p>
                    <p><strong>Срок:</strong> {result.loanTerm} лет</p>
                    <p><strong>Ставка:</strong> {result.interestRate}% годовых</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите параметры кредита
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanCalculator;