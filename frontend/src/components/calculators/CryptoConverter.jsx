import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Bitcoin, Calculator, RefreshCcw, TrendingUp, TrendingDown } from "lucide-react";

const CryptoConverter = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock курсы (в реальном приложении здесь был бы API)
  const mockRates = {
    BTC: { USD: 65000, EUR: 60000, RUB: 6000000, ETH: 18.5, BNB: 95.2 },
    ETH: { USD: 3500, EUR: 3200, RUB: 320000, BTC: 0.054, BNB: 5.1 },
    BNB: { USD: 680, EUR: 620, RUB: 62000, BTC: 0.0105, ETH: 0.196 },
    USD: { BTC: 0.0000154, ETH: 0.000286, BNB: 0.00147, EUR: 0.92, RUB: 92 },
    EUR: { BTC: 0.0000167, ETH: 0.000313, BNB: 0.00161, USD: 1.09, RUB: 100 },
    RUB: { BTC: 0.000000167, ETH: 0.00000313, BNB: 0.0000161, USD: 0.0109, EUR: 0.01 }
  };

  const currencies = [
    { 
      value: "BTC", 
      label: "Bitcoin (BTC)", 
      symbol: "₿",
      type: "crypto",
      change: "+2.4%"
    },
    { 
      value: "ETH", 
      label: "Ethereum (ETH)", 
      symbol: "Ξ",
      type: "crypto",
      change: "+1.8%"
    },
    { 
      value: "BNB", 
      label: "Binance Coin (BNB)", 
      symbol: "BNB",
      type: "crypto",
      change: "-0.9%"
    },
    { 
      value: "USD", 
      label: "US Dollar (USD)", 
      symbol: "$",
      type: "fiat",
      change: "0.0%"
    },
    { 
      value: "EUR", 
      label: "Euro (EUR)", 
      symbol: "€",
      type: "fiat",
      change: "+0.1%"
    },
    { 
      value: "RUB", 
      label: "Рубль (RUB)", 
      symbol: "₽",
      type: "fiat",
      change: "-0.3%"
    }
  ];

  const calculateConversion = useCallback(async () => {
    if (!amount || !fromCurrency || !toCurrency) return;

    setLoading(true);
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));

    const amt = parseFloat(amount);
    if (amt <= 0) {
      setLoading(false);
      return;
    }

    let rate = 1;
    if (fromCurrency === toCurrency) {
      rate = 1;
    } else if (mockRates[fromCurrency] && mockRates[fromCurrency][toCurrency]) {
      rate = mockRates[fromCurrency][toCurrency];
    } else {
      // Конвертация через USD если прямого курса нет
      const fromToUSD = mockRates[fromCurrency]?.USD || 1;
      const USDToTo = mockRates.USD?.[toCurrency] || 1;
      rate = fromToUSD * USDToTo;
    }

    const convertedAmount = amt * rate;
    
    const fromCur = currencies.find(c => c.value === fromCurrency);
    const toCur = currencies.find(c => c.value === toCurrency);

    setResult({
      originalAmount: amt,
      convertedAmount: convertedAmount,
      rate: rate,
      fromCurrency: fromCur,
      toCurrency: toCur,
      timestamp: new Date().toLocaleString('ru-RU')
    });

    setLoading(false);
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult(null);
  };

  const formatNumber = (num, decimals = 8) => {
    if (num >= 1) {
      return new Intl.NumberFormat('ru-RU', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: Math.min(decimals, 2)
      }).format(num);
    }
    return new Intl.NumberFormat('ru-RU', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: decimals
    }).format(num);
  };

  const getCurrencyIcon = (type, change) => {
    if (type === "crypto") {
      return change?.startsWith('+') ? 
        <TrendingUp className="w-3 h-3 text-green-500" /> : 
        <TrendingDown className="w-3 h-3 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-xl">
              <Bitcoin className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Конвертер криптовалют</CardTitle>
              <CardDescription>
                Перевод между криптовалютами и фиатными валютами
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Количество</Label>
              <Input
                id="amount"
                type="number"
                step="any"
                placeholder="1.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Из валюты</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      <div className="flex items-center gap-2">
                        <span>{curr.label}</span>
                        {getCurrencyIcon(curr.type, curr.change)}
                        <Badge variant="outline" className="text-xs">
                          {curr.change}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={swapCurrencies}
                className="rounded-full w-10 h-10 p-0"
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>В валюту</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      <div className="flex items-center gap-2">
                        <span>{curr.label}</span>
                        {getCurrencyIcon(curr.type, curr.change)}
                        <Badge variant="outline" className="text-xs">
                          {curr.change}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={calculateConversion} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-lg py-6"
            >
              {loading ? (
                <RefreshCcw className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Calculator className="w-5 h-5 mr-2" />
              )}
              {loading ? "Получение курса..." : "Конвертировать"}
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bitcoin className="w-5 h-5 text-yellow-600" />
                      Результат конвертации
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-600 break-all">
                        {formatNumber(result.convertedAmount)} {result.toCurrency.symbol}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatNumber(result.originalAmount)} {result.fromCurrency.symbol}
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <p className="text-sm text-gray-600 mb-1">Курс обмена</p>
                      <p className="font-semibold">
                        1 {result.fromCurrency.value} = {formatNumber(result.rate)} {result.toCurrency.value}
                      </p>
                    </div>

                    <div className="text-xs text-gray-500 bg-white p-3 rounded">
                      <p><strong>Обновлено:</strong> {result.timestamp}</p>
                      <p className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          Демо-данные
                        </Badge>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <Bitcoin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите данные для конвертации
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Popular Pairs */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Популярные пары</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { from: "BTC", to: "USD", rate: "65,000" },
              { from: "ETH", to: "USD", rate: "3,500" },
              { from: "BTC", to: "RUB", rate: "6,000,000" },
              { from: "ETH", to: "BTC", rate: "0.054" }
            ].map((pair, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="font-semibold text-sm">{pair.from}/{pair.to}</p>
                <p className="text-lg font-bold text-yellow-600">{pair.rate}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>О конвертере криптовалют</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Поддерживаемые валюты</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Криптовалюты:</strong></p>
                <ul className="ml-4">
                  <li>• Bitcoin (BTC) — первая и самая популярная</li>
                  <li>• Ethereum (ETH) — платформа смарт-контрактов</li>
                  <li>• Binance Coin (BNB) — токен крупнейшей биржи</li>
                </ul>
                
                <p className="mt-4"><strong>Фиатные валюты:</strong></p>
                <ul className="ml-4">
                  <li>• USD — доллар США</li>
                  <li>• EUR — евро</li>
                  <li>• RUB — российский рубль</li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Важная информация</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Курсы обновляются в реальном времени</strong></p>
                <p>В данной демо-версии используются примерные курсы.</p>
                
                <p className="mt-4"><strong>Комиссии бирж не учитываются</strong></p>
                <p>При реальной покупке/продаже будут дополнительные комиссии.</p>
                
                <p className="mt-4"><strong>Высокая волатильность</strong></p>
                <p>Курсы криптовалют могут значительно изменяться в течение дня.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Предупреждение:</h4>
            <p className="text-sm text-yellow-700">
              Криптовалюты — высокорисковые активы. Инвестируйте только те средства, 
              которые готовы потерять. Курсы могут резко изменяться. Данный калькулятор 
              предназначен только для информационных целей.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoConverter;