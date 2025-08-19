import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Coins, Calculator, TrendingUp, Percent } from "lucide-react";

const StakingCalculator = () => {
  const [stakingAmount, setStakingAmount] = useState("");
  const [stakingPeriod, setStakingPeriod] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [cryptocurrency, setCryptocurrency] = useState("ETH");
  const [compoundFrequency, setCompoundFrequency] = useState("daily");
  const [validatorFee, setValidatorFee] = useState("10");
  const [result, setResult] = useState(null);

  const cryptocurrencies = [
    { 
      value: "ETH", 
      label: "Ethereum 2.0 (ETH)", 
      typicalAPR: 5.2,
      minStake: 32,
      price: 2500,
      symbol: "ETH"
    },
    { 
      value: "ADA", 
      label: "Cardano (ADA)", 
      typicalAPR: 4.8,
      minStake: 1,
      price: 0.5,
      symbol: "ADA"
    },
    { 
      value: "DOT", 
      label: "Polkadot (DOT)", 
      typicalAPR: 12.5,
      minStake: 1,
      price: 7.5,
      symbol: "DOT"
    },
    { 
      value: "ATOM", 
      label: "Cosmos (ATOM)", 
      typicalAPR: 18.7,
      minStake: 1,
      price: 12,
      symbol: "ATOM"
    },
    { 
      value: "AVAX", 
      label: "Avalanche (AVAX)", 
      typicalAPR: 9.2,
      minStake: 25,
      price: 40,
      symbol: "AVAX"
    },
    { 
      value: "SOL", 
      label: "Solana (SOL)", 
      typicalAPR: 7.1,
      minStake: 1,
      price: 100,
      symbol: "SOL"
    }
  ];

  const compoundFrequencies = [
    { value: "daily", label: "Ежедневно", periodsPerYear: 365 },
    { value: "weekly", label: "Еженедельно", periodsPerYear: 52 },
    { value: "monthly", label: "Ежемесячно", periodsPerYear: 12 },
    { value: "quarterly", label: "Ежеквартально", periodsPerYear: 4 },
    { value: "annually", label: "Ежегодно", periodsPerYear: 1 }
  ];

  const calculateStaking = useCallback(() => {
    const amount = parseFloat(stakingAmount);
    const period = parseFloat(stakingPeriod);
    const rate = parseFloat(annualRate) / 100;
    const fee = parseFloat(validatorFee) / 100;

    if (!amount || !period || !rate || amount <= 0 || period <= 0 || rate < 0) return;

    const selectedCrypto = cryptocurrencies.find(c => c.value === cryptocurrency);
    const selectedFrequency = compoundFrequencies.find(f => f.value === compoundFrequency);
    
    // Calculate net APR after validator fees
    const netRate = rate * (1 - fee);
    
    // Calculate compound interest
    const n = selectedFrequency.periodsPerYear;
    const t = period;
    
    let finalAmount;
    if (compoundFrequency === "annually" || n === 1) {
      // Simple interest for annual compounding
      finalAmount = amount * (1 + netRate * t);
    } else {
      // Compound interest
      finalAmount = amount * Math.pow(1 + netRate / n, n * t);
    }
    
    const totalRewards = finalAmount - amount;
    const grossRewards = totalRewards / (1 - fee);
    const validatorFees = grossRewards - totalRewards;
    
    // Calculate periodic rewards
    const dailyRewards = totalRewards / (period * 365);
    const monthlyRewards = totalRewards / (period * 12);
    const yearlyRewards = totalRewards / period;
    
    // Calculate USD value
    const amountUSD = amount * selectedCrypto.price;
    const rewardsUSD = totalRewards * selectedCrypto.price;
    const finalAmountUSD = finalAmount * selectedCrypto.price;
    
    // Calculate effective APR
    const effectiveAPR = period > 0 ? (Math.pow(finalAmount / amount, 1 / period) - 1) * 100 : 0;

    setResult({
      stakingAmount: amount,
      stakingPeriod: period,
      annualRate: rate * 100,
      netRate: netRate * 100,
      finalAmount: finalAmount,
      totalRewards: totalRewards,
      validatorFees: validatorFees,
      dailyRewards: dailyRewards,
      monthlyRewards: monthlyRewards,
      yearlyRewards: yearlyRewards,
      cryptocurrency: selectedCrypto,
      compoundFrequency: selectedFrequency.label,
      amountUSD: amountUSD,
      rewardsUSD: rewardsUSD,
      finalAmountUSD: finalAmountUSD,
      effectiveAPR: effectiveAPR,
      ROI: ((finalAmount - amount) / amount) * 100
    });
  }, [stakingAmount, stakingPeriod, annualRate, cryptocurrency, compoundFrequency, validatorFee]);

  const formatNumber = (num, decimals = 2) => {
    return new Intl.NumberFormat('ru-RU', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    }).format(num);
  };

  const formatCrypto = (num, decimals = 6) => {
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: Math.min(decimals, 2), 
      maximumFractionDigits: decimals 
    }).format(num);
  };

  const setTypicalRate = (cryptoValue) => {
    const crypto = cryptocurrencies.find(c => c.value === cryptoValue);
    if (crypto) {
      setAnnualRate(crypto.typicalAPR.toString());
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-3 rounded-xl">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор стейкинга</CardTitle>
              <CardDescription>
                Расчет доходности от стейкинга криптовалют
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Криптовалюта</Label>
              <Select 
                value={cryptocurrency} 
                onValueChange={(value) => {
                  setCryptocurrency(value);
                  setTypicalRate(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cryptocurrencies.map((crypto) => (
                    <SelectItem key={crypto.value} value={crypto.value}>
                      <div className="flex items-center justify-between w-full gap-2">
                        <span>{crypto.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {crypto.typicalAPR}% APR
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stakingAmount">Количество для стейкинга</Label>
              <Input
                id="stakingAmount"
                type="number"
                step="0.001"
                placeholder="100"
                value={stakingAmount}
                onChange={(e) => setStakingAmount(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-gray-500">
                Минимум: {cryptocurrencies.find(c => c.value === cryptocurrency)?.minStake} {cryptocurrency}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualRate">Годовая доходность (%)</Label>
              <Input
                id="annualRate"
                type="number"
                step="0.1"
                placeholder="5.2"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-gray-500">
                Типичная ставка для {cryptocurrency}: {cryptocurrencies.find(c => c.value === cryptocurrency)?.typicalAPR}%
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stakingPeriod">Период стейкинга (лет)</Label>
              <Input
                id="stakingPeriod"
                type="number"
                step="0.1"
                placeholder="1"
                value={stakingPeriod}
                onChange={(e) => setStakingPeriod(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Частота начисления</Label>
              <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {compoundFrequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="validatorFee">Комиссия валидатора (%)</Label>
              <Input
                id="validatorFee"
                type="number"
                step="0.1"
                placeholder="10"
                value={validatorFee}
                onChange={(e) => setValidatorFee(e.target.value)}
              />
            </div>

            <Button 
              onClick={calculateStaking} 
              className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать стейкинг
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      Результаты стейкинга
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <p className="text-sm text-gray-600 mb-1">Итоговая сумма</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {formatCrypto(result.finalAmount)} {result.cryptocurrency.symbol}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        ≈ ${formatNumber(result.finalAmountUSD)}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <p className="text-sm text-gray-600">Стейкинг</p>
                        <p className="text-lg font-semibold">
                          {formatCrypto(result.stakingAmount)} {result.cryptocurrency.symbol}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <p className="text-sm text-gray-600">Награды</p>
                        <p className="text-lg font-semibold text-green-600">
                          +{formatCrypto(result.totalRewards)} {result.cryptocurrency.symbol}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <p className="text-sm text-gray-600 mb-1">Доходность (ROI)</p>
                      <p className="text-2xl font-bold text-green-600">
                        +{result.ROI.toFixed(2)}%
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        За {result.stakingPeriod} лет
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white rounded p-2 border border-purple-200 text-center">
                        <p className="text-xs text-gray-600">День</p>
                        <p className="font-semibold text-sm">
                          {formatCrypto(result.dailyRewards, 4)} {result.cryptocurrency.symbol}
                        </p>
                      </div>
                      <div className="bg-white rounded p-2 border border-purple-200 text-center">
                        <p className="text-xs text-gray-600">Месяц</p>
                        <p className="font-semibold text-sm">
                          {formatCrypto(result.monthlyRewards, 4)} {result.cryptocurrency.symbol}
                        </p>
                      </div>
                      <div className="bg-white rounded p-2 border border-purple-200 text-center">
                        <p className="text-xs text-gray-600">Год</p>
                        <p className="font-semibold text-sm">
                          {formatCrypto(result.yearlyRewards, 4)} {result.cryptocurrency.symbol}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                      <p><strong>Номинальная ставка:</strong> {result.annualRate.toFixed(1)}%</p>
                      <p><strong>Чистая ставка:</strong> {result.netRate.toFixed(1)}% (после комиссий)</p>
                      <p><strong>Эффективная ставка:</strong> {result.effectiveAPR.toFixed(2)}%</p>
                      <p><strong>Комиссия валидатора:</strong> {formatCrypto(result.validatorFees, 4)} {result.cryptocurrency.symbol}</p>
                      <p><strong>Капитализация:</strong> {result.compoundFrequency}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите параметры стейкинга для расчета доходности
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Staking Options */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Варианты стейкинга</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Собственный валидатор</h4>
              <p className="text-sm text-blue-600 mb-2">Максимальная доходность</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Полный контроль над средствами</li>
                <li>• Требует технических знаний</li>
                <li>• Высокие минимальные суммы</li>
                <li>• Риск слэшинга за ошибки</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Пулы стейкинга</h4>
              <p className="text-sm text-green-600 mb-2">Оптимальный баланс</p>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Низкий порог входа</li>
                <li>• Профессиональное управление</li>
                <li>• Комиссия 5-15%</li>
                <li>• Распределение рисков</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Биржевой стейкинг</h4>
              <p className="text-sm text-purple-600 mb-2">Простота использования</p>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• Автоматическое управление</li>
                <li>• Мгновенный старт</li>
                <li>• Более высокие комиссии</li>
                <li>• Централизованные риски</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>О стейкинге криптовалют</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p>
            Стейкинг — это процесс участия в консенсусе блокчейна Proof-of-Stake (PoS), 
            при котором держатели токенов получают вознаграждение за поддержку сети.
          </p>
          
          <h3>Преимущества стейкинга:</h3>
          <ul>
            <li><strong>Пассивный доход</strong> — регулярные выплаты без активных действий</li>
            <li><strong>Безопасность сети</strong> — участие в защите блокчейна</li>
            <li><strong>Сложный процент</strong> — реинвестирование наград увеличивает доходность</li>
            <li><strong>Экологичность</strong> — меньшее энергопотребление по сравнению с майнингом</li>
          </ul>

          <h3>Риски стейкинга:</h3>
          <ul>
            <li><strong>Слэшинг</strong> — штрафы за нарушение правил протокола</li>
            <li><strong>Волатильность</strong> — изменение цены базового актива</li>
            <li><strong>Период разблокировки</strong> — невозможность вывести средства сразу</li>
            <li><strong>Риск валидатора</strong> — плохая работа валидатора влияет на доходность</li>
            <li><strong>Технические риски</strong> — ошибки в коде или инфраструктуре</li>
          </ul>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-purple-800 mb-2">💡 Советы по стейкингу:</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Изучите особенности конкретного протокола перед началом</li>
              <li>• Диверсифицируйте между разными валидаторами и сетями</li>
              <li>• Учитывайте период разблокировки при планировании ликвидности</li>
              <li>• Следите за обновлениями протокола и изменениями в доходности</li>
              <li>• Рассматривайте налоговые последствия в вашей юрисдикции</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakingCalculator;