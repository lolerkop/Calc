import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { FileText, Calculator, Percent } from "lucide-react";

const TaxesCalculator = () => {
  // Подоходный налог
  const [grossSalary, setGrossSalary] = useState("");
  const [taxRate, setTaxRate] = useState("13");
  const [deductions, setDeductions] = useState("");
  const [currency, setCurrency] = useState("RUB");
  const [incomeResult, setIncomeResult] = useState(null);

  // Налог с продаж
  const [saleAmount, setSaleAmount] = useState("");
  const [salesTaxRate, setSalesTaxRate] = useState("0");
  const [salesResult, setSalesResult] = useState(null);

  // Налог на прибыль
  const [revenue, setRevenue] = useState("");
  const [expenses, setExpenses] = useState("");
  const [profitTaxRate, setProfitTaxRate] = useState("20");
  const [profitResult, setProfitResult] = useState(null);

  const currencies = [
    { value: "RUB", label: "₽ Рубли", symbol: "₽" },
    { value: "USD", label: "$ Доллары", symbol: "$" },
    { value: "EUR", label: "€ Евро", symbol: "€" }
  ];

  const incomeTaxRates = [
    { value: "13", label: "13% (резиденты РФ)" },
    { value: "30", label: "30% (нерезиденты РФ)" },
    { value: "15", label: "15% (доходы свыше 5 млн)" },
    { value: "35", label: "35% (выигрыши, призы)" },
    { value: "custom", label: "Другая ставка" }
  ];

  const profitTaxRates = [
    { value: "20", label: "20% (общая ставка РФ)" },
    { value: "15", label: "15% (льготная ставка)" },
    { value: "13.5", label: "13.5% (участники СЭЗ)" },
    { value: "0", label: "0% (льготы для инноваций)" },
    { value: "custom", label: "Другая ставка" }
  ];

  const [customIncomeRate, setCustomIncomeRate] = useState("");
  const [customProfitRate, setCustomProfitRate] = useState("");

  const calculateIncomeTax = useCallback(() => {
    const salary = parseFloat(grossSalary);
    let rate = parseFloat(taxRate);
    const deduct = parseFloat(deductions) || 0;
    
    if (taxRate === "custom") {
      rate = parseFloat(customIncomeRate);
    }

    if (!salary || !rate || salary <= 0 || rate < 0) return;

    const taxableIncome = Math.max(0, salary - deduct);
    const taxAmount = (taxableIncome * rate) / 100;
    const netSalary = salary - taxAmount;

    const selectedCurrency = currencies.find(c => c.value === currency);

    setIncomeResult({
      grossSalary: salary,
      deductions: deduct,
      taxableIncome: taxableIncome,
      taxAmount: taxAmount,
      netSalary: netSalary,
      taxRate: rate,
      currency: selectedCurrency,
      effectiveTaxRate: salary > 0 ? (taxAmount / salary) * 100 : 0
    });
  }, [grossSalary, taxRate, customIncomeRate, deductions, currency]);

  const calculateSalesTax = useCallback(() => {
    const amount = parseFloat(saleAmount);
    const rate = parseFloat(salesTaxRate);

    if (!amount || !rate || amount <= 0 || rate < 0) return;

    const taxAmount = (amount * rate) / 100;
    const totalAmount = amount + taxAmount;

    const selectedCurrency = currencies.find(c => c.value === currency);

    setSalesResult({
      saleAmount: amount,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      taxRate: rate,
      currency: selectedCurrency
    });
  }, [saleAmount, salesTaxRate, currency]);

  const calculateProfitTax = useCallback(() => {
    const rev = parseFloat(revenue);
    const exp = parseFloat(expenses) || 0;
    let rate = parseFloat(profitTaxRate);

    if (profitTaxRate === "custom") {
      rate = parseFloat(customProfitRate);
    }

    if (!rev || rev <= 0 || !rate || rate < 0) return;

    const profit = Math.max(0, rev - exp);
    const taxAmount = (profit * rate) / 100;
    const netProfit = profit - taxAmount;

    const selectedCurrency = currencies.find(c => c.value === currency);

    setProfitResult({
      revenue: rev,
      expenses: exp,
      grossProfit: profit,
      taxAmount: taxAmount,
      netProfit: netProfit,
      taxRate: rate,
      currency: selectedCurrency,
      profitMargin: rev > 0 ? (netProfit / rev) * 100 : 0
    });
  }, [revenue, expenses, profitTaxRate, customProfitRate, currency]);

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
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор налогов</CardTitle>
              <CardDescription>
                Расчет подоходного налога и налоговых обязательств
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Настройки валюты */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="max-w-xs">
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
          </div>

          <Tabs defaultValue="income" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="income">Подоходный налог</TabsTrigger>
              <TabsTrigger value="sales">Налог с продаж</TabsTrigger>
              <TabsTrigger value="profit">Налог на прибыль</TabsTrigger>
            </TabsList>

            {/* Подоходный налог */}
            <TabsContent value="income" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Расчет подоходного налога</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="grossSalary">Валовой доход</Label>
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
                    <Label>Налоговая ставка</Label>
                    <Select value={taxRate} onValueChange={setTaxRate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {incomeTaxRates.map((rate) => (
                          <SelectItem key={rate.value} value={rate.value}>
                            {rate.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {taxRate === "custom" && (
                      <Input
                        type="number"
                        placeholder="Введите ставку %"
                        value={customIncomeRate}
                        onChange={(e) => setCustomIncomeRate(e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deductions">Налоговые вычеты (необязательно)</Label>
                    <Input
                      id="deductions"
                      type="number"
                      placeholder="0"
                      value={deductions}
                      onChange={(e) => setDeductions(e.target.value)}
                    />
                  </div>

                  <Button onClick={calculateIncomeTax} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать подоходный налог
                  </Button>
                </div>

                <div>
                  {incomeResult ? (
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="bg-white rounded-lg p-4 border border-orange-200">
                          <p className="text-sm text-gray-600 mb-1">Чистый доход</p>
                          <p className="text-2xl font-bold text-green-600">
                            {formatNumber(incomeResult.netSalary)} {incomeResult.currency.symbol}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div className="bg-white rounded p-3 border border-orange-200">
                            <p className="text-sm text-gray-600">Валовой доход</p>
                            <p className="font-semibold">{formatNumber(incomeResult.grossSalary)} {incomeResult.currency.symbol}</p>
                          </div>
                          <div className="bg-white rounded p-3 border border-orange-200">
                            <p className="text-sm text-gray-600">Налоговые вычеты</p>
                            <p className="font-semibold text-blue-600">-{formatNumber(incomeResult.deductions)} {incomeResult.currency.symbol}</p>
                          </div>
                          <div className="bg-white rounded p-3 border border-orange-200">
                            <p className="text-sm text-gray-600">Подоходный налог ({incomeResult.taxRate}%)</p>
                            <p className="font-semibold text-red-600">-{formatNumber(incomeResult.taxAmount)} {incomeResult.currency.symbol}</p>
                          </div>
                        </div>

                        <div className="bg-white rounded p-3 text-sm">
                          <p><strong>Налогооблагаемый доход:</strong> {formatNumber(incomeResult.taxableIncome)} {incomeResult.currency.symbol}</p>
                          <p><strong>Эффективная ставка:</strong> {incomeResult.effectiveTaxRate.toFixed(2)}%</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Результат появится здесь</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Налог с продаж */}
            <TabsContent value="sales" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Налог с продаж</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="saleAmount">Сумма продажи</Label>
                    <Input
                      id="saleAmount"
                      type="number"
                      placeholder="10000"
                      value={saleAmount}
                      onChange={(e) => setSaleAmount(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salesTaxRate">Ставка налога с продаж (%)</Label>
                    <Input
                      id="salesTaxRate"
                      type="number"
                      step="0.1"
                      placeholder="5"
                      value={salesTaxRate}
                      onChange={(e) => setSalesTaxRate(e.target.value)}
                    />
                  </div>

                  <Button onClick={calculateSalesTax} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать налог с продаж
                  </Button>
                </div>

                <div>
                  {salesResult ? (
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="bg-white rounded-lg p-4 border border-orange-200">
                          <p className="text-sm text-gray-600 mb-1">Общая сумма к оплате</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {formatNumber(salesResult.totalAmount)} {salesResult.currency.symbol}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div className="bg-white rounded p-3 border border-orange-200">
                            <p className="text-sm text-gray-600">Сумма товара</p>
                            <p className="font-semibold">{formatNumber(salesResult.saleAmount)} {salesResult.currency.symbol}</p>
                          </div>
                          <div className="bg-white rounded p-3 border border-orange-200">
                            <p className="text-sm text-gray-600">Налог с продаж ({salesResult.taxRate}%)</p>
                            <p className="font-semibold text-red-600">+{formatNumber(salesResult.taxAmount)} {salesResult.currency.symbol}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <Percent className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Результат появится здесь</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Налог на прибыль */}
            <TabsContent value="profit" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Налог на прибыль</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Выручка</Label>
                    <Input
                      id="revenue"
                      type="number"
                      placeholder="1000000"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expenses">Расходы</Label>
                    <Input
                      id="expenses"
                      type="number"
                      placeholder="600000"
                      value={expenses}
                      onChange={(e) => setExpenses(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Ставка налога на прибыль</Label>
                    <Select value={profitTaxRate} onValueChange={setProfitTaxRate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {profitTaxRates.map((rate) => (
                          <SelectItem key={rate.value} value={rate.value}>
                            {rate.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {profitTaxRate === "custom" && (
                      <Input
                        type="number"
                        placeholder="Введите ставку %"
                        value={customProfitRate}
                        onChange={(e) => setCustomProfitRate(e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>

                  <Button onClick={calculateProfitTax} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать налог на прибыль
                  </Button>
                </div>

                <div>
                  {profitResult ? (
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="bg-white rounded-lg p-4 border border-orange-200">
                          <p className="text-sm text-gray-600 mb-1">Чистая прибыль</p>
                          <p className="text-2xl font-bold text-green-600">
                            {formatNumber(profitResult.netProfit)} {profitResult.currency.symbol}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div className="bg-white rounded p-3 border border-orange-200">
                            <p className="text-sm text-gray-600">Выручка</p>
                            <p className="font-semibold">{formatNumber(profitResult.revenue)} {profitResult.currency.symbol}</p>
                          </div>
                          <div className="bg-white rounded p-3 border border-orange-200">
                            <p className="text-sm text-gray-600">Расходы</p>
                            <p className="font-semibold text-blue-600">-{formatNumber(profitResult.expenses)} {profitResult.currency.symbol}</p>
                          </div>
                          <div className="bg-white rounded p-3 border border-orange-200">
                            <p className="text-sm text-gray-600">Налог на прибыль ({profitResult.taxRate}%)</p>
                            <p className="font-semibold text-red-600">-{formatNumber(profitResult.taxAmount)} {profitResult.currency.symbol}</p>
                          </div>
                        </div>

                        <div className="bg-white rounded p-3 text-sm">
                          <p><strong>Валовая прибыль:</strong> {formatNumber(profitResult.grossProfit)} {profitResult.currency.symbol}</p>
                          <p><strong>Маржа прибыли:</strong> {profitResult.profitMargin.toFixed(2)}%</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Результат появится здесь</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Налогообложение в РФ</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Подоходный налог (НДФЛ)</h3>
              <ul className="text-sm space-y-1">
                <li><strong>13%</strong> — для резидентов РФ</li>
                <li><strong>15%</strong> — с доходов свыше 5 млн руб/год</li>
                <li><strong>30%</strong> — для нерезидентов</li>
                <li><strong>35%</strong> — выигрыши, призы свыше 4000 руб</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Налог на прибыль</h3>
              <ul className="text-sm space-y-1">
                <li><strong>20%</strong> — основная ставка</li>
                <li><strong>15%</strong> — льготные виды деятельности</li>
                <li><strong>13.5%</strong> — участники СЭЗ</li>
                <li><strong>0%</strong> — льготы для инноваций</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Налоговые вычеты</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Стандартные:</strong> на детей, инвалидов</li>
                <li><strong>Имущественные:</strong> покупка жилья</li>
                <li><strong>Социальные:</strong> лечение, обучение</li>
                <li><strong>Профессиональные:</strong> для ИП, авторов</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">Важные напоминания:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Налоги рассчитываются с валового дохода за вычетом льгот</li>
              <li>• Ведите учет доходов и расходов для налоговых деклараций</li>
              <li>• Используйте право на налоговые вычеты для уменьшения налогов</li>
              <li>• При больших доходах консультируйтесь с налоговыми консультантами</li>
              <li>• Данный калькулятор дает примерные расчеты для ознакомления</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxesCalculator;