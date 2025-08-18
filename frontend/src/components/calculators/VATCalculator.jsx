import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calculator, Receipt, TrendingUp } from "lucide-react";

const VATCalculator = () => {
  const [sumWithoutVAT, setSumWithoutVAT] = useState("");
  const [sumWithVAT, setSumWithVAT] = useState("");
  const [vatRate, setVatRate] = useState("20");
  const [currency, setCurrency] = useState("RUB");
  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);

  const currencies = [
    { value: "RUB", label: "₽ Рубли", symbol: "₽" },
    { value: "USD", label: "$ Доллары", symbol: "$" },
    { value: "EUR", label: "€ Евро", symbol: "€" }
  ];

  const vatRates = [
    { value: "20", label: "20% (основная ставка РФ)" },
    { value: "10", label: "10% (льготная ставка РФ)" },
    { value: "0", label: "0% (экспорт, льготы)" },
    { value: "21", label: "21% (Нидерланды)" },
    { value: "19", label: "19% (Германия)" },
    { value: "custom", label: "Другая ставка" }
  ];

  const [customRate, setCustomRate] = useState("");

  const calculateVATAdd = useCallback(() => {
    const sum = parseFloat(sumWithoutVAT);
    let rate = parseFloat(vatRate);
    
    if (vatRate === "custom") {
      rate = parseFloat(customRate);
    }

    if (!sum || sum <= 0 || !rate || rate < 0) return;

    const vatAmount = (sum * rate) / 100;
    const totalSum = sum + vatAmount;

    const selectedCurrency = currencies.find(c => c.value === currency);

    setResult1({
      sumWithoutVAT: sum,
      vatAmount: vatAmount,
      totalSum: totalSum,
      vatRate: rate,
      currency: selectedCurrency
    });
  }, [sumWithoutVAT, vatRate, customRate, currency]);

  const calculateVATExtract = useCallback(() => {
    const sum = parseFloat(sumWithVAT);
    let rate = parseFloat(vatRate);
    
    if (vatRate === "custom") {
      rate = parseFloat(customRate);
    }

    if (!sum || sum <= 0 || !rate || rate < 0) return;

    const sumWithoutVATCalc = sum / (1 + rate / 100);
    const vatAmount = sum - sumWithoutVATCalc;

    const selectedCurrency = currencies.find(c => c.value === currency);

    setResult2({
      sumWithVAT: sum,
      sumWithoutVAT: sumWithoutVATCalc,
      vatAmount: vatAmount,
      vatRate: rate,
      currency: selectedCurrency
    });
  }, [sumWithVAT, vatRate, customRate, currency]);

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
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор НДС</CardTitle>
              <CardDescription>
                Расчет НДС к доплате и выделение НДС из суммы
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Настройки */}
          <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label>Ставка НДС</Label>
              <Select value={vatRate} onValueChange={setVatRate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vatRates.map((rate) => (
                    <SelectItem key={rate.value} value={rate.value}>
                      {rate.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {vatRate === "custom" && (
                <Input
                  type="number"
                  placeholder="Введите ставку %"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  className="mt-2"
                />
              )}
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
          </div>

          <Tabs defaultValue="add-vat" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add-vat">Начислить НДС</TabsTrigger>
              <TabsTrigger value="extract-vat">Выделить НДС</TabsTrigger>
            </TabsList>

            {/* Начислить НДС */}
            <TabsContent value="add-vat" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Начислить НДС на сумму</h3>
                  <div className="space-y-2">
                    <Label htmlFor="sumWithoutVAT">Сумма без НДС</Label>
                    <Input
                      id="sumWithoutVAT"
                      type="number"
                      placeholder="10000"
                      value={sumWithoutVAT}
                      onChange={(e) => setSumWithoutVAT(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <Button onClick={calculateVATAdd} className="w-full bg-gradient-to-r from-orange-500 to-amber-600">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать НДС
                  </Button>
                </div>
                <div>
                  {result1 ? (
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="bg-white rounded-lg p-4 border border-orange-200">
                          <p className="text-sm text-gray-600 mb-1">Сумма с НДС</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {formatNumber(result1.totalSum)} {result1.currency.symbol}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div className="bg-white rounded p-3 border border-orange-200">
                            <p className="text-sm text-gray-600">Сумма без НДС</p>
                            <p className="font-semibold">{formatNumber(result1.sumWithoutVAT)} {result1.currency.symbol}</p>
                          </div>
                          <div className="bg-white rounded p-3 border border-orange-200">
                            <p className="text-sm text-gray-600">НДС ({result1.vatRate}%)</p>
                            <p className="font-semibold text-orange-600">+{formatNumber(result1.vatAmount)} {result1.currency.symbol}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <Receipt className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Результат появится здесь</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Выделить НДС */}
            <TabsContent value="extract-vat" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Выделить НДС из суммы</h3>
                  <div className="space-y-2">
                    <Label htmlFor="sumWithVAT">Сумма с НДС</Label>
                    <Input
                      id="sumWithVAT"
                      type="number"
                      placeholder="12000"
                      value={sumWithVAT}
                      onChange={(e) => setSumWithVAT(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <Button onClick={calculateVATExtract} className="w-full bg-gradient-to-r from-orange-500 to-amber-600">
                    <Calculator className="w-4 h-4 mr-2" />
                    Выделить НДС
                  </Button>
                </div>
                <div>
                  {result2 ? (
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="bg-white rounded-lg p-4 border border-orange-200">
                          <p className="text-sm text-gray-600 mb-1">Сумма без НДС</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {formatNumber(result2.sumWithoutVAT)} {result2.currency.symbol}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div className="bg-white rounded p-3 border border-orange-200">
                            <p className="text-sm text-gray-600">Исходная сумма</p>
                            <p className="font-semibold">{formatNumber(result2.sumWithVAT)} {result2.currency.symbol}</p>
                          </div>
                          <div className="bg-white rounded p-3 border border-orange-200">
                            <p className="text-sm text-gray-600">НДС ({result2.vatRate}%)</p>
                            <p className="font-semibold text-red-600">{formatNumber(result2.vatAmount)} {result2.currency.symbol}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
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
          <CardTitle>О калькуляторе НДС</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Формулы расчета</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Начисление НДС:</strong></p>
                <p>НДС = Сумма × Ставка ÷ 100</p>
                <p>Сумма с НДС = Сумма + НДС</p>
                
                <p className="mt-4"><strong>Выделение НДС:</strong></p>
                <p>Сумма без НДС = Сумма ÷ (1 + Ставка ÷ 100)</p>
                <p>НДС = Сумма - Сумма без НДС</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Ставки НДС в РФ</h3>
              <div className="space-y-2 text-sm">
                <p><strong>20%</strong> — основная ставка для большинства товаров и услуг</p>
                <p><strong>10%</strong> — льготная ставка для:</p>
                <ul className="ml-4">
                  <li>• Продовольственных товаров</li>
                  <li>• Товаров для детей</li>
                  <li>• Медицинских товаров</li>
                  <li>• Печатной продукции</li>
                </ul>
                <p><strong>0%</strong> — экспорт, международные перевозки</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">Важно помнить:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• НДС платят организации и ИП на общем режиме налогообложения</li>
              <li>• Некоторые виды деятельности освобождены от НДС</li>
              <li>• При работе с клиентами всегда указывайте, включен ли НДС в цену</li>
              <li>• Ведите учет НДС для правильного заполнения деклараций</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VATCalculator;