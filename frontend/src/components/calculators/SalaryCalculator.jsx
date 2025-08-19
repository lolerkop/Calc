import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Wallet, Calculator, Minus, Plus } from "lucide-react";

const SalaryCalculator = () => {
  const [grossSalary, setGrossSalary] = useState("");
  const [taxResident, setTaxResident] = useState("yes");
  const [hasChildren, setHasChildren] = useState("0");
  const [currency, setCurrency] = useState("RUB");
  const [result, setResult] = useState(null);

  const currencies = [
    { value: "RUB", label: "₽ Рубли", symbol: "₽" },
    { value: "USD", label: "$ Доллары", symbol: "$" },
    { value: "EUR", label: "€ Евро", symbol: "€" }
  ];

  const calculateSalary = useCallback(() => {
    const gross = parseFloat(grossSalary);
    const children = parseInt(hasChildren);

    if (!gross || gross <= 0) {
      return;
    }

    // Налоговые ставки
    const incomeTaxRate = taxResident === "yes" ? 0.13 : 0.30; // 13% для резидентов, 30% для нерезидентов
    const socialTaxRate = 0.22; // 22% социальные взносы (платит работодатель)
    const medicalTaxRate = 0.051; // 5.1% медицинские взносы
    const pensionTaxRate = 0.22; // 22% пенсионные взносы

    // Стандартные вычеты
    let standardDeduction = 0;
    standardDeduction += children * 1400; // 1400 руб за ребенка

    // Расчет подоходного налога
    const taxableIncome = Math.max(0, gross - standardDeduction);
    const incomeTax = taxableIncome * incomeTaxRate;

    // Зарплата на руки
    const netSalary = gross - incomeTax;

    // Расходы работодателя (не удерживаются из зарплаты, но полезно знать)
    const socialTax = gross * socialTaxRate;
    const medicalTax = gross * medicalTaxRate;
    const pensionTax = gross * pensionTaxRate;
    const totalEmployerCosts = gross + socialTax + medicalTax + pensionTax;

    const selectedCurrency = currencies.find(c => c.value === currency);

    setResult({
      grossSalary: gross,
      netSalary: netSalary,
      incomeTax: incomeTax,
      standardDeduction: standardDeduction,
      socialTax: socialTax,
      medicalTax: medicalTax,
      pensionTax: pensionTax,
      totalEmployerCosts: totalEmployerCosts,
      taxResident: taxResident === "yes",
      children: children,
      currency: selectedCurrency,
      incomeTaxRate: incomeTaxRate * 100
    });
  }, [grossSalary, taxResident, hasChildren, currency]);

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
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-3 rounded-xl">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор зарплаты</CardTitle>
              <CardDescription>
                Расчет заработной платы с учетом налогов и вычетов
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="grossSalary">Оклад (до налогов)</Label>
              <Input
                id="grossSalary"
                type="number"
                placeholder="100000"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Налоговое резидентство РФ</Label>
              <Select value={taxResident} onValueChange={setTaxResident}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Да, резидент РФ (13%)</SelectItem>
                  <SelectItem value="no">Нет, нерезидент (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Количество детей (для вычетов)</Label>
              <Select value={hasChildren} onValueChange={setHasChildren}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Нет детей</SelectItem>
                  <SelectItem value="1">1 ребенок</SelectItem>
                  <SelectItem value="2">2 ребенка</SelectItem>
                  <SelectItem value="3">3 ребенка</SelectItem>
                  <SelectItem value="4">4+ детей</SelectItem>
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
              onClick={calculateSalary} 
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать зарплату
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-orange-600" />
                      Расчет зарплаты
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <p className="text-sm text-gray-600 mb-1">Зарплата на руки</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatNumber(result.netSalary)} {result.currency.symbol}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 border border-orange-200 flex justify-between items-center">
                        <span className="text-sm text-gray-600">Оклад (брутто)</span>
                        <span className="font-semibold flex items-center gap-1">
                          <Plus className="w-4 h-4 text-green-500" />
                          {formatNumber(result.grossSalary)} {result.currency.symbol}
                        </span>
                      </div>
                      {result.standardDeduction > 0 && (
                        <div className="bg-white rounded-lg p-3 border border-orange-200 flex justify-between items-center">
                          <span className="text-sm text-gray-600">Стандартный вычет</span>
                          <span className="font-semibold flex items-center gap-1">
                            <Plus className="w-4 h-4 text-green-500" />
                            {formatNumber(result.standardDeduction)} {result.currency.symbol}
                          </span>
                        </div>
                      )}
                      <div className="bg-white rounded-lg p-3 border border-orange-200 flex justify-between items-center">
                        <span className="text-sm text-gray-600">НДФЛ ({result.incomeTaxRate}%)</span>
                        <span className="font-semibold flex items-center gap-1">
                          <Minus className="w-4 h-4 text-red-500" />
                          {formatNumber(result.incomeTax)} {result.currency.symbol}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <p className="text-sm text-gray-600 mb-2">Расходы работодателя (не удерживаются)</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Социальные взносы (22%)</span>
                          <span>{formatNumber(result.socialTax)} {result.currency.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Медицинские взносы (5.1%)</span>
                          <span>{formatNumber(result.medicalTax)} {result.currency.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Пенсионные взносы (22%)</span>
                          <span>{formatNumber(result.pensionTax)} {result.currency.symbol}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold">
                          <span>Общие расходы работодателя</span>
                          <span>{formatNumber(result.totalEmployerCosts)} {result.currency.symbol}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                      <p><strong>Статус:</strong> {result.taxResident ? 'Резидент РФ' : 'Нерезидент РФ'}</p>
                      <p><strong>Детей:</strong> {result.children}</p>
                      <p><strong>Эффективная ставка:</strong> {((result.incomeTax / result.grossSalary) * 100).toFixed(1)}%</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите размер оклада для расчета
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
          <CardTitle>Налогообложение зарплаты в РФ</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Подоходный налог (НДФЛ)</h3>
              <ul className="text-sm space-y-1">
                <li>• <strong>13%</strong> — для резидентов РФ</li>
                <li>• <strong>30%</strong> — для нерезидентов РФ</li>
                <li>• <strong>15%</strong> — с доходов свыше 5 млн руб/год</li>
                <li>• Удерживается с заработной платы работника</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Стандартные вычеты</h3>
              <ul className="text-sm space-y-1">
                <li>• <strong>1400 руб</strong> — на первого и второго ребенка</li>
                <li>• <strong>3000 руб</strong> — на третьего и последующих детей</li>
                <li>• <strong>12000 руб</strong> — на ребенка-инвалида</li>
                <li>• Действуют до достижения дохода 350 тыс руб в год</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">📊 Важная информация:</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Социальные взносы платит работодатель, не удерживаются из зарплаты</li>
              <li>• Резидентом считается тот, кто находится в РФ более 183 дней в году</li>
              <li>• Существуют дополнительные вычеты: имущественные, социальные, профессиональные</li>
              <li>• Калькулятор учитывает только основные параметры расчета</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryCalculator;