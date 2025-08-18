import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Heart, Calculator, Activity } from "lucide-react";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState(null);

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) {
      return {
        category: "Недостаточный вес",
        color: "bg-blue-100 text-blue-800",
        description: "Рекомендуется увеличить массу тела",
        range: "< 18.5"
      };
    } else if (bmi >= 18.5 && bmi < 25) {
      return {
        category: "Нормальный вес",
        color: "bg-green-100 text-green-800",
        description: "Оптимальный вес для здоровья",
        range: "18.5 - 24.9"
      };
    } else if (bmi >= 25 && bmi < 30) {
      return {
        category: "Избыточный вес",
        color: "bg-yellow-100 text-yellow-800",
        description: "Рекомендуется снижение веса",
        range: "25.0 - 29.9"
      };
    } else {
      return {
        category: "Ожирение",
        color: "bg-red-100 text-red-800",
        description: "Необходима консультация врача",
        range: "≥ 30.0"
      };
    }
  };

  const calculateBMI = useCallback(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // переводим см в метры

    if (!w || !h || w <= 0 || h <= 0) {
      return;
    }

    const bmi = w / (h * h);
    const category = getBMICategory(bmi);

    // Расчет идеального веса (формула Лоренца)
    const idealWeightMin = 18.5 * h * h;
    const idealWeightMax = 24.9 * h * h;

    setResult({
      bmi: bmi,
      category: category,
      weight: w,
      height: parseFloat(height),
      idealWeightRange: {
        min: idealWeightMin,
        max: idealWeightMax
      }
    });
  }, [weight, height]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    }).format(num);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор ИМТ</CardTitle>
              <CardDescription>
                Рассчитайте индекс массы тела и получите рекомендации
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
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

            <Button 
              onClick={calculateBMI} 
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать ИМТ
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5 text-red-600" />
                      Ваш результат
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-red-600 mb-2">
                        {formatNumber(result.bmi)}
                      </p>
                      <Badge className={result.category.color}>
                        {result.category.category}
                      </Badge>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <p className="text-sm text-gray-600 mb-2">Категория ИМТ</p>
                      <p className="font-semibold">{result.category.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Нормальный диапазон: {result.category.range}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <p className="text-sm text-gray-600 mb-2">Идеальный вес</p>
                      <p className="font-semibold">
                        {formatNumber(result.idealWeightRange.min)} - {formatNumber(result.idealWeightRange.max)} кг
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Для роста {result.height} см
                      </p>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 bg-white p-3 rounded-lg">
                      <p><strong>Текущий вес:</strong> {result.weight} кг</p>
                      <p><strong>Рост:</strong> {result.height} см</p>
                      <p><strong>ИМТ:</strong> {formatNumber(result.bmi)}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите ваш вес и рост для расчета ИМТ
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* BMI Scale */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Шкала ИМТ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h4 className="font-semibold text-blue-800">Недостаточный вес</h4>
              <p className="text-blue-600">ИМТ &lt; 18.5</p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h4 className="font-semibold text-green-800">Нормальный вес</h4>
              <p className="text-green-600">ИМТ 18.5-24.9</p>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <h4 className="font-semibold text-yellow-800">Избыточный вес</h4>
              <p className="text-yellow-600">ИМТ 25.0-29.9</p>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <h4 className="font-semibold text-red-800">Ожирение</h4>
              <p className="text-red-600">ИМТ ≥ 30.0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>О калькуляторе ИМТ</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p>
            Индекс массы тела (ИМТ) — это показатель, который позволяет оценить 
            соответствие массы тела человека его росту и определить недостаточный, 
            нормальный или избыточный вес.
          </p>
          
          <h3>Формула расчета:</h3>
          <p><strong>ИМТ = вес (кг) / рост² (м)</strong></p>

          <h3>Важные замечания:</h3>
          <ul>
            <li>ИМТ не учитывает мышечную массу и тип телосложения</li>
            <li>Для спортсменов и людей с развитой мускулатурой результаты могут быть неточными</li>
            <li>Консультация с врачом рекомендуется при крайних значениях ИМТ</li>
            <li>ИМТ — это скрининговый инструмент, а не диагностический</li>
          </ul>

          <h3>Рекомендации:</h3>
          <ul>
            <li><strong>Недостаточный вес:</strong> Увеличение калорийности питания, консультация диетолога</li>
            <li><strong>Нормальный вес:</strong> Поддержание здорового образа жизни</li>
            <li><strong>Избыточный вес:</strong> Умеренное снижение калорийности, увеличение физической активности</li>
            <li><strong>Ожирение:</strong> Обязательная консультация врача, комплексный подход к снижению веса</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BMICalculator;