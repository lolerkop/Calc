import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Pickaxe, Calculator, Zap, TrendingUp } from "lucide-react";

const MiningCalculator = () => {
  const [hashrate, setHashrate] = useState("");
  const [hashrateUnit, setHashrateUnit] = useState("MH/s");
  const [powerConsumption, setPowerConsumption] = useState("");
  const [electricityCost, setElectricityCost] = useState("");
  const [cryptocurrency, setCryptocurrency] = useState("ETH");
  const [poolFee, setPoolFee] = useState("1");
  const [result, setResult] = useState(null);

  const hashrateUnits = [
    { value: "H/s", label: "H/s", multiplier: 1 },
    { value: "KH/s", label: "KH/s", multiplier: 1000 },
    { value: "MH/s", label: "MH/s", multiplier: 1000000 },
    { value: "GH/s", label: "GH/s", multiplier: 1000000000 },
    { value: "TH/s", label: "TH/s", multiplier: 1000000000000 }
  ];

  const cryptocurrencies = [
    { 
      value: "ETH", 
      label: "Ethereum (ETH)", 
      blockReward: 2.0, 
      blockTime: 13.5, // seconds
      networkHashrate: 950000000, // MH/s
      price: 2500,
      algorithm: "Ethash"
    },
    { 
      value: "BTC", 
      label: "Bitcoin (BTC)", 
      blockReward: 6.25, 
      blockTime: 600, // seconds
      networkHashrate: 450000000, // GH/s converted to MH/s
      price: 65000,
      algorithm: "SHA-256"
    },
    { 
      value: "LTC", 
      label: "Litecoin (LTC)", 
      blockReward: 12.5, 
      blockTime: 150, // seconds
      networkHashrate: 750000, // MH/s
      price: 90,
      algorithm: "Scrypt"
    },
    { 
      value: "XMR", 
      label: "Monero (XMR)", 
      blockReward: 0.65, 
      blockTime: 120, // seconds
      networkHashrate: 2700, // MH/s
      price: 160,
      algorithm: "RandomX"
    }
  ];

  const calculateMining = useCallback(() => {
    const hr = parseFloat(hashrate);
    const power = parseFloat(powerConsumption);
    const elecCost = parseFloat(electricityCost);
    const fee = parseFloat(poolFee) / 100;

    if (!hr || !power || !elecCost || hr <= 0 || power <= 0 || elecCost < 0) return;

    const selectedUnit = hashrateUnits.find(u => u.value === hashrateUnit);
    const selectedCrypto = cryptocurrencies.find(c => c.value === cryptocurrency);

    // Convert hashrate to base unit (H/s)
    const hashrateInBaseUnit = hr * selectedUnit.multiplier;
    
    // Convert to MH/s for calculations
    const hashrateInMHs = hashrateInBaseUnit / 1000000;

    // Calculate daily mining rewards
    const blocksPerDay = (24 * 60 * 60) / selectedCrypto.blockTime;
    const myHashratePercentage = hashrateInMHs / selectedCrypto.networkHashrate;
    const dailyBlocksFound = blocksPerDay * myHashratePercentage;
    const dailyRewardBeforeFees = dailyBlocksFound * selectedCrypto.blockReward;
    const dailyRewardAfterFees = dailyRewardBeforeFees * (1 - fee);

    // Calculate costs
    const dailyPowerConsumption = (power * 24) / 1000; // kWh
    const dailyElectricityCost = dailyPowerConsumption * elecCost;

    // Calculate profits
    const dailyRevenue = dailyRewardAfterFees * selectedCrypto.price;
    const dailyProfit = dailyRevenue - dailyElectricityCost;

    // Calculate monthly and yearly projections
    const monthlyProfit = dailyProfit * 30;
    const yearlyProfit = dailyProfit * 365;

    // Calculate break-even and ROI metrics
    const profitMargin = dailyRevenue > 0 ? (dailyProfit / dailyRevenue) * 100 : 0;

    setResult({
      hashrate: hr,
      hashrateUnit: hashrateUnit,
      powerConsumption: power,
      electricityCost: elecCost,
      cryptocurrency: selectedCrypto,
      poolFee: poolFee,
      dailyReward: dailyRewardAfterFees,
      dailyRevenue: dailyRevenue,
      dailyElectricityCost: dailyElectricityCost,
      dailyProfit: dailyProfit,
      monthlyProfit: monthlyProfit,
      yearlyProfit: yearlyProfit,
      dailyPowerConsumption: dailyPowerConsumption,
      profitMargin: profitMargin,
      hashratePercentage: myHashratePercentage * 100
    });
  }, [hashrate, hashrateUnit, powerConsumption, electricityCost, cryptocurrency, poolFee]);

  const formatNumber = (num, decimals = 2) => {
    return new Intl.NumberFormat('ru-RU', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    }).format(num);
  };

  const formatCrypto = (num, decimals = 6) => {
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    }).format(num);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-xl">
              <Pickaxe className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор майнинга</CardTitle>
              <CardDescription>
                Расчет прибыльности майнинга криптовалют
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Криптовалюта</Label>
              <Select value={cryptocurrency} onValueChange={setCryptocurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cryptocurrencies.map((crypto) => (
                    <SelectItem key={crypto.value} value={crypto.value}>
                      <div className="flex items-center gap-2">
                        <span>{crypto.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {crypto.algorithm}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hashrate">Хешрейт</Label>
                <Input
                  id="hashrate"
                  type="number"
                  placeholder="100"
                  value={hashrate}
                  onChange={(e) => setHashrate(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label>Единица</Label>
                <Select value={hashrateUnit} onValueChange={setHashrateUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hashrateUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="powerConsumption">Потребление энергии (Вт)</Label>
              <Input
                id="powerConsumption"
                type="number"
                placeholder="300"
                value={powerConsumption}
                onChange={(e) => setPowerConsumption(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="electricityCost">Стоимость электричества (за кВт⋅ч)</Label>
              <Input
                id="electricityCost"
                type="number"
                step="0.01"
                placeholder="5.50"
                value={electricityCost}
                onChange={(e) => setElectricityCost(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="poolFee">Комиссия пула (%)</Label>
              <Input
                id="poolFee"
                type="number"
                step="0.1"
                placeholder="1.0"
                value={poolFee}
                onChange={(e) => setPoolFee(e.target.value)}
              />
            </div>

            <Button 
              onClick={calculateMining} 
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать прибыльность
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-yellow-600" />
                      Прибыльность майнинга
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <p className="text-sm text-gray-600 mb-1">Дневная прибыль</p>
                      <p className={`text-3xl font-bold ${result.dailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.dailyProfit >= 0 ? '+' : ''}{formatNumber(result.dailyProfit)} ₽
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-yellow-200">
                        <p className="text-sm text-gray-600">Дневной доход</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatNumber(result.dailyRevenue)} ₽
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-yellow-200">
                        <p className="text-sm text-gray-600">Электричество</p>
                        <p className="text-lg font-semibold text-red-600">
                          -{formatNumber(result.dailyElectricityCost)} ₽
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <p className="text-sm text-gray-600 mb-1">Дневная добыча</p>
                      <p className="text-xl font-bold text-yellow-600">
                        {formatCrypto(result.dailyReward)} {result.cryptocurrency.value}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        ≈ ${formatNumber(result.dailyRevenue / 95)} USD
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-yellow-200">
                        <p className="text-sm text-gray-600">Месячная прибыль</p>
                        <p className={`text-lg font-semibold ${result.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.monthlyProfit >= 0 ? '+' : ''}{formatNumber(result.monthlyProfit)} ₽
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-yellow-200">
                        <p className="text-sm text-gray-600">Годовая прибыль</p>
                        <p className={`text-lg font-semibold ${result.yearlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.yearlyProfit >= 0 ? '+' : ''}{formatNumber(result.yearlyProfit)} ₽
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                      <p><strong>Хешрейт:</strong> {result.hashrate} {result.hashrateUnit}</p>
                      <p><strong>Потребление:</strong> {formatNumber(result.dailyPowerConsumption)} кВт⋅ч/день</p>
                      <p><strong>Маржа прибыли:</strong> {result.profitMargin.toFixed(1)}%</p>
                      <p><strong>Комиссия пула:</strong> {result.poolFee}%</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <Pickaxe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите параметры оборудования для расчета
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mining Hardware Examples */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Популярное оборудование для майнинга</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">ASIC майнеры</h4>
              <p className="text-sm text-blue-600 mb-2">Для Bitcoin (SHA-256)</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Antminer S19 Pro: 110 TH/s, 3250W</li>
                <li>• Whatsminer M30S++: 112 TH/s, 3472W</li>
                <li>• Высокая эффективность</li>
                <li>• Специализированные чипы</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Видеокарты (GPU)</h4>
              <p className="text-sm text-green-600 mb-2">Для Ethereum, Altcoins</p>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• RTX 3080: 100 MH/s, 320W</li>
                <li>• RX 6800 XT: 65 MH/s, 300W</li>
                <li>• Универсальность</li>
                <li>• Возможность перепродажи</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">CPU майнинг</h4>
              <p className="text-sm text-purple-600 mb-2">Для Monero (RandomX)</p>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• AMD Ryzen 9 5950X: 15 KH/s, 200W</li>
                <li>• Intel i9-12900K: 12 KH/s, 180W</li>
                <li>• Низкий порог входа</li>
                <li>• Используется обычный ПК</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>О майнинге криптовалют</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p>
            Майнинг — это процесс решения сложных математических задач для подтверждения 
            транзакций в блокчейне и получения вознаграждения в виде криптовалюты.
          </p>
          
          <h3>Факторы прибыльности:</h3>
          <ul>
            <li><strong>Хешрейт</strong> — вычислительная мощность оборудования</li>
            <li><strong>Сложность сети</strong> — автоматически регулируется протоколом</li>
            <li><strong>Цена криптовалюты</strong> — влияет на доходность напрямую</li>
            <li><strong>Стоимость электричества</strong> — основная статья расходов</li>
            <li><strong>Комиссии пула</strong> — обычно 1-3% от вознаграждения</li>
          </ul>

          <h3>Риски майнинга:</h3>
          <ul>
            <li>Волатильность цен криптовалют</li>
            <li>Рост сложности сети со временем</li>
            <li>Износ и устаревание оборудования</li>
            <li>Изменения в алгоритмах консенсуса</li>
            <li>Регулятивные риски</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-amber-800 mb-2">⚠️ Важные замечания:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Данные о ценах и сложности сети являются примерными</li>
              <li>• Реальная прибыльность может значительно отличаться</li>
              <li>• Учитывайте амортизацию оборудования и его стоимость</li>
              <li>• Майнинг требует технических знаний и постоянного мониторинга</li>
              <li>• Изучите налогообложение майнинга в вашей юрисдикции</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiningCalculator;