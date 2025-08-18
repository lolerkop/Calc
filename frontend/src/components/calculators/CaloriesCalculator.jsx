import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Apple, Calculator } from "lucide-react";

const CaloriesCalculator = () => {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("sedentary");
  const [result, setResult] = useState(null);

  const activityLevels = [
    { value: "sedentary", label: "Малоподвижный образ жизни", factor: 1.2 },
    { value: "light", label: "Легкая активность (1-3 дня в неделю)", factor: 1.375 },
    { value: "moderate", label: "Умеренная активность (3-5 дней в неделю)", factor: 1.55 },
    { value: "high", label: "Высокая активность (6-7 дней в неделю)", factor: 1.725 },
    { value: "extreme", label: "Очень высокая активность", factor: 1.9 }
  ];

  const calculateCalories = useCallback(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (!w || !h || !a || w <= 0 || h <= 0 || a <= 0) {
      return;
    }

    // Формула Миффлина-Сан Жеора
    let bmr;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const activityFactor = activityLevels.find(level => level.value === activity)?.factor || 1.2;
    const tdee = bmr * activityFactor;

    setResult({
      bmr: bmr,
      tdee: tdee,
      weightLoss: tdee - 500,
      weightGain: tdee + 500,
      gender: gender,
      age: a,
      weight: w,
      height: h,
      activityLevel: activityLevels.find(level => level.value === activity)?.label
    });
  }, [gender, age, weight, height, activity]);

  const formatNumber = (num) => {
    return Math.round(num);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl">
              <Apple className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор калорий</CardTitle>
              <CardDescription>
                Расчет суточной нормы калорий
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Пол</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Мужской</SelectItem>
                  <SelectItem value="female">Женский</SelectItem>
                </SelectContent>
              </Select>
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
              <Label htmlFor="height">Рост (см)</Label>
              <Input
                id="height"
                type="number"
                placeholder="175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Уровень активности</Label>
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

            <Button 
              onClick={calculateCalories} 
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать калории
            </Button>
          </div>

          <div className="space-y-4">
            {result ? (
              <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                <CardContent className="pt-6 space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <p className="text-sm text-gray-600 mb-1">Суточная норма калорий</p>
                    <p className="text-3xl font-bold text-red-600">
                      {formatNumber(result.tdee)} ккал
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white rounded p-3 border border-red-200">
                      <p className="text-sm text-gray-600">Базовый метаболизм</p>
                      <p className="font-semibold">{formatNumber(result.bmr)} ккал</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-red-200">
                      <p className="text-sm text-gray-600">Для похудения</p>
                      <p className="font-semibold text-blue-600">{formatNumber(result.weightLoss)} ккал</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-red-200">
                      <p className="text-sm text-gray-600">Для набора веса</p>
                      <p className="font-semibold text-green-600">{formatNumber(result.weightGain)} ккал</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                    <p><strong>Пол:</strong> {result.gender === 'male' ? 'Мужской' : 'Женский'}</p>
                    <p><strong>Возраст:</strong> {result.age} лет</p>
                    <p><strong>Рост/Вес:</strong> {result.height} см / {result.weight} кг</p>
                    <p><strong>Активность:</strong> {result.activityLevel}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <Apple className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите ваши данные для расчета калорий
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

export default CaloriesCalculator;