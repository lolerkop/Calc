import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Droplets, Calculator } from "lucide-react";

const WaterCalculator = () => {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("low");
  const [climate, setClimate] = useState("normal");
  const [age, setAge] = useState("");
  const [result, setResult] = useState(null);

  const activityLevels = [
    { value: "low", label: "Низкая активность", factor: 1 },
    { value: "moderate", label: "Умеренная активность", factor: 1.2 },
    { value: "high", label: "Высокая активность", factor: 1.5 },
    { value: "extreme", label: "Очень высокая активность", factor: 1.8 }
  ];

  const climateTypes = [
    { value: "cold", label: "Холодный климат", factor: 0.9 },
    { value: "normal", label: "Умеренный климат", factor: 1 },
    { value: "hot", label: "Жаркий климат", factor: 1.3 }
  ];

  const calculateWater = useCallback(() => {
    const w = parseFloat(weight);
    const a = parseFloat(age);

    if (!w || !a || w <= 0 || a <= 0) {
      return;
    }

    // Базовая формула: 30-35 мл на кг веса
    let baseWater = w * 35; // мл

    // Корректировка по возрасту
    if (a > 65) {
      baseWater *= 0.9;
    } else if (a < 18) {
      baseWater *= 1.1;
    }

    const activityFactor = activityLevels.find(level => level.value === activity)?.factor || 1;
    const climateFactor = climateTypes.find(type => type.value === climate)?.factor || 1;

    const totalWater = baseWater * activityFactor * climateFactor;
    const waterLiters = totalWater / 1000;
    const glassesCount = Math.round(totalWater / 250); // стакан = 250 мл

    setResult({
      totalWater: totalWater,
      waterLiters: waterLiters,
      glassesCount: glassesCount,
      weight: w,
      age: a,
      activityLevel: activityLevels.find(level => level.value === activity)?.label,
      climateType: climateTypes.find(type => type.value === climate)?.label
    });
  }, [weight, activity, climate, age]);

  const formatNumber = (num, decimals = 1) => {
    return new Intl.NumberFormat('ru-RU', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    }).format(num);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор нормы воды</CardTitle>
              <CardDescription>
                Суточная потребность в жидкости
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="weight">Вес (кг)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Возраст (лет)</Label>
              <Input
                id="age"
                type="number"
                placeholder="30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Уровень физической активности</Label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Климатические условия</Label>
              <Select value={climate} onValueChange={setClimate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {climateTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={calculateWater} 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать норму воды
            </Button>
          </div>

          <div className="space-y-4">
            {result ? (
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="pt-6 space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Суточная норма воды</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatNumber(result.waterLiters)} л
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="text-sm text-gray-600">В миллилитрах</p>
                      <p className="text-lg font-semibold">
                        {Math.round(result.totalWater)} мл
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="text-sm text-gray-600">Стаканов (250 мл)</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {result.glassesCount} шт
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">Рекомендации</p>
                    <ul className="text-sm space-y-1">
                      <li>• Пейте небольшими порциями в течение дня</li>
                      <li>• Увеличивайте потребление при болезни</li>
                      <li>• Учитывайте воду из пищи (~20% от нормы)</li>
                    </ul>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                    <p><strong>Вес:</strong> {result.weight} кг</p>
                    <p><strong>Возраст:</strong> {result.age} лет</p>
                    <p><strong>Активность:</strong> {result.activityLevel}</p>
                    <p><strong>Климат:</strong> {result.climateType}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите ваши данные для расчета нормы воды
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterCalculator;