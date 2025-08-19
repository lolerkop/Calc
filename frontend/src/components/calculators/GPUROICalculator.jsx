import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { MonitorSpeaker, Calculator, TrendingUp, AlertCircle } from "lucide-react";

const GPUROICalculator = () => {
  const [gpuModel, setGpuModel] = useState("RTX3080");
  const [gpuPrice, setGpuPrice] = useState("");
  const [hashrate, setHashrate] = useState("");
  const [powerConsumption, setPowerConsumption] = useState("");
  const [electricityCost, setElectricityRate] = useState("");
  const [cryptoPrice, setCryptoPrice] = useState("");
  const [dailyRevenue, setDailyRevenue] = useState("");
  const [result, setResult] = useState(null);

  const gpuModels = [
    {
      value: "RTX4090",
      label: "NVIDIA RTX 4090",
      typicalHashrate: 125,
      typicalPower: 450,
      msrp: 180000,
      category: "High-end"
    },
    {
      value: "RTX4080",
      label: "NVIDIA RTX 4080",
      typicalHashrate: 95,
      typicalPower: 320,
      msrp: 140000,
      category: "High-end"
    },
    {
      value: "RTX3080",
      label: "NVIDIA RTX 3080",
      typicalHashrate: 100,
      typicalPower: 320,
      msrp: 80000,
      category: "High-end"
    },
    {
      value: "RTX3070",
      label: "NVIDIA RTX 3070",
      typicalHashrate: 62,
      typicalPower: 220,
      msrp: 60000,
      category: "Mid-range"
    },
    {
      value: "RX6800XT",
      label: "AMD RX 6800 XT",
      typicalHashrate: 65,
      typicalPower: 300,
      msrp: 70000,
      category: "High-end"
    },
    {
      value: "RX6700XT",
      label: "AMD RX 6700 XT",
      typicalHashrate: 47,
      typicalPower: 230,
      msrp: 50000,
      category: "Mid-range"
    }
  ];

  const setTypicalValues = (model) => {
    const gpu = gpuModels.find(g => g.value === model);
    if (gpu) {
      setHashrate(gpu.typicalHashrate.toString());
      setPowerConsumption(gpu.typicalPower.toString());
      setGpuPrice(gpu.msrp.toString());
    }
  };

  const calculateROI = useCallback(() => {
    const price = parseFloat(gpuPrice);
    const hr = parseFloat(hashrate);
    const power = parseFloat(powerConsumption);
    const elecCost = parseFloat(electricityCost);
    const revenue = parseFloat(dailyRevenue);

    if (!price || !hr || !power || !elecCost || !revenue || 
        price <= 0 || hr <= 0 || power <= 0 || elecCost < 0 || revenue <= 0) return;

    const selectedGPU = gpuModels.find(g => g.value === gpuModel);

    // Calculate daily costs
    const dailyPowerConsumption = (power * 24) / 1000; // kWh
    const dailyElectricityCost = dailyPowerConsumption * elecCost;
    const dailyProfit = revenue - dailyElectricityCost;

    // Calculate break-even
    const breakEvenDays = dailyProfit > 0 ? price / dailyProfit : Infinity;
    const breakEvenMonths = breakEvenDays / 30.44;
    const breakEvenYears = breakEvenDays / 365;

    // Calculate profit projections
    const monthlyProfit = dailyProfit * 30.44;
    const yearlyProfit = dailyProfit * 365;

    // Calculate efficiency metrics
    const hashratePerWatt = hr / power;
    const hashratePerRuble = hr / price;
    const profitPerWatt = dailyProfit / power;
    const profitMargin = revenue > 0 ? (dailyProfit / revenue) * 100 : 0;

    // Calculate depreciation (assuming 20% per year for GPUs)
    const annualDepreciationRate = 0.2;
    const dailyDepreciation = (price * annualDepreciationRate) / 365;
    const netDailyProfit = dailyProfit - dailyDepreciation;

    // Calculate resale scenarios
    const resaleAfter1Year = price * (1 - annualDepreciationRate);
    const resaleAfter2Years = price * Math.pow(1 - annualDepreciationRate, 2);

    setResult({
      gpuModel: selectedGPU,
      gpuPrice: price,
      hashrate: hr,
      powerConsumption: power,
      electricityCost: elecCost,
      dailyRevenue: revenue,
      dailyElectricityCost: dailyElectricityCost,
      dailyProfit: dailyProfit,
      monthlyProfit: monthlyProfit,
      yearlyProfit: yearlyProfit,
      breakEvenDays: breakEvenDays,
      breakEvenMonths: breakEvenMonths,
      breakEvenYears: breakEvenYears,
      hashratePerWatt: hashratePerWatt,
      hashratePerRuble: hashratePerRuble,
      profitPerWatt: profitPerWatt,
      profitMargin: profitMargin,
      dailyDepreciation: dailyDepreciation,
      netDailyProfit: netDailyProfit,
      resaleAfter1Year: resaleAfter1Year,
      resaleAfter2Years: resaleAfter2Years,
      dailyPowerConsumption: dailyPowerConsumption,
      isProfiTable: dailyProfit > 0,
      paybackPeriod: breakEvenDays <= 365 ? "Fast" : breakEvenDays <= 730 ? "Moderate" : "Slow"
    });
  }, [gpuModel, gpuPrice, hashrate, powerConsumption, electricityCost, dailyRevenue]);

  const formatNumber = (num, decimals = 2) => {
    if (!isFinite(num)) return "∞";
    return new Intl.NumberFormat('ru-RU', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    }).format(num);
  };

  const formatDays = (days) => {
    if (!isFinite(days)) return "Никогда";
    if (days < 30) return `${Math.round(days)} дней`;
    if (days < 365) return `${Math.round(days / 30.44)} мес.`;
    return `${(days / 365).toFixed(1)} лет`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
              <MonitorSpeaker className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор окупаемости видеокарт</CardTitle>
              <CardDescription>
                Расчет ROI и срока окупаемости GPU для майнинга
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Модель видеокарты</Label>
              <Select 
                value={gpuModel} 
                onValueChange={(value) => {
                  setGpuModel(value);
                  setTypicalValues(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gpuModels.map((gpu) => (
                    <SelectItem key={gpu.value} value={gpu.value}>
                      <div className="flex items-center justify-between w-full gap-2">
                        <span>{gpu.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {gpu.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpuPrice">Цена видеокарты (₽)</Label>
              <Input
                id="gpuPrice"
                type="number"
                placeholder="80000"
                value={gpuPrice}
                onChange={(e) => setGpuPrice(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-gray-500">
                MSRP: {gpuModels.find(g => g.value === gpuModel)?.msrp.toLocaleString('ru-RU')} ₽
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hashrate">Хешрейт (MH/s)</Label>
              <Input
                id="hashrate"
                type="number"
                placeholder="100"
                value={hashrate}
                onChange={(e) => setHashrate(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-gray-500">
                Типичный: {gpuModels.find(g => g.value === gpuModel)?.typicalHashrate} MH/s
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="powerConsumption">Потребление энергии (Вт)</Label>
              <Input
                id="powerConsumption"
                type="number"
                placeholder="320"
                value={powerConsumption}
                onChange={(e) => setPowerConsumption(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="electricityCost">Стоимость электричества (₽/кВт⋅ч)</Label>
              <Input
                id="electricityCost"
                type="number"
                step="0.01"
                placeholder="5.50"
                value={electricityCost}
                onChange={(e) => setElectricityRate(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyRevenue">Дневной доход от майнинга (₽)</Label>
              <Input
                id="dailyRevenue"
                type="number"
                step="0.01"
                placeholder="300"
                value={dailyRevenue}
                onChange={(e) => setDailyRevenue(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-gray-500">
                Доход до вычета электричества
              </p>
            </div>

            <Button 
              onClick={calculateROI} 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать окупаемость
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Анализ окупаемости
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Срок окупаемости</p>
                      <p className={`text-3xl font-bold ${result.isProfiTable ? 'text-green-600' : 'text-red-600'}`}>
                        {formatDays(result.breakEvenDays)}
                      </p>
                      <Badge 
                        variant={result.paybackPeriod === "Fast" ? "default" : result.paybackPeriod === "Moderate" ? "secondary" : "destructive"}
                        className="mt-2"
                      >
                        {result.paybackPeriod === "Fast" ? "Быстрая" : result.paybackPeriod === "Moderate" ? "Умеренная" : "Медленная"} окупаемость
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-sm text-gray-600">Дневная прибыль</p>
                        <p className={`text-lg font-semibold ${result.dailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.dailyProfit >= 0 ? '+' : ''}{formatNumber(result.dailyProfit)} ₽
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-sm text-gray-600">Месячная прибыль</p>
                        <p className={`text-lg font-semibold ${result.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.monthlyProfit >= 0 ? '+' : ''}{formatNumber(result.monthlyProfit)} ₽
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Годовая прибыль</p>
                      <p className={`text-2xl font-bold ${result.yearlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.yearlyProfit >= 0 ? '+' : ''}{formatNumber(result.yearlyProfit)} ₽
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Маржа прибыли: {result.profitMargin.toFixed(1)}%
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded p-2 border border-blue-200 text-center">
                        <p className="text-xs text-gray-600">Эффективность</p>
                        <p className="font-semibold text-sm">
                          {result.hashratePerWatt.toFixed(2)} MH/Вт
                        </p>
                      </div>
                      <div className="bg-white rounded p-2 border border-blue-200 text-center">
                        <p className="text-xs text-gray-600">Прибыль/Вт</p>
                        <p className="font-semibold text-sm">
                          {result.profitPerWatt.toFixed(3)} ₽/Вт
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                      <p><strong>Модель:</strong> {result.gpuModel.label}</p>
                      <p><strong>Потребление:</strong> {formatNumber(result.dailyPowerConsumption)} кВт⋅ч/день</p>
                      <p><strong>Стоимость электричества:</strong> {formatNumber(result.dailyElectricityCost)} ₽/день</p>
                      <p><strong>Хешрейт/₽:</strong> {result.hashratePerRuble.toFixed(4)} MH/₽</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Depreciation Analysis */}
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      Анализ амортизации
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-white rounded p-3 border border-amber-200">
                      <p className="text-sm text-gray-600">Чистая прибыль (с учетом амортизации)</p>
                      <p className={`font-semibold ${result.netDailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.netDailyProfit >= 0 ? '+' : ''}{formatNumber(result.netDailyProfit)} ₽/день
                      </p>
                      <p className="text-xs text-gray-500">
                        Амортизация: -{formatNumber(result.dailyDepreciation)} ₽/день
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded p-2 border border-amber-200 text-center">
                        <p className="text-xs text-gray-600">Стоимость через год</p>
                        <p className="font-semibold text-sm">
                          {formatNumber(result.resaleAfter1Year)} ₽
                        </p>
                      </div>
                      <div className="bg-white rounded p-2 border border-amber-200 text-center">
                        <p className="text-xs text-gray-600">Стоимость через 2 года</p>
                        <p className="font-semibold text-sm">
                          {formatNumber(result.resaleAfter2Years)} ₽
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <MonitorSpeaker className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите параметры видеокарты и майнинга
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* GPU Comparison */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Сравнение популярных GPU для майнинга</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Модель</th>
                  <th className="text-right p-2">Хешрейт</th>
                  <th className="text-right p-2">Потребление</th>
                  <th className="text-right p-2">Эффективность</th>
                  <th className="text-right p-2">MSRP</th>
                </tr>
              </thead>
              <tbody>
                {gpuModels.map((gpu) => (
                  <tr key={gpu.value} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <span className="font-medium">{gpu.label}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {gpu.category}
                        </Badge>
                      </div>
                    </td>
                    <td className="text-right p-2">{gpu.typicalHashrate} MH/s</td>
                    <td className="text-right p-2">{gpu.typicalPower} Вт</td>
                    <td className="text-right p-2">{(gpu.typicalHashrate / gpu.typicalPower).toFixed(2)} MH/Вт</td>
                    <td className="text-right p-2">{gpu.msrp.toLocaleString('ru-RU')} ₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Факторы окупаемости видеокарт</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Основные факторы</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Хешрейт:</strong> производительность майнинга</li>
                <li><strong>Энергоэффективность:</strong> MH/s на ватт</li>
                <li><strong>Цена покупки:</strong> первоначальные инвестиции</li>
                <li><strong>Стоимость электричества:</strong> основные расходы</li>
                <li><strong>Доходность майнинга:</strong> зависит от курса крипты</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Дополнительные расходы</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Риг/система:</strong> материнская плата, процессор</li>
                <li><strong>Охлаждение:</strong> вентиляторы, кондиционирование</li>
                <li><strong>Амортизация:</strong> износ оборудования</li>
                <li><strong>Обслуживание:</strong> замена термопасты, ремонт</li>
                <li><strong>Комиссии пула:</strong> обычно 1-3%</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Советы по выбору GPU:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Учитывайте не только цену покупки, но и энергоэффективность</li>
              <li>• Рассматривайте перспективы перепродажи видеокарты</li>
              <li>• Следите за изменениями в алгоритмах майнинга</li>
              <li>• Диверсифицируйте риски между разными GPU и криптовалютами</li>
              <li>• Регулярно пересчитывайте окупаемость при изменении курсов</li>
              <li>• Учитывайте сложность сети и будущие обновления протоколов</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GPUROICalculator;