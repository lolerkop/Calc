import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { DollarSign, Calculator, RefreshCcw, TrendingUp, TrendingDown, Wifi, WifiOff, Clock } from "lucide-react";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("RUB");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);

  // Расширенный список валют
  const currencies = [
    // Основные валюты
    { value: "USD", label: "Доллар США (USD)", symbol: "$", flag: "🇺🇸", region: "Северная Америка" },
    { value: "EUR", label: "Евро (EUR)", symbol: "€", flag: "🇪🇺", region: "Европа" },
    { value: "RUB", label: "Российский рубль (RUB)", symbol: "₽", flag: "🇷🇺", region: "Россия" },
    { value: "GBP", label: "Фунт стерлингов (GBP)", symbol: "£", flag: "🇬🇧", region: "Великобритания" },
    { value: "JPY", label: "Японская иена (JPY)", symbol: "¥", flag: "🇯🇵", region: "Азия" },
    { value: "CNY", label: "Китайский юань (CNY)", symbol: "¥", flag: "🇨🇳", region: "Азия" },
    
    // Дополнительные популярные валюты
    { value: "CHF", label: "Швейцарский франк (CHF)", symbol: "Fr", flag: "🇨🇭", region: "Европа" },
    { value: "CAD", label: "Канадский доллар (CAD)", symbol: "C$", flag: "🇨🇦", region: "Северная Америка" },
    { value: "AUD", label: "Австралийский доллар (AUD)", symbol: "A$", flag: "🇦🇺", region: "Океания" },
    { value: "NZD", label: "Новозеландский доллар (NZD)", symbol: "NZ$", flag: "🇳🇿", region: "Океания" },
    { value: "SGD", label: "Сингапурский доллар (SGD)", symbol: "S$", flag: "🇸🇬", region: "Азия" },
    { value: "HKD", label: "Гонконгский доллар (HKD)", symbol: "HK$", flag: "🇭🇰", region: "Азия" },
    
    // Скандинавские валюты
    { value: "SEK", label: "Шведская крона (SEK)", symbol: "kr", flag: "🇸🇪", region: "Скандинавия" },
    { value: "NOK", label: "Норвежская крона (NOK)", symbol: "kr", flag: "🇳🇴", region: "Скандинавия" },
    { value: "DKK", label: "Датская крона (DKK)", symbol: "kr", flag: "🇩🇰", region: "Скандинавия" },
    
    // Восточная Европа
    { value: "PLN", label: "Польский злотый (PLN)", symbol: "zł", flag: "🇵🇱", region: "Восточная Европа" },
    { value: "CZK", label: "Чешская крона (CZK)", symbol: "Kč", flag: "🇨🇿", region: "Восточная Европа" },
    { value: "HUF", label: "Венгерский форинт (HUF)", symbol: "Ft", flag: "🇭🇺", region: "Восточная Европа" },
    
    // Азиатские валюты
    { value: "KRW", label: "Южнокорейская вона (KRW)", symbol: "₩", flag: "🇰🇷", region: "Азия" },
    { value: "INR", label: "Индийская рупия (INR)", symbol: "₹", flag: "🇮🇳", region: "Азия" },
    { value: "THB", label: "Тайский бат (THB)", symbol: "฿", flag: "🇹🇭", region: "Азия" },
    
    // Латинская Америка
    { value: "BRL", label: "Бразильский реал (BRL)", symbol: "R$", flag: "🇧🇷", region: "Латинская Америка" },
    { value: "MXN", label: "Мексиканское песо (MXN)", symbol: "MX$", flag: "🇲🇽", region: "Латинская Америка" },
    { value: "ARS", label: "Аргентинское песо (ARS)", symbol: "AR$", flag: "🇦🇷", region: "Латинская Америка" },
    
    // Ближний Восток и Африка
    { value: "AED", label: "Дирхам ОАЭ (AED)", symbol: "د.إ", flag: "🇦🇪", region: "Ближний Восток" },
    { value: "SAR", label: "Саудовский риал (SAR)", symbol: "﷼", flag: "🇸🇦", region: "Ближний Восток" },
    { value: "TRY", label: "Турецкая лира (TRY)", symbol: "₺", flag: "🇹🇷", region: "Ближний Восток" },
    { value: "ZAR", label: "Южноафриканский ранд (ZAR)", symbol: "R", flag: "🇿🇦", region: "Африка" }
  ];

  // Резервные курсы для офлайн режима
  const fallbackRates = {
    USD: { EUR: 0.92, RUB: 92.50, GBP: 0.79, JPY: 149.50, CNY: 7.24, CHF: 0.88, CAD: 1.35, AUD: 1.52, NZD: 1.64, SGD: 1.35, HKD: 7.78, SEK: 10.85, NOK: 10.95, DKK: 6.86, PLN: 4.05, CZK: 22.85, HUF: 360.25, KRW: 1328.50, INR: 83.15, THB: 35.75, BRL: 5.02, MXN: 17.25, ARS: 875.50, AED: 3.67, SAR: 3.75, TRY: 27.85, ZAR: 18.75 },
    EUR: { USD: 1.09, RUB: 100.80, GBP: 0.86, JPY: 163.20, CNY: 7.89, CHF: 0.96, CAD: 1.47, AUD: 1.66, NZD: 1.79, SGD: 1.47, HKD: 8.48, SEK: 11.82, NOK: 11.94, DKK: 7.47, PLN: 4.42, CZK: 24.91, HUF: 392.67, KRW: 1448.07, INR: 90.63, THB: 39.01, BRL: 5.47, MXN: 18.80, ARS: 954.35, AED: 4.00, SAR: 4.09, TRY: 30.37, ZAR: 20.44 },
    RUB: { USD: 0.0108, EUR: 0.0099, GBP: 0.0085, JPY: 1.62, CNY: 0.078, CHF: 0.0095, CAD: 0.0146, AUD: 0.0164, NZD: 0.0177, SGD: 0.0146, HKD: 0.084, SEK: 0.117, NOK: 0.118, DKK: 0.074, PLN: 0.0437, CZK: 0.247, HUF: 3.89, KRW: 14.36, INR: 0.899, THB: 0.387, BRL: 0.0543, MXN: 0.187, ARS: 9.47, AED: 0.0397, SAR: 0.0406, TRY: 0.301, ZAR: 0.203 }
  };

  // Получение курсов валют
  const fetchRates = async () => {
    try {
      setConnectionStatus('fetching');
      
      // Используем exchangerate-api.com (бесплатный лимит 1500 запросов в месяц)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) {
        throw new Error('API недоступно');
      }
      
      const data = await response.json();
      
      if (data.rates) {
        setRates(data.rates);
        setLastUpdated(new Date());
        setConnectionStatus('online');
        console.log('✅ Курсы валют обновлены через API');
      } else {
        throw new Error('Некорректные данные');
      }
    } catch (error) {
      console.warn('⚠️ Ошибка при получении курсов валют:', error.message);
      setRates(fallbackRates.USD);
      setLastUpdated(new Date());
      setConnectionStatus('fallback');
    }
  };

  // Автоматическое обновление курсов
  useEffect(() => {
    fetchRates();
    
    if (autoUpdateEnabled) {
      const interval = setInterval(() => {
        fetchRates();
      }, 5 * 60 * 1000); // обновляем каждые 5 минут
      
      return () => clearInterval(interval);
    }
  }, [autoUpdateEnabled]);

  const convertCurrency = useCallback(async () => {
    if (!amount || !fromCurrency || !toCurrency) return;

    setLoading(true);
    
    // Небольшая задержка для UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const amt = parseFloat(amount);
    if (amt <= 0) {
      setLoading(false);
      return;
    }

    let rate = 1;
    
    if (fromCurrency === toCurrency) {
      rate = 1;
    } else if (fromCurrency === 'USD' && rates[toCurrency]) {
      // Конвертация из USD
      rate = rates[toCurrency];
    } else if (toCurrency === 'USD' && rates[fromCurrency]) {
      // Конвертация в USD
      rate = 1 / rates[fromCurrency];
    } else if (rates[fromCurrency] && rates[toCurrency]) {
      // Конвертация через USD
      rate = rates[toCurrency] / rates[fromCurrency];
    } else {
      // Используем резервные курсы
      if (fallbackRates[fromCurrency] && fallbackRates[fromCurrency][toCurrency]) {
        rate = fallbackRates[fromCurrency][toCurrency];
      }
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
      timestamp: new Date().toLocaleString('ru-RU'),
      source: connectionStatus
    });

    setLoading(false);
  }, [amount, fromCurrency, toCurrency, rates, connectionStatus]);

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

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'online': return <Wifi className="w-4 h-4 text-green-500" />;
      case 'fallback': return <WifiOff className="w-4 h-4 text-orange-500" />;
      case 'fetching': return <RefreshCcw className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'online': return 'Курсы актуальны';
      case 'fallback': return 'Резервные курсы';
      case 'fetching': return 'Обновление...';
      default: return 'Проверка...';
    }
  };

  const groupedCurrencies = currencies.reduce((groups, currency) => {
    const region = currency.region;
    if (!groups[region]) groups[region] = [];
    groups[region].push(currency);
    return groups;
  }, {});

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
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
            
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm text-gray-600">{getStatusText()}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRates}
                disabled={connectionStatus === 'fetching'}
              >
                <RefreshCcw className={`w-4 h-4 ${connectionStatus === 'fetching' ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          {lastUpdated && (
            <div className="text-xs text-gray-500 mt-2">
              Последнее обновление: {lastUpdated.toLocaleString('ru-RU')}
            </div>
          )}
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
                <SelectContent className="max-h-[300px]">
                  {Object.entries(groupedCurrencies).map(([region, currencies]) => (
                    <div key={region}>
                      <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">
                        {region}
                      </div>
                      {currencies.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          <div className="flex items-center gap-2">
                            <span>{curr.flag}</span>
                            <span>{curr.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
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
                <SelectContent className="max-h-[300px]">
                  {Object.entries(groupedCurrencies).map(([region, currencies]) => (
                    <div key={region}>
                      <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">
                        {region}
                      </div>
                      {currencies.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          <div className="flex items-center gap-2">
                            <span>{curr.flag}</span>
                            <span>{curr.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
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
                      <p className="mt-1 flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            result.source === 'online' ? 'text-green-600' : 
                            result.source === 'fallback' ? 'text-orange-600' : 'text-gray-600'
                          }`}
                        >
                          {result.source === 'online' ? 'Актуальные курсы' : 
                           result.source === 'fallback' ? 'Резервные курсы' : 'Курсы'}
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
              { pair: "USD/RUB", from: "USD", to: "RUB", flag: "🇺🇸→🇷🇺" },
              { pair: "EUR/RUB", from: "EUR", to: "RUB", flag: "🇪🇺→🇷🇺" },
              { pair: "EUR/USD", from: "EUR", to: "USD", flag: "🇪🇺→🇺🇸" },
              { pair: "GBP/USD", from: "GBP", to: "USD", flag: "🇬🇧→🇺🇸" },
              { pair: "USD/CNY", from: "USD", to: "CNY", flag: "🇺🇸→🇨🇳" },
              { pair: "USD/JPY", from: "USD", to: "JPY", flag: "🇺🇸→🇯🇵" }
            ].map((item, index) => {
              let rate = "—";
              if (rates && Object.keys(rates).length > 0) {
                if (item.from === 'USD' && rates[item.to]) {
                  rate = formatNumber(rates[item.to], 2);
                } else if (item.to === 'USD' && rates[item.from]) {
                  rate = formatNumber(1 / rates[item.from], 4);
                } else if (rates[item.from] && rates[item.to]) {
                  rate = formatNumber(rates[item.to] / rates[item.from], 4);
                } else if (fallbackRates.USD[item.to]) {
                  rate = formatNumber(fallbackRates.USD[item.to], 2);
                }
              }
              
              return (
                <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">{item.flag}</p>
                  <p className="font-semibold text-sm">{item.pair}</p>
                  <p className="text-lg font-bold text-green-600">{rate}</p>
                  <Badge variant="outline" className="text-xs text-gray-500">
                    {connectionStatus === 'online' ? 'Live' : 'Cached'}
                  </Badge>
                </div>
              );
            })}
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
              <h3 className="text-lg font-semibold mb-3">Поддерживаемые регионы</h3>
              <div className="space-y-2 text-sm">
                <p><strong>🌍 Европа:</strong> EUR, GBP, CHF, SEK, NOK, DKK, PLN, CZK, HUF, TRY</p>
                <p><strong>🌏 Азия:</strong> JPY, CNY, SGD, HKD, KRW, INR, THB</p>
                <p><strong>🌎 Америка:</strong> USD, CAD, BRL, MXN, ARS</p>
                <p><strong>🌊 Океания:</strong> AUD, NZD</p>
                <p><strong>🏜️ Ближний Восток:</strong> AED, SAR</p>
                <p><strong>🦁 Африка:</strong> ZAR</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Особенности работы</h3>
              <div className="space-y-2 text-sm">
                <p><strong>🔄 Автообновление:</strong> курсы обновляются каждые 5 минут</p>
                <p><strong>🌐 Реальные данные:</strong> курсы получаются через API</p>
                <p><strong>💾 Офлайн режим:</strong> резервные курсы при недоступности API</p>
                <p><strong>🎯 Точность:</strong> расчеты до 4 знаков после запятой</p>
                <p><strong>⚡ Быстрота:</strong> мгновенная конвертация</p>
                <p><strong>🔒 Надежность:</strong> проверенные источники данных</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Важная информация:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Курсы валют обновляются в реальном времени через внешний API</li>
              <li>• При недоступности интернета используются сохраненные резервные курсы</li>
              <li>• Банки и обменники берут комиссию за конвертацию (обычно 1-3%)</li>
              <li>• Курсы могут значительно колебаться в течение дня</li>
              <li>• Для крупных сумм всегда проверяйте актуальные курсы у банков</li>
              <li>• Калькулятор предоставляет справочную информацию</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyConverter;