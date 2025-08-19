import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Zap, Calculator, Timer, Target } from "lucide-react";

const RunningCalculator = () => {
  // Темп бега
  const [distance1, setDistance1] = useState("");
  const [time1, setTime1] = useState("");
  const [result1, setResult1] = useState(null);

  // Сожженные калории
  const [weight, setWeight] = useState("");
  const [distance2, setDistance2] = useState("");
  const [time2, setTime2] = useState("");
  const [result2, setResult2] = useState(null);

  // Планирование дистанции
  const [targetDistance, setTargetDistance] = useState("");
  const [targetPace, setTargetPace] = useState("");
  const [result3, setResult3] = useState(null);

  const calculatePace = useCallback(() => {
    const dist = parseFloat(distance1);
    const timeInMinutes = parseFloat(time1);

    if (!dist || !timeInMinutes || dist <= 0 || timeInMinutes <= 0) {
      return;
    }

    const paceMinPerKm = timeInMinutes / dist;
    const paceMinutes = Math.floor(paceMinPerKm);
    const paceSeconds = Math.round((paceMinPerKm - paceMinutes) * 60);
    
    const speedKmh = 60 / paceMinPerKm;

    setResult1({
      distance: dist,
      time: timeInMinutes,
      paceMinPerKm: paceMinPerKm,
      paceFormatted: `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`,
      speedKmh: speedKmh
    });
  }, [distance1, time1]);

  const calculateCalories = useCallback(() => {
    const w = parseFloat(weight);
    const dist = parseFloat(distance2);
    const timeInMinutes = parseFloat(time2);

    if (!w || !dist || !timeInMinutes || w <= 0 || dist <= 0 || timeInMinutes <= 0) {
      return;
    }

    const speedKmh = (dist / timeInMinutes) * 60;
    
    // METs для разных скоростей бега
    let mets;
    if (speedKmh < 8) {
      mets = 8.3; // Легкий бег
    } else if (speedKmh < 10) {
      mets = 9.8; // Умеренный бег
    } else if (speedKmh < 12) {
      mets = 11.0; // Быстрый бег
    } else if (speedKmh < 14) {
      mets = 12.3; // Очень быстрый бег
    } else {
      mets = 14.5; // Спринт
    }

    // Калории = METs × вес (кг) × время (часы)
    const calories = mets * w * (timeInMinutes / 60);

    const paceMinPerKm = timeInMinutes / dist;
    const paceMinutes = Math.floor(paceMinPerKm);
    const paceSeconds = Math.round((paceMinPerKm - paceMinutes) * 60);

    setResult2({
      weight: w,
      distance: dist,
      time: timeInMinutes,
      calories: calories,
      speedKmh: speedKmh,
      mets: mets,
      paceFormatted: `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`
    });
  }, [weight, distance2, time2]);

  const calculateTargetTime = useCallback(() => {
    const dist = parseFloat(targetDistance);
    const paceStr = targetPace.trim();

    if (!dist || !paceStr || dist <= 0) {
      return;
    }

    // Парсим темп в формате MM:SS
    const paceParts = paceStr.split(':');
    if (paceParts.length !== 2) {
      return;
    }

    const paceMinutes = parseInt(paceParts[0]);
    const paceSeconds = parseInt(paceParts[1]);
    
    if (isNaN(paceMinutes) || isNaN(paceSeconds) || paceSeconds >= 60) {
      return;
    }

    const paceMinPerKm = paceMinutes + (paceSeconds / 60);
    const totalTimeMinutes = dist * paceMinPerKm;
    
    const hours = Math.floor(totalTimeMinutes / 60);
    const minutes = Math.floor(totalTimeMinutes % 60);
    const seconds = Math.round((totalTimeMinutes % 1) * 60);

    const timeFormatted = hours > 0 
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const speedKmh = 60 / paceMinPerKm;

    setResult3({
      distance: dist,
      targetPace: paceStr,
      totalTime: totalTimeMinutes,
      timeFormatted: timeFormatted,
      speedKmh: speedKmh
    });
  }, [targetDistance, targetPace]);

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
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор для бега</CardTitle>
              <CardDescription>
                Расчет темпа, времени и сожженных калорий при беге
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pace" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pace">Темп бега</TabsTrigger>
              <TabsTrigger value="calories">Калории</TabsTrigger>
              <TabsTrigger value="planning">Планирование</TabsTrigger>
            </TabsList>

            {/* Расчет темпа */}
            <TabsContent value="pace" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Рассчитать темп бега</h3>
                  <div className="space-y-2">
                    <Label htmlFor="distance1">Дистанция (км)</Label>
                    <Input
                      id="distance1"
                      type="number"
                      step="0.1"
                      placeholder="10"
                      value={distance1}
                      onChange={(e) => setDistance1(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time1">Время (минуты)</Label>
                    <Input
                      id="time1"
                      type="number"
                      step="0.1"
                      placeholder="50"
                      value={time1}
                      onChange={(e) => setTime1(e.target.value)}
                    />
                  </div>
                  <Button onClick={calculatePace} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать темп
                  </Button>
                </div>
                <div>
                  {result1 ? (
                    <Card className="bg-red-50 border-red-200">
                      <CardContent className="pt-6">
                        <div className="text-center mb-4">
                          <p className="text-3xl font-bold text-red-600">
                            {result1.paceFormatted}
                          </p>
                          <p className="text-sm text-gray-600">минут на км</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Скорость:</span>
                            <span className="font-semibold">{formatNumber(result1.speedKmh)} км/ч</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Дистанция:</span>
                            <span className="font-semibold">{result1.distance} км</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Время:</span>
                            <span className="font-semibold">{result1.time} мин</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <Timer className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Результат появится здесь</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Расчет калорий */}
            <TabsContent value="calories" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Сожженные калории</h3>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Вес (кг)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distance2">Дистанция (км)</Label>
                    <Input
                      id="distance2"
                      type="number"
                      step="0.1"
                      placeholder="5"
                      value={distance2}
                      onChange={(e) => setDistance2(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time2">Время (минуты)</Label>
                    <Input
                      id="time2"
                      type="number"
                      step="0.1"
                      placeholder="30"
                      value={time2}
                      onChange={(e) => setTime2(e.target.value)}
                    />
                  </div>
                  <Button onClick={calculateCalories} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать калории
                  </Button>
                </div>
                <div>
                  {result2 ? (
                    <Card className="bg-red-50 border-red-200">
                      <CardContent className="pt-6">
                        <div className="text-center mb-4">
                          <p className="text-3xl font-bold text-red-600">
                            {Math.round(result2.calories)}
                          </p>
                          <p className="text-sm text-gray-600">калорий сожжено</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Темп:</span>
                            <span className="font-semibold">{result2.paceFormatted} мин/км</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Скорость:</span>
                            <span className="font-semibold">{formatNumber(result2.speedKmh)} км/ч</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Интенсивность:</span>
                            <span className="font-semibold">{result2.mets} METs</span>
                          </div>
                          <Badge variant="secondary" className="w-full justify-center mt-3">
                            На 1 км: {Math.round(result2.calories / result2.distance)} ккал
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <Zap className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Результат появится здесь</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Планирование */}
            <TabsContent value="planning" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Планировщик тренировки</h3>
                  <div className="space-y-2">
                    <Label htmlFor="targetDistance">Дистанция (км)</Label>
                    <Input
                      id="targetDistance"
                      type="number"
                      step="0.1"
                      placeholder="21.1"
                      value={targetDistance}
                      onChange={(e) => setTargetDistance(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetPace">Целевой темп (ММ:СС на км)</Label>
                    <Input
                      id="targetPace"
                      type="text"
                      placeholder="5:30"
                      value={targetPace}
                      onChange={(e) => setTargetPace(e.target.value)}
                    />
                  </div>
                  <Button onClick={calculateTargetTime} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать время
                  </Button>
                </div>
                <div>
                  {result3 ? (
                    <Card className="bg-red-50 border-red-200">
                      <CardContent className="pt-6">
                        <div className="text-center mb-4">
                          <p className="text-2xl font-bold text-red-600">
                            {result3.timeFormatted}
                          </p>
                          <p className="text-sm text-gray-600">время финиша</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Дистанция:</span>
                            <span className="font-semibold">{result3.distance} км</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Темп:</span>
                            <span className="font-semibold">{result3.targetPace} мин/км</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Скорость:</span>
                            <span className="font-semibold">{formatNumber(result3.speedKmh)} км/ч</span>
                          </div>
                          <Badge variant="secondary" className="w-full justify-center mt-3">
                            {result3.distance === 42.2 ? 'Марафон' : 
                             result3.distance === 21.1 ? 'Полумарафон' :
                             result3.distance === 10 ? '10К' :
                             result3.distance === 5 ? '5К' : 'Дистанция'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
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
          <CardTitle>Справочная информация о беге</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Темп бега</h3>
              <ul className="text-sm space-y-1">
                <li>• <strong>7:00+ мин/км</strong> — легкий бег</li>
                <li>• <strong>5:30-7:00</strong> — умеренный темп</li>
                <li>• <strong>4:30-5:30</strong> — темповый бег</li>
                <li>• <strong>3:30-4:30</strong> — быстрый бег</li>
                <li>• <strong>&lt;3:30</strong> — элитный уровень</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Популярные дистанции</h3>
              <ul className="text-sm space-y-1">
                <li>• <strong>5К</strong> — 5 километров</li>
                <li>• <strong>10К</strong> — 10 километров</li>
                <li>• <strong>Полумарафон</strong> — 21.1 км</li>
                <li>• <strong>Марафон</strong> — 42.2 км</li>
                <li>• <strong>Ультрамарафон</strong> — 50+ км</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Сжигание калорий</h3>
              <ul className="text-sm space-y-1">
                <li>• Зависит от веса и интенсивности</li>
                <li>• ~100 ккал на 1.6 км для 70 кг</li>
                <li>• Быстрый бег сжигает больше калорий</li>
                <li>• METs учитывают интенсивность нагрузки</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RunningCalculator;