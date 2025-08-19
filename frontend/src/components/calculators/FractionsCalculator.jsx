import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Divide, Calculator, Plus, Minus, X, SquareSlash } from "lucide-react";

const FractionsCalculator = () => {
  const [num1, setNum1] = useState("");
  const [den1, setDen1] = useState("");
  const [num2, setNum2] = useState("");
  const [den2, setDen2] = useState("");
  const [operation, setOperation] = useState("add");
  const [result, setResult] = useState(null);

  // Функция для нахождения НОД (наибольший общий делитель)
  const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  // Функция для упрощения дроби
  const simplifyFraction = (numerator, denominator) => {
    const divisor = gcd(numerator, denominator);
    return {
      numerator: numerator / divisor,
      denominator: denominator / divisor
    };
  };

  // Функция для преобразования в смешанное число
  const toMixedNumber = (numerator, denominator) => {
    const whole = Math.floor(Math.abs(numerator) / Math.abs(denominator));
    const remainderNum = Math.abs(numerator) % Math.abs(denominator);
    const sign = (numerator < 0) !== (denominator < 0) ? -1 : 1;
    
    return {
      whole: whole * sign,
      numerator: remainderNum,
      denominator: Math.abs(denominator)
    };
  };

  // Функция для преобразования в десятичное число
  const toDecimal = (numerator, denominator) => {
    return numerator / denominator;
  };

  const calculateFractions = useCallback(() => {
    const n1 = parseInt(num1);
    const d1 = parseInt(den1);
    const n2 = parseInt(num2);
    const d2 = parseInt(den2);

    if (!n1 && n1 !== 0 || !d1 || !n2 && n2 !== 0 || !d2 || d1 === 0 || d2 === 0) {
      return;
    }

    let resultNum, resultDen;

    switch (operation) {
      case "add":
        // a/b + c/d = (ad + bc) / bd
        resultNum = n1 * d2 + n2 * d1;
        resultDen = d1 * d2;
        break;
      case "subtract":
        // a/b - c/d = (ad - bc) / bd
        resultNum = n1 * d2 - n2 * d1;
        resultDen = d1 * d2;
        break;
      case "multiply":
        // a/b * c/d = ac / bd
        resultNum = n1 * n2;
        resultDen = d1 * d2;
        break;
      case "divide":
        // a/b ÷ c/d = a/b * d/c = ad / bc
        resultNum = n1 * d2;
        resultDen = d1 * n2;
        break;
      default:
        return;
    }

    if (resultDen === 0) {
      return;
    }

    const simplified = simplifyFraction(resultNum, resultDen);
    const mixed = toMixedNumber(simplified.numerator, simplified.denominator);
    const decimal = toDecimal(simplified.numerator, simplified.denominator);

    setResult({
      original: {
        fraction1: { numerator: n1, denominator: d1 },
        fraction2: { numerator: n2, denominator: d2 },
        operation: operation
      },
      raw: { numerator: resultNum, denominator: resultDen },
      simplified: simplified,
      mixed: mixed,
      decimal: decimal
    });
  }, [num1, den1, num2, den2, operation]);

  const getOperationSymbol = (op) => {
    switch (op) {
      case "add": return "+";
      case "subtract": return "−";
      case "multiply": return "×";
      case "divide": return "÷";
      default: return "";
    }
  };

  const getOperationIcon = (op) => {
    switch (op) {
      case "add": return <Plus className="w-4 h-4" />;
      case "subtract": return <Minus className="w-4 h-4" />;
      case "multiply": return <X className="w-4 h-4" />;
      case "divide": return <SquareSlash className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatFraction = (num, den) => {
    if (den === 1) return num.toString();
    return `${num}/${den}`;
  };

  const formatMixed = (mixed) => {
    if (mixed.whole === 0) {
      if (mixed.numerator === 0) return "0";
      return formatFraction(mixed.numerator, mixed.denominator);
    }
    if (mixed.numerator === 0) {
      return mixed.whole.toString();
    }
    return `${mixed.whole} ${formatFraction(mixed.numerator, mixed.denominator)}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-3 rounded-xl">
              <Divide className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор дробей</CardTitle>
              <CardDescription>
                Операции с обыкновенными дробями: сложение, вычитание, умножение, деление
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-4 block">Первая дробь</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="1"
                  value={num1}
                  onChange={(e) => setNum1(e.target.value)}
                  className="text-center text-lg"
                />
                <span className="text-2xl font-bold">/</span>
                <Input
                  type="number"
                  placeholder="2"
                  value={den1}
                  onChange={(e) => setDen1(e.target.value)}
                  className="text-center text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Операция</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={operation === "add" ? "default" : "outline"}
                  onClick={() => setOperation("add")}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Сложение
                </Button>
                <Button
                  variant={operation === "subtract" ? "default" : "outline"}
                  onClick={() => setOperation("subtract")}
                  className="flex items-center gap-2"
                >
                  <Minus className="w-4 h-4" />
                  Вычитание
                </Button>
                <Button
                  variant={operation === "multiply" ? "default" : "outline"}
                  onClick={() => setOperation("multiply")}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Умножение
                </Button>
                <Button
                  variant={operation === "divide" ? "default" : "outline"}
                  onClick={() => setOperation("divide")}
                  className="flex items-center gap-2"
                >
                  <SquareSlash className="w-4 h-4" />
                  Деление
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-4 block">Вторая дробь</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="1"
                  value={num2}
                  onChange={(e) => setNum2(e.target.value)}
                  className="text-center text-lg"
                />
                <span className="text-2xl font-bold">/</span>
                <Input
                  type="number"
                  placeholder="3"
                  value={den2}
                  onChange={(e) => setDen2(e.target.value)}
                  className="text-center text-lg"
                />
              </div>
            </div>

            <Button 
              onClick={calculateFractions} 
              className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-lg py-6"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Рассчитать
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Divide className="w-5 h-5 text-purple-600" />
                      Результат вычисления
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Пример */}
                    <div className="bg-white rounded-lg p-4 border border-purple-200 text-center">
                      <p className="text-lg">
                        <span className="font-mono">
                          {formatFraction(result.original.fraction1.numerator, result.original.fraction1.denominator)}
                        </span>
                        <span className="mx-3 text-xl">{getOperationSymbol(result.original.operation)}</span>
                        <span className="font-mono">
                          {formatFraction(result.original.fraction2.numerator, result.original.fraction2.denominator)}
                        </span>
                        <span className="mx-3 text-xl">=</span>
                        <span className="font-mono font-bold text-purple-600">
                          {formatFraction(result.simplified.numerator, result.simplified.denominator)}
                        </span>
                      </p>
                    </div>

                    {/* Различные представления результата */}
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <p className="text-sm text-gray-600 mb-1">Упрощенная дробь</p>
                        <p className="text-xl font-bold text-purple-600 font-mono">
                          {formatFraction(result.simplified.numerator, result.simplified.denominator)}
                        </p>
                      </div>

                      {(Math.abs(result.simplified.numerator) > Math.abs(result.simplified.denominator)) && (
                        <div className="bg-white rounded-lg p-3 border border-purple-200">
                          <p className="text-sm text-gray-600 mb-1">Смешанное число</p>
                          <p className="text-xl font-bold text-purple-600 font-mono">
                            {formatMixed(result.mixed)}
                          </p>
                        </div>
                      )}

                      <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <p className="text-sm text-gray-600 mb-1">Десятичная дробь</p>
                        <p className="text-xl font-bold text-purple-600 font-mono">
                          {result.decimal.toFixed(6).replace(/\.?0+$/, '')}
                        </p>
                      </div>
                    </div>

                    {/* Показать исходный результат если он отличается от упрощенного */}
                    {(result.raw.numerator !== result.simplified.numerator || 
                      result.raw.denominator !== result.simplified.denominator) && (
                      <div className="text-xs text-gray-500 bg-white p-2 rounded">
                        <p>
                          <strong>До упрощения:</strong> {formatFraction(result.raw.numerator, result.raw.denominator)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50">
                <CardContent className="text-center py-12">
                  <Divide className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Введите числители и знаменатели дробей
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Examples Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Примеры операций с дробями</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Сложение и вычитание</h3>
              <div className="space-y-2 text-sm font-mono bg-gray-50 p-3 rounded">
                <p>1/2 + 1/3 = 3/6 + 2/6 = 5/6</p>
                <p>3/4 - 1/2 = 3/4 - 2/4 = 1/4</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Умножение и деление</h3>
              <div className="space-y-2 text-sm font-mono bg-gray-50 p-3 rounded">
                <p>2/3 × 3/4 = 6/12 = 1/2</p>
                <p>1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Правила работы с дробями</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Основы</h3>
              <ul className="text-sm space-y-1">
                <li>• <strong>Числитель</strong> — число над чертой</li>
                <li>• <strong>Знаменатель</strong> — число под чертой</li>
                <li>• Знаменатель не может быть равен нулю</li>
                <li>• Дробь показывает часть от целого</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Упрощение</h3>
              <ul className="text-sm space-y-1">
                <li>• Найти НОД числителя и знаменателя</li>
                <li>• Разделить оба числа на НОД</li>
                <li>• Получить несократимую дробь</li>
                <li>• 6/8 = 3/4 (НОД = 2)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FractionsCalculator;