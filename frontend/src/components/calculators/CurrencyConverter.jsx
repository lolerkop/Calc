import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { DollarSign, Calculator, RefreshCcw, TrendingUp, TrendingDown } from "lucide-react";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("RUB");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock курсы валют (в реальном приложении здесь был бы API)
  const mockRates = {
    USD: { RUB: 92.50, EUR: 0.92, GBP: 0.79, CNY: 7.24, JPY: 149.50 },
    EUR: { USD: 1.09, RUB: 100.80, GBP: 0.86, CNY: 7.89, JPY: 163.20 },
    RUB: { USD: 0.0108, EUR: 0.0099, GBP: 0.0085, CNY: 0.078, JPY: 1.62 },
    GBP: { USD: 1.27, EUR: 1.16, RUB: 117.30, CNY: 9.19, JPY: 189.80 },
    CNY: { USD: 0.138, EUR: 0.127, RUB: 12.82, GBP: 0.109, JPY: 20.65 },
    JPY: { USD: 0.0067, EUR: 0.0061, RUB: 0.618, GBP: 0.0053, CNY: 0.048 }
  };

  const currencies = [
    { 
      value: "USD", 
      label: "Доллар США (USD)", 
      symbol: "$",
      flag: "🇺🇸",
      change: "+0.2%"
    },
    { 
      value: "EUR", 
      label: "Евро (EUR)", 
      symbol: "€",
      flag: "🇪🇺",
      change: "+0.1%"
    },
    { 
      value: "RUB", 
      label: "Российский рубль (RUB)", 
      symbol: "₽",
      flag: "🇷🇺",
      change: "-0.3%"
    },
    { 
      value: "GBP", 
      label: "Фунт стерлингов (GBP)", 
      symbol: "£",
      flag: "🇬🇧",
      change: "+0.4%"
    },
    { 
      value: "CNY", 
      label: "Китайский юань (CNY)", 
      symbol: "¥",
      flag: "🇨🇳",
      change: "-0.1%"
    },
    { 
      value: "JPY", 
      label: "Японская иена (JPY)", 
      symbol: "¥",
      flag: "🇯🇵",
      change: "+0.3%"
    }
  ];

  const convertCurrency = useCallback(async () => {
    if (!amount || !fromCurrency || !toCurrency) return;

    setLoading(true);
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 800));

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

  const formatNumber = (num, decimals = 2) => {
    return new Intl.NumberFormat('ru-RU', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals
    }).format(num);
  };

  const getTrendIcon = (change) => {
    return change?.startsWith('+') ? 
      <TrendingUp className="w-3 h-3 text-green-500" /> : 
      <TrendingDown className="w-3 h-3 text-red-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Конвертер валют</CardTitle>
              <CardDescription>
                Перевод валют по актуальному курсу
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Сумма</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="1000"
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
                        <span>{curr.flag}</span>
                        <span>{curr.label}</span>
                        {getTrendIcon(curr.change)}
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
                        <span>{curr.flag}</span>
                        <span>{curr.label}</span>
                        {getTrendIcon(curr.change)}
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
              onClick={convertCurrency} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg py-6"
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
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Результат конвертации
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-green-600">
                        {formatNumber(result.convertedAmount)} {result.toCurrency.symbol}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {result.toCurrency.flag} {formatNumber(result.originalAmount)} {result.fromCurrency.value} = {formatNumber(result.convertedAmount)} {result.toCurrency.value}
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Обменный курс</p>
                      <p className="font-semibold">
                        1 {result.fromCurrency.value} = {formatNumber(result.rate, 4)} {result.toCurrency.value}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        1 {result.toCurrency.value} = {formatNumber(1 / result.rate, 4)} {result.fromCurrency.value}
                      </p>
                    </div>

                    <div className="text-xs text-gray-500 bg-white p-3 rounded">
                      <p><strong>Обновлено:</strong> {result.timestamp}</p>
                      <p className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          Демо-курсы
                        </Badge>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите сумму для конвертации валют
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
          <CardTitle>Курсы популярных валют</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { pair: "USD/RUB", rate: "92.50", change: "+0.2%", flag: "🇺🇸→🇷🇺" },
              { pair: "EUR/RUB", rate: "100.80", change: "+0.1%", flag: "🇪🇺→🇷🇺" },
              { pair: "EUR/USD", rate: "1.09", change: "-0.1%", flag: "🇪🇺→🇺🇸" },
              { pair: "GBP/USD", rate: "1.27", change: "+0.4%", flag: "🇬🇧→🇺🇸" },
              { pair: "USD/CNY", rate: "7.24", change: "-0.1%", flag: "🇺🇸→🇨🇳" },
              { pair: "USD/JPY", rate: "149.50", change: "+0.3%", flag: "🇺🇸→🇯🇵" }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">{item.flag}</p>
                <p className="font-semibold text-sm">{item.pair}</p>
                <p className="text-lg font-bold text-green-600">{item.rate}</p>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}
                >
                  {item.change}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>О валютном конвертере</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Основные валюты</h3>
              <div className="space-y-2 text-sm">
                <p><strong>USD 🇺🇸</strong> — Доллар США, резервная валюта мира</p>
                <p><strong>EUR 🇪🇺</strong> — Евро, валюта Европейского союза</p>
                <p><strong>RUB 🇷🇺</strong> — Российский рубль, национальная валюта РФ</p>
                <p><strong>GBP 🇬🇧</strong> — Фунт стерлингов, валюта Великобритании</p>
                <p><strong>CNY 🇨🇳</strong> — Китайский юань, валюта КНР</p>
                <p><strong>JPY 🇯🇵</strong> — Японская иена, валюта Японии</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Факторы влияния на курс</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Экономические показатели:</strong> ВВП, инфляция, безработица</p>
                <p><strong>Политические события:</strong> выборы, международные отношения</p>
                <p><strong>Центробанки:</strong> процентные ставки, денежная политика</p>
                <p><strong>Торговый баланс:</strong> экспорт и импорт товаров</p>
                <p><strong>Геополитика:</strong> войны, санкции, международные договоры</p>
                <p><strong>Спекуляции:</strong> активность трейдеров и инвесторов</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Важная информация:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Курсы валют обновляются в реальном времени</li>
              <li>• Банки и обменники берут комиссию за конвертацию</li>
              <li>• Курсы могут значительно колебаться в течение дня</li>
              <li>• Для крупных сумм проверяйте актуальные курсы у банков</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyConverter;