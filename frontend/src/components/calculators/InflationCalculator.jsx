import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { TrendingDown, Calculator, AlertTriangle } from "lucide-react";

const InflationCalculator = () => {
  const [currentPrice, setCurrentPrice] = useState("");
  const [inflationRate, setInflationRate] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [currency, setCurrency] = useState("RUB");
  const [result, setResult] = useState(null);

  const currencies = [
    { value: "RUB", label: "₽ Рубли", symbol: "₽" },
    { value: "USD", label: "$ Доллары", symbol: "$" },
    { value: "EUR", label: "€ Евро", symbol: "€" }
  ];

  const commonInflationRates = [
    { value: "4", label: "4% (целевая ЦБ РФ)" },
    { value: "6", label: "6% (среднее РФ)" },
    { value: "2", label: "2% (развитые страны)" },
    { value: "3", label: "3% (США долгосрочно)" },
    { value: "custom", label: "Другая ставка" }
  ];

  const [customRate, setCustomRate] = useState("");

  const calculateInflation = useCallback(() => {
    const price = parseFloat(currentPrice);
    let inflation = parseFloat(inflationRate);
    const years = parseFloat(timePeriod);

    if (inflationRate === "custom") {
      inflation = parseFloat(customRate);
    }

    if (!price || inflation === undefined || !years || price <= 0 || years <= 0) {
      return;
    }

    // Формула: Будущая стоимость = Текущая стоимость × (1 + инфляция)^годы
    const futurePrice = price * Math.pow(1 + inflation / 100, years);
    const totalIncrease = futurePrice - price;
    const purchasingPowerLoss = (totalIncrease / futurePrice) * 100;

    // Расчет покупательной способности
    const purchasingPower = price / futurePrice;
    const realValueLoss = ((price - (price / Math.pow(1 + inflation / 100, years))) / price) * 100;

    const selectedCurrency = currencies.find(c => c.value === currency);

    setResult({
      currentPrice: price,
      futurePrice: futurePrice,
      totalIncrease: totalIncrease,
      inflationRate: inflation,
      timePeriod: years,
      purchasingPower: purchasingPower,
      realValueLoss: realValueLoss,
      currency: selectedCurrency,
      totalInflation: ((futurePrice / price - 1) * 100)
    });
  }, [currentPrice, inflationRate, customRate, timePeriod, currency]);

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
            <div className="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-xl">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор инфляции</CardTitle>
              <CardDescription>
                Влияние инфляции на покупательную способность денег
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPrice">Текущая стоимость</Label>
              <Input
                id="currentPrice"
                type="number"
                placeholder="100000"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Уровень инфляции (% в год)</Label>
              <Select value={inflationRate} onValueChange={setInflationRate}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите ставку инфляции" />
                </SelectTrigger>
                <SelectContent>
                  {commonInflationRates.map((rate) => (
                    <SelectItem key={rate.value} value={rate.value}>
                      {rate.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {inflationRate === "custom" && (
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Введите ставку инфляции %"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timePeriod">Период (лет)</Label>
              <Input
                id="timePeriod"
                type="number"
                placeholder="10"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
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
              onClick={calculateInflation} 
              className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать влияние инфляции
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Влияние инфляции
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <p className="text-sm text-gray-600 mb-1">Стоимость через {result.timePeriod} лет</p>
                      <p className="text-3xl font-bold text-red-600">
                        {formatNumber(result.futurePrice)} {result.currency.symbol}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-red-200">
                        <p className="text-sm text-gray-600">Сейчас</p>
                        <p className="text-lg font-semibold">
                          {formatNumber(result.currentPrice)} {result.currency.symbol}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-red-200">
                        <p className="text-sm text-gray-600">Рост цены</p>
                        <p className="text-lg font-semibold text-red-600">
                          +{formatNumber(result.totalIncrease)} {result.currency.symbol}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <p className="text-sm text-gray-600 mb-1">Общий рост цен</p>
                      <p className="text-2xl font-bold text-red-600">
                        +{result.totalInflation.toFixed(1)}%
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        За {result.timePeriod} лет
                      </Badge>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <p className="text-sm text-gray-600 mb-1">Покупательная способность</p>
                      <p className="text-lg font-semibold">
                        {formatNumber(result.purchasingPower * 100)}% от текущей
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        Потеря: {result.realValueLoss.toFixed(1)}%
                      </p>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                      <p><strong>Инфляция:</strong> {result.inflationRate}% в год</p>
                      <p><strong>Период:</strong> {result.timePeriod} лет</p>
                      <p><strong>Среднегодовой рост:</strong> {((Math.pow(result.futurePrice / result.currentPrice, 1 / result.timePeriod) - 1) * 100).toFixed(1)}%</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите данные для расчета влияния инфляции
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Historical Inflation */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Историческая инфляция</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">Россия</h4>
              <p className="text-sm text-red-600 mb-2">2020-2024: 4-8%</p>
              <p className="text-xs text-red-700">Целевой уровень ЦБ РФ: 4%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">США</h4>
              <p className="text-sm text-blue-600 mb-2">2020-2024: 1-9%</p>
              <p className="text-xs text-blue-700">Целевой уровень ФРС: 2%</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Еврозона</h4>
              <p className="text-sm text-green-600 mb-2">2020-2024: 0-10%</p>
              <p className="text-xs text-green-700">Целевой уровень ЕЦБ: 2%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Среднемировая</h4>
              <p className="text-sm text-purple-600 mb-2">2020-2024: 2-6%</p>
              <p className="text-xs text-purple-700">Зависит от региона</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Об инфляции и ее влиянии</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p>
            Инфляция — это устойчивый рост общего уровня цен на товары и услуги, 
            приводящий к снижению покупательной способности денег.
          </p>
          
          <h3>Формула расчета:</h3>
          <p><strong>Будущая стоимость = Текущая стоимость × (1 + Инфляция)^Годы</strong></p>

          <h3>Причины инфляции:</h3>
          <ul>
            <li><strong>Инфляция спроса</strong> — превышение спроса над предложением</li>
            <li><strong>Инфляция издержек</strong> — рост производственных затрат</li>
            <li><strong>Денежная инфляция</strong> — избыточная эмиссия денег</li>
            <li><strong>Импортируемая инфляция</strong> — рост цен на импорт</li>
          </ul>

          <h3>Как защититься от инфляции:</h3>
          <ul>
            <li><strong>Инвестиции</strong> — акции, недвижимость, золото</li>
            <li><strong>Индексированные облигации</strong> — защита от инфляции</li>
            <li><strong>Валютная диверсификация</strong> — активы в разных валютах</li>
            <li><strong>Недвижимость</strong> — традиционная защита от инфляции</li>
          </ul>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-red-800 mb-2">🚨 Важно помнить:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Деньги под матрасом теряют ценность со временем</li>
              <li>• Банковские депозиты должны превышать инфляцию</li>
              <li>• Долгосрочные цели требуют учета инфляции</li>
              <li>• Инфляция влияет на все аспекты финансового планирования</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InflationCalculator;