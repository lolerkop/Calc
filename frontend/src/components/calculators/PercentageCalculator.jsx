import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calculator, Percent, TrendingUp } from "lucide-react";

const PercentageCalculator = () => {
  // Проценты от числа
  const [number1, setNumber1] = useState("");
  const [percentage1, setPercentage1] = useState("");
  const [result1, setResult1] = useState(null);

  // Сколько процентов составляет число
  const [part, setPart] = useState("");
  const [whole, setWhole] = useState("");
  const [result2, setResult2] = useState(null);

  // Изменение на процент
  const [originalValue, setOriginalValue] = useState("");
  const [changePercent, setChangePercent] = useState("");
  const [result3, setResult3] = useState(null);

  const calculatePercentOf = useCallback(() => {
    const num = parseFloat(number1);
    const perc = parseFloat(percentage1);

    if (!num || !perc) return;

    const result = (num * perc) / 100;
    setResult1({
      original: num,
      percentage: perc,
      result: result
    });
  }, [number1, percentage1]);

  const calculateWhatPercent = useCallback(() => {
    const partNum = parseFloat(part);
    const wholeNum = parseFloat(whole);

    if (!partNum || !wholeNum || wholeNum === 0) return;

    const result = (partNum / wholeNum) * 100;
    setResult2({
      part: partNum,
      whole: wholeNum,
      percentage: result
    });
  }, [part, whole]);

  const calculatePercentChange = useCallback(() => {
    const original = parseFloat(originalValue);
    const change = parseFloat(changePercent);

    if (!original || change === undefined) return;

    const newValue = original + (original * change / 100);
    const absoluteChange = newValue - original;

    setResult3({
      original: original,
      changePercent: change,
      newValue: newValue,
      absoluteChange: absoluteChange
    });
  }, [originalValue, changePercent]);

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
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-3 rounded-xl">
              <Percent className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор процентов</CardTitle>
              <CardDescription>
                Различные операции с процентами и процентными соотношениями
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="percent-of" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="percent-of">Процент от числа</TabsTrigger>
              <TabsTrigger value="what-percent">Сколько процентов</TabsTrigger>
              <TabsTrigger value="percent-change">Изменение</TabsTrigger>
            </TabsList>

            {/* Процент от числа */}
            <TabsContent value="percent-of" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Найти процент от числа</h3>
                  <div className="space-y-2">
                    <Label htmlFor="number1">Число</Label>
                    <Input
                      id="number1"
                      type="number"
                      placeholder="1000"
                      value={number1}
                      onChange={(e) => setNumber1(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentage1">Процент (%)</Label>
                    <Input
                      id="percentage1"
                      type="number"
                      placeholder="25"
                      value={percentage1}
                      onChange={(e) => setPercentage1(e.target.value)}
                    />
                  </div>
                  <Button onClick={calculatePercentOf} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать
                  </Button>
                </div>
                <div>
                  {result1 ? (
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {formatNumber(result1.result)}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {result1.percentage}% от {formatNumber(result1.original)} = {formatNumber(result1.result)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <Percent className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Результат появится здесь</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Сколько процентов составляет */}
            <TabsContent value="what-percent" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Сколько процентов составляет число</h3>
                  <div className="space-y-2">
                    <Label htmlFor="part">Часть</Label>
                    <Input
                      id="part"
                      type="number"
                      placeholder="250"
                      value={part}
                      onChange={(e) => setPart(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whole">Целое</Label>
                    <Input
                      id="whole"
                      type="number"
                      placeholder="1000"
                      value={whole}
                      onChange={(e) => setWhole(e.target.value)}
                    />
                  </div>
                  <Button onClick={calculateWhatPercent} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать
                  </Button>
                </div>
                <div>
                  {result2 ? (
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {formatNumber(result2.percentage)}%
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {formatNumber(result2.part)} составляет {formatNumber(result2.percentage)}% от {formatNumber(result2.whole)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <Percent className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Результат появится здесь</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Изменение на процент */}
            <TabsContent value="percent-change" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Изменение на процент</h3>
                  <div className="space-y-2">
                    <Label htmlFor="originalValue">Исходное значение</Label>
                    <Input
                      id="originalValue"
                      type="number"
                      placeholder="1000"
                      value={originalValue}
                      onChange={(e) => setOriginalValue(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="changePercent">Изменение (%, может быть отрицательным)</Label>
                    <Input
                      id="changePercent"
                      type="number"
                      placeholder="15"
                      value={changePercent}
                      onChange={(e) => setChangePercent(e.target.value)}
                    />
                  </div>
                  <Button onClick={calculatePercentChange} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать
                  </Button>
                </div>
                <div>
                  {result3 ? (
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="pt-6 space-y-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {formatNumber(result3.newValue)}
                          </p>
                          <p className="text-sm text-gray-600">Новое значение</p>
                        </div>
                        <div className="bg-white rounded p-3 space-y-1 text-sm">
                          <p><strong>Исходное:</strong> {formatNumber(result3.original)}</p>
                          <p><strong>Изменение:</strong> {result3.changePercent > 0 ? '+' : ''}{result3.changePercent}%</p>
                          <p><strong>Разница:</strong> {result3.absoluteChange > 0 ? '+' : ''}{formatNumber(result3.absoluteChange)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
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
          <CardTitle>О калькуляторе процентов</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Процент от числа</h3>
              <p className="text-sm text-gray-600 mb-2">Формула: (Число × Процент) ÷ 100</p>
              <p className="text-sm">Используется для:</p>
              <ul className="text-sm text-gray-600 mt-1">
                <li>• Расчета скидок</li>
                <li>• НДС и налогов</li>
                <li>• Комиссий</li>
                <li>• Чаевых</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Сколько процентов</h3>
              <p className="text-sm text-gray-600 mb-2">Формула: (Часть ÷ Целое) × 100</p>
              <p className="text-sm">Используется для:</p>
              <ul className="text-sm text-gray-600 mt-1">
                <li>• Анализа долей</li>
                <li>• Статистики</li>
                <li>• Успеваемости</li>
                <li>• Прогресса</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Изменение</h3>
              <p className="text-sm text-gray-600 mb-2">Формула: Значение × (1 + Процент/100)</p>
              <p className="text-sm">Используется для:</p>
              <ul className="text-sm text-gray-600 mt-1">
                <li>• Инфляции</li>
                <li>• Роста цен</li>
                <li>• Увеличения зарплаты</li>
                <li>• Планирования бюджета</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PercentageCalculator;