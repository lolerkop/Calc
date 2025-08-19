import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { BarChart, Calculator, TrendingUp, Target } from "lucide-react";

const MarginCalculator = () => {
  // Расчет маржи
  const [revenue, setRevenue] = useState("");
  const [cost, setCost] = useState("");
  const [result1, setResult1] = useState(null);

  // Расчет наценки
  const [costPrice, setCostPrice] = useState("");
  const [markupPercent, setMarkupPercent] = useState("");
  const [result2, setResult2] = useState(null);

  // Целевая прибыль
  const [targetRevenue, setTargetRevenue] = useState("");
  const [targetMargin, setTargetMargin] = useState("");
  const [result3, setResult3] = useState(null);

  const [currency, setCurrency] = useState("RUB");

  const currencies = [
    { value: "RUB", label: "₽ Рубли", symbol: "₽" },
    { value: "USD", label: "$ Доллары", symbol: "$" },
    { value: "EUR", label: "€ Евро", symbol: "€" }
  ];

  const calculateMargin = useCallback(() => {
    const rev = parseFloat(revenue);
    const c = parseFloat(cost);

    if (!rev || !c || rev <= 0 || c < 0 || c >= rev) {
      return;
    }

    const profit = rev - c;
    const marginPercent = (profit / rev) * 100;
    const markupPercent = (profit / c) * 100;
    const costPercent = (c / rev) * 100;

    const selectedCurrency = currencies.find(cur => cur.value === currency);

    setResult1({
      revenue: rev,
      cost: c,
      profit: profit,
      marginPercent: marginPercent,
      markupPercent: markupPercent,
      costPercent: costPercent,
      currency: selectedCurrency
    });
  }, [revenue, cost, currency]);

  const calculateMarkup = useCallback(() => {
    const cost = parseFloat(costPrice);
    const markup = parseFloat(markupPercent);

    if (!cost || markup === undefined || cost <= 0 || markup < 0) {
      return;
    }

    const markupAmount = (cost * markup) / 100;
    const sellingPrice = cost + markupAmount;
    const marginPercent = (markupAmount / sellingPrice) * 100;

    const selectedCurrency = currencies.find(cur => cur.value === currency);

    setResult2({
      cost: cost,
      markupPercent: markup,
      markupAmount: markupAmount,
      sellingPrice: sellingPrice,
      marginPercent: marginPercent,
      currency: selectedCurrency
    });
  }, [costPrice, markupPercent, currency]);

  const calculateTargetCost = useCallback(() => {
    const rev = parseFloat(targetRevenue);
    const margin = parseFloat(targetMargin);

    if (!rev || margin === undefined || rev <= 0 || margin < 0 || margin >= 100) {
      return;
    }

    const maxCost = rev * (1 - margin / 100);
    const targetProfit = rev - maxCost;
    const breakEvenCost = rev; // При 0% марже

    const selectedCurrency = currencies.find(cur => cur.value === currency);

    setResult3({
      targetRevenue: rev,
      targetMargin: margin,
      maxCost: maxCost,
      targetProfit: targetProfit,
      breakEvenCost: breakEvenCost,
      currency: selectedCurrency
    });
  }, [targetRevenue, targetMargin, currency]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(num);
  };

  const formatPercent = (num) => {
    return new Intl.NumberFormat('ru-RU', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    }).format(num);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-3 rounded-xl">
              <BarChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор маржинальности</CardTitle>
              <CardDescription>
                Расчет прибыли, наценки, маржи и рентабельности
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label>Валюта</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-48">
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

          <Tabs defaultValue="margin" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="margin">Маржа</TabsTrigger>
              <TabsTrigger value="markup">Наценка</TabsTrigger>
              <TabsTrigger value="target">Целевая прибыль</TabsTrigger>
            </TabsList>

            {/* Расчет маржи */}
            <TabsContent value="margin" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Расчет маржи и рентабельности</h3>
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Выручка (доходы)</Label>
                    <Input
                      id="revenue"
                      type="number"
                      placeholder="100000"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Себестоимость (расходы)</Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder="60000"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <Button onClick={calculateMargin} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать маржу
                  </Button>
                </div>
                <div>
                  {result1 ? (
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-orange-600">
                            {formatPercent(result1.marginPercent)}%
                          </p>
                          <p className="text-sm text-gray-600">маржа (валовая прибыль)</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-3 border border-orange-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Выручка</span>
                              <span className="font-semibold">{formatNumber(result1.revenue)} {result1.currency.symbol}</span>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-orange-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Себестоимость</span>
                              <span className="font-semibold text-red-600">-{formatNumber(result1.cost)} {result1.currency.symbol}</span>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-orange-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Прибыль</span>
                              <span className="font-semibold text-green-600">+{formatNumber(result1.profit)} {result1.currency.symbol}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Badge variant="secondary" className="justify-center">
                            Наценка: {formatPercent(result1.markupPercent)}%
                          </Badge>
                          <Badge variant="secondary" className="justify-center">
                            Доля затрат: {formatPercent(result1.costPercent)}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <BarChart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Введите выручку и себестоимость</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Расчет наценки */}
            <TabsContent value="markup" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Расчет цены продажи по наценке</h3>
                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Себестоимость</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      placeholder="5000"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="markupPercent">Наценка (%)</Label>
                    <Input
                      id="markupPercent"
                      type="number"
                      step="0.1"
                      placeholder="50"
                      value={markupPercent}
                      onChange={(e) => setMarkupPercent(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <Button onClick={calculateMarkup} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать цену
                  </Button>
                </div>
                <div>
                  {result2 ? (
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-orange-600">
                            {formatNumber(result2.sellingPrice)} {result2.currency.symbol}
                          </p>
                          <p className="text-sm text-gray-600">цена продажи</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-3 border border-orange-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Себестоимость</span>
                              <span className="font-semibold">{formatNumber(result2.cost)} {result2.currency.symbol}</span>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-orange-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Наценка ({result2.markupPercent}%)</span>
                              <span className="font-semibold text-green-600">+{formatNumber(result2.markupAmount)} {result2.currency.symbol}</span>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-orange-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Маржа</span>
                              <span className="font-semibold">{formatPercent(result2.marginPercent)}%</span>
                            </div>
                          </div>
                        </div>

                        <Badge variant="secondary" className="w-full justify-center">
                          Прибыль: {formatNumber(result2.markupAmount)} {result2.currency.symbol}
                        </Badge>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Введите себестоимость и наценку</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Целевая прибыль */}
            <TabsContent value="target" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Планирование целевой прибыли</h3>
                  <div className="space-y-2">
                    <Label htmlFor="targetRevenue">Планируемая выручка</Label>
                    <Input
                      id="targetRevenue"
                      type="number"
                      placeholder="200000"
                      value={targetRevenue}
                      onChange={(e) => setTargetRevenue(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetMargin">Целевая маржа (%)</Label>
                    <Input
                      id="targetMargin"
                      type="number"
                      step="0.1"
                      placeholder="30"
                      value={targetMargin}
                      onChange={(e) => setTargetMargin(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <Button onClick={calculateTargetCost} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать лимит затрат
                  </Button>
                </div>
                <div>
                  {result3 ? (
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-orange-600">
                            {formatNumber(result3.maxCost)} {result3.currency.symbol}
                          </p>
                          <p className="text-sm text-gray-600">максимальные затраты</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-3 border border-orange-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Планируемая выручка</span>
                              <span className="font-semibold">{formatNumber(result3.targetRevenue)} {result3.currency.symbol}</span>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-orange-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Целевая маржа</span>
                              <span className="font-semibold">{formatPercent(result3.targetMargin)}%</span>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-orange-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Целевая прибыль</span>
                              <span className="font-semibold text-green-600">{formatNumber(result3.targetProfit)} {result3.currency.symbol}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded p-3 border border-orange-200">
                          <p className="text-sm text-gray-600 mb-1">Рекомендация</p>
                          <p className="text-sm">
                            Чтобы достичь маржи {formatPercent(result3.targetMargin)}%, 
                            ваши затраты не должны превышать{' '}
                            <strong>{formatNumber(result3.maxCost)} {result3.currency.symbol}</strong>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Введите плановые показатели</p>
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
          <CardTitle>Основные понятия</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Маржа (Margin)</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Формула:</strong> (Выручка - Затраты) / Выручка × 100%
              </p>
              <p className="text-sm">
                Показывает долю прибыли в выручке. 
                Маржа 40% означает, что 40% выручки составляет прибыль.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Наценка (Markup)</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Формула:</strong> (Цена продажи - Себестоимость) / Себестоимость × 100%
              </p>
              <p className="text-sm">
                Показывает, на сколько процентов цена продажи превышает себестоимость.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Рентабельность</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Формула:</strong> Прибыль / Выручка × 100%
              </p>
              <p className="text-sm">
                Эффективность использования ресурсов. 
                Высокая рентабельность = эффективный бизнес.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">💡 Важно понимать:</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Маржа всегда меньше наценки при одинаковой прибыли</li>
              <li>• Высокая маржа не всегда означает высокую прибыль в абсолютных значениях</li>
              <li>• Оптимальная маржа зависит от отрасли и бизнес-модели</li>
              <li>• Учитывайте все затраты: прямые, косвенные, налоги</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarginCalculator;