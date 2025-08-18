import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Bitcoin, Calculator, RefreshCcw, TrendingUp, TrendingDown, Wifi, WifiOff } from "lucide-react";

const CryptoConverter = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [updateError, setUpdateError] = useState(false);

  const currencies = [
    { 
      value: "BTC", 
      label: "Bitcoin (BTC)", 
      symbol: "₿",
      type: "crypto",
      change: "+2.4%",
      coinGeckoId: "bitcoin"
    },
    { 
      value: "ETH", 
      label: "Ethereum (ETH)", 
      symbol: "Ξ",
      type: "crypto",
      change: "+1.8%",
      coinGeckoId: "ethereum"
    },
    { 
      value: "BNB", 
      label: "Binance Coin (BNB)", 
      symbol: "BNB",
      type: "crypto",
      change: "-0.9%",
      coinGeckoId: "binancecoin"
    },
    { 
      value: "USD", 
      label: "US Dollar (USD)", 
      symbol: "$",
      type: "fiat",
      change: "0.0%",
      coinGeckoId: "usd"
    },
    { 
      value: "EUR", 
      label: "Euro (EUR)", 
      symbol: "€",
      type: "fiat",
      change: "+0.1%",
      coinGeckoId: "eur"
    },
    { 
      value: "RUB", 
      label: "Рубль (RUB)", 
      symbol: "₽",
      type: "fiat",
      change: "-0.3%",
      coinGeckoId: "rub"
    }
  ];

  // Функция для получения актуальных курсов с CoinGecko API
  const fetchCryptoRates = async () => {
    try {
      setUpdateError(false);
      const cryptoIds = currencies
        .filter(c => c.type === "crypto")
        .map(c => c.coinGeckoId)
        .join(',');
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd,eur,rub&include_24hr_change=true`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      // Преобразуем данные в нужный формат
      const newRates = {};
      
      // Заполняем курсы криптовалют
      Object.keys(data).forEach(coinId => {
        const currency = currencies.find(c => c.coinGeckoId === coinId);
        if (currency) {
          newRates[currency.value] = {
            USD: data[coinId].usd,
            EUR: data[coinId].eur,
            RUB: data[coinId].rub,
            change24h: data[coinId].usd_24h_change || 0
          };
        }
      });
      
      // Добавляем обратные курсы для фиатных валют
      newRates.USD = {
        BTC: newRates.BTC ? 1 / newRates.BTC.USD : 0,
        ETH: newRates.ETH ? 1 / newRates.ETH.USD : 0,
        BNB: newRates.BNB ? 1 / newRates.BNB.USD : 0,
        EUR: 0.92, // Примерный курс EUR/USD
        RUB: 92    // Примерный курс RUB/USD
      };
      
      newRates.EUR = {
        BTC: newRates.BTC ? 1 / newRates.BTC.EUR : 0,
        ETH: newRates.ETH ? 1 / newRates.ETH.EUR : 0,
        BNB: newRates.BNB ? 1 / newRates.BNB.EUR : 0,
        USD: 1.09,
        RUB: 100
      };
      
      newRates.RUB = {
        BTC: newRates.BTC ? 1 / newRates.BTC.RUB : 0,
        ETH: newRates.ETH ? 1 / newRates.ETH.RUB : 0,
        BNB: newRates.BNB ? 1 / newRates.BNB.RUB : 0,
        USD: 0.0109,
        EUR: 0.01
      };
      
      // Добавляем курсы крипта к крипте
      if (newRates.BTC && newRates.ETH) {
        newRates.BTC.ETH = newRates.BTC.USD / newRates.ETH.USD;
        newRates.ETH.BTC = newRates.ETH.USD / newRates.BTC.USD;
      }
      if (newRates.BTC && newRates.BNB) {
        newRates.BTC.BNB = newRates.BTC.USD / newRates.BNB.USD;
        newRates.BNB.BTC = newRates.BNB.USD / newRates.BTC.USD;
      }
      if (newRates.ETH && newRates.BNB) {
        newRates.ETH.BNB = newRates.ETH.USD / newRates.BNB.USD;
        newRates.BNB.ETH = newRates.BNB.USD / newRates.ETH.USD;
      }
      
      setRates(newRates);
      setLastUpdate(new Date());
      setIsOnline(true);
      
      // Обновляем изменения цен в currencies
      currencies.forEach(currency => {
        if (currency.type === "crypto" && newRates[currency.value]) {
          const change = newRates[currency.value].change24h;
          currency.change = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        }
      });
      
    } catch (error) {
      console.error('Ошибка получения курсов:', error);
      setUpdateError(true);
      setIsOnline(false);
      
      // Используем резервные курсы при ошибке
      const fallbackRates = {
        BTC: { USD: 65000, EUR: 60000, RUB: 6000000, ETH: 18.5, BNB: 95.2 },
        ETH: { USD: 3500, EUR: 3200, RUB: 320000, BTC: 0.054, BNB: 5.1 },
        BNB: { USD: 680, EUR: 620, RUB: 62000, BTC: 0.0105, ETH: 0.196 },
        USD: { BTC: 0.0000154, ETH: 0.000286, BNB: 0.00147, EUR: 0.92, RUB: 92 },
        EUR: { BTC: 0.0000167, ETH: 0.000313, BNB: 0.00161, USD: 1.09, RUB: 100 },
        RUB: { BTC: 0.000000167, ETH: 0.00000313, BNB: 0.0000161, USD: 0.0109, EUR: 0.01 }
      };
      setRates(fallbackRates);
    }
  };

  // Автообновление курсов каждые 2 минуты
  useEffect(() => {
    fetchCryptoRates(); // Загружаем курсы при монтировании компонента
    
    const interval = setInterval(() => {
      fetchCryptoRates();
    }, 120000); // 120000 мс = 2 минуты
    
    return () => clearInterval(interval);
  }, []);

  const calculateConversion = useCallback(async () => {
    if (!amount || !fromCurrency || !toCurrency) return;

    setLoading(true);
    
    const amt = parseFloat(amount);
    if (amt <= 0) {
      setLoading(false);
      return;
    }

    let rate = 1;
    if (fromCurrency === toCurrency) {
      rate = 1;
    } else if (rates[fromCurrency] && rates[fromCurrency][toCurrency]) {
      rate = rates[fromCurrency][toCurrency];
    } else {
      // Конвертация через USD если прямого курса нет
      const fromToUSD = rates[fromCurrency]?.USD || 1;
      const USDToTo = rates.USD?.[toCurrency] || 1;
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
  }, [amount, fromCurrency, toCurrency, rates]);

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
              <CardTitle className="text-2xl flex items-center gap-2">
                Конвертер криптовалют
                {isOnline ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                Перевод между криптовалютами и фиатными валютами
                {lastUpdate && (
                  <Badge variant="outline" className="text-xs">
                    {isOnline ? 'Обновлено' : 'Офлайн режим'}: {lastUpdate.toLocaleTimeString('ru-RU')}
                  </Badge>
                )}
                {updateError && (
                  <Badge variant="destructive" className="text-xs">
                    Используются резервные курсы
                  </Badge>
                )}
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

            <div className="flex gap-2">
              <Button 
                onClick={calculateConversion} 
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-lg py-6"
              >
                {loading ? (
                  <RefreshCcw className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Calculator className="w-5 h-5 mr-2" />
                )}
                {loading ? "Конвертация..." : "Конвертировать"}
              </Button>
              
              <Button 
                onClick={fetchCryptoRates}
                variant="outline"
                size="lg"
                className="px-4"
                title="Обновить курсы"
              >
                <RefreshCcw className="w-5 h-5" />
              </Button>
            </div>
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
          <CardTitle className="flex items-center justify-between">
            Курсы популярных валют
            <Badge variant="outline" className="text-xs">
              {isOnline ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Онлайн
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Офлайн
                </div>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { pair: "BTC/USD", from: "BTC", to: "USD", flag: "₿→$" },
              { pair: "ETH/USD", from: "ETH", to: "USD", flag: "Ξ→$" },
              { pair: "BNB/USD", from: "BNB", to: "USD", flag: "BNB→$" },
              { pair: "BTC/RUB", from: "BTC", to: "RUB", flag: "₿→₽" },
              { pair: "ETH/RUB", from: "ETH", to: "RUB", flag: "Ξ→₽" },
              { pair: "BTC/ETH", from: "BTC", to: "ETH", flag: "₿→Ξ" }
            ].map((item, index) => {
              const rate = rates[item.from]?.[item.to];
              const change = rates[item.from]?.change24h;
              
              return (
                <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">{item.flag}</p>
                  <p className="font-semibold text-sm">{item.pair}</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {rate ? formatNumber(rate, item.to === 'USD' ? 0 : 8) : '...'}
                  </p>
                  {change && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${change > 0 ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'}`}
                    >
                      {change > 0 ? '+' : ''}{change.toFixed(1)}%
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
          
          {lastUpdate && (
            <div className="mt-4 text-center">
              <Badge variant="secondary" className="text-xs">
                Последнее обновление: {lastUpdate.toLocaleString('ru-RU')} • Автообновление каждые 2 минуты
              </Badge>
            </div>
          )}
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
            <h4 className="font-semibold text-yellow-800 mb-2">📊 Важная информация:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Курсы обновляются автоматически каждые 2 минуты из CoinGecko API</li>
              <li>• Отображаются изменения цен за последние 24 часа</li>
              <li>• При отсутствии интернета используются резервные курсы</li>
              <li>• Банки и обменники берут комиссию за конвертацию</li>
              <li>• Курсы могут значительно колебаться в течение дня</li>
              <li>• Для крупных сумм проверяйте актуальные курсы у банков</li>
            </ul>
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