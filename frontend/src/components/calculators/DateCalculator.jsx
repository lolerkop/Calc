import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Calendar, Calculator, Plus, Minus } from "lucide-react";

const DateCalculator = () => {
  // Разность дат
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result1, setResult1] = useState(null);

  // Добавление/вычитание дней
  const [baseDate, setBaseDate] = useState("");
  const [daysToAdd, setDaysToAdd] = useState("");
  const [operation, setOperation] = useState("add");
  const [result2, setResult2] = useState(null);

  // Возраст
  const [birthDate, setBirthDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [result3, setResult3] = useState(null);

  const calculateDateDifference = useCallback(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!startDate || !endDate || start >= end) {
      return;
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30.44); // Средняя длина месяца
    const diffYears = Math.floor(diffDays / 365.25); // Учитываем високосные годы

    // Более точный расчет лет, месяцев и дней
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setResult1({
      startDate: start.toLocaleDateString('ru-RU'),
      endDate: end.toLocaleDateString('ru-RU'),
      totalDays: diffDays,
      totalWeeks: diffWeeks,
      totalMonths: diffMonths,
      totalYears: diffYears,
      exactYears: years,
      exactMonths: months,
      exactDays: days,
      businessDays: calculateBusinessDays(start, end)
    });
  }, [startDate, endDate]);

  const calculateBusinessDays = (startDate, endDate) => {
    let count = 0;
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Не воскресенье и не суббота
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  };

  const calculateNewDate = useCallback(() => {
    const base = new Date(baseDate);
    const days = parseInt(daysToAdd);

    if (!baseDate || !days) {
      return;
    }

    const newDate = new Date(base);
    if (operation === "add") {
      newDate.setDate(base.getDate() + days);
    } else {
      newDate.setDate(base.getDate() - days);
    }

    setResult2({
      baseDate: base.toLocaleDateString('ru-RU'),
      operation: operation,
      days: Math.abs(days),
      newDate: newDate.toLocaleDateString('ru-RU'),
      dayOfWeek: newDate.toLocaleDateString('ru-RU', { weekday: 'long' }),
      fullDate: newDate
    });
  }, [baseDate, daysToAdd, operation]);

  const calculateAge = useCallback(() => {
    const birth = new Date(birthDate);
    const current = new Date(currentDate);

    if (!birthDate || !currentDate || birth >= current) {
      return;
    }

    let years = current.getFullYear() - birth.getFullYear();
    let months = current.getMonth() - birth.getMonth();
    let days = current.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(current.getFullYear(), current.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((current - birth) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = Math.floor(totalDays / 30.44);

    // Следующий день рождения
    const nextBirthday = new Date(current.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < current) {
      nextBirthday.setFullYear(current.getFullYear() + 1);
    }
    
    const daysUntilBirthday = Math.ceil((nextBirthday - current) / (1000 * 60 * 60 * 24));

    setResult3({
      birthDate: birth.toLocaleDateString('ru-RU'),
      currentDate: current.toLocaleDateString('ru-RU'),
      years: years,
      months: months,
      days: days,
      totalDays: totalDays,
      totalWeeks: totalWeeks,
      totalMonths: totalMonths,
      nextBirthday: nextBirthday.toLocaleDateString('ru-RU'),
      daysUntilBirthday: daysUntilBirthday
    });
  }, [birthDate, currentDate]);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор дат</CardTitle>
              <CardDescription>
                Разница между датами, добавление дней, расчет возраста
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="difference" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="difference">Разность дат</TabsTrigger>
              <TabsTrigger value="add-days">Добавить дни</TabsTrigger>
              <TabsTrigger value="age">Возраст</TabsTrigger>
            </TabsList>

            {/* Разность между датами */}
            <TabsContent value="difference" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Разность между датами</h3>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Начальная дата</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Конечная дата</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <Button onClick={calculateDateDifference} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать разность
                  </Button>
                </div>
                <div>
                  {result1 ? (
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-purple-600">
                            {result1.totalDays}
                          </p>
                          <p className="text-sm text-gray-600">дней</p>
                        </div>
                        
                        <div className="bg-white rounded p-3 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Точно:</span>
                            <span className="font-semibold">
                              {result1.exactYears} лет, {result1.exactMonths} мес., {result1.exactDays} дн.
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Недель:</span>
                            <span className="font-semibold">{result1.totalWeeks}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Месяцев:</span>
                            <span className="font-semibold">{result1.totalMonths}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Лет:</span>
                            <span className="font-semibold">{result1.totalYears}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Рабочих дней:</span>
                            <span className="font-semibold">{result1.businessDays}</span>
                          </div>
                        </div>

                        <Badge variant="secondary" className="w-full justify-center">
                          С {result1.startDate} по {result1.endDate}
                        </Badge>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Выберите даты для расчета</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Добавление/вычитание дней */}
            <TabsContent value="add-days" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Добавить/отнять дни</h3>
                  <div className="space-y-2">
                    <Label htmlFor="baseDate">Базовая дата</Label>
                    <Input
                      id="baseDate"
                      type="date"
                      value={baseDate}
                      onChange={(e) => setBaseDate(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={operation === "add" ? "default" : "outline"}
                      onClick={() => setOperation("add")}
                      className="flex-1"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Добавить
                    </Button>
                    <Button
                      variant={operation === "subtract" ? "default" : "outline"}
                      onClick={() => setOperation("subtract")}
                      className="flex-1"
                    >
                      <Minus className="w-4 h-4 mr-1" />
                      Отнять
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="daysToAdd">Количество дней</Label>
                    <Input
                      id="daysToAdd"
                      type="number"
                      placeholder="30"
                      value={daysToAdd}
                      onChange={(e) => setDaysToAdd(e.target.value)}
                    />
                  </div>
                  <Button onClick={calculateNewDate} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать дату
                  </Button>
                </div>
                <div>
                  {result2 ? (
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {result2.newDate}
                          </p>
                          <p className="text-sm text-gray-600 capitalize">
                            {result2.dayOfWeek}
                          </p>
                        </div>
                        
                        <div className="bg-white rounded p-3 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Базовая дата:</span>
                            <span className="font-semibold">{result2.baseDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Операция:</span>
                            <span className="font-semibold">
                              {result2.operation === "add" ? "+" : "−"}{result2.days} дней
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Результат:</span>
                            <span className="font-semibold">{result2.newDate}</span>
                          </div>
                        </div>

                        <Badge variant="secondary" className="w-full justify-center">
                          {result2.operation === "add" ? "Добавлено" : "Отнято"} {result2.days} дней
                        </Badge>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Результат появится здесь</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Расчет возраста */}
            <TabsContent value="age" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Расчет возраста</h3>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Дата рождения</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentDate">Дата расчета (по умолчанию сегодня)</Label>
                    <Input
                      id="currentDate"
                      type="date"
                      value={currentDate}
                      onChange={(e) => setCurrentDate(e.target.value)}
                    />
                  </div>
                  <Button onClick={calculateAge} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Рассчитать возраст
                  </Button>
                </div>
                <div>
                  {result3 ? (
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-purple-600">
                            {result3.years}
                          </p>
                          <p className="text-sm text-gray-600">лет</p>
                        </div>
                        
                        <div className="bg-white rounded p-3 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Точный возраст:</span>
                            <span className="font-semibold">
                              {result3.years} лет, {result3.months} мес., {result3.days} дн.
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Всего дней:</span>
                            <span className="font-semibold">{result3.totalDays.toLocaleString('ru-RU')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Всего недель:</span>
                            <span className="font-semibold">{result3.totalWeeks.toLocaleString('ru-RU')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Всего месяцев:</span>
                            <span className="font-semibold">{result3.totalMonths}</span>
                          </div>
                        </div>

                        <div className="bg-white rounded p-3 text-center">
                          <p className="text-sm text-gray-600 mb-1">Следующий день рождения</p>
                          <p className="font-semibold">{result3.nextBirthday}</p>
                          <Badge variant="secondary" className="mt-2">
                            Через {result3.daysUntilBirthday} дней
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Введите дату рождения</p>
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
          <CardTitle>Полезная информация о датах</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Рабочие дни</h3>
              <p className="text-sm text-gray-600 mb-2">
                Рабочими считаются дни с понедельника по пятницу, 
                исключая выходные (суббота и воскресенье).
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Високосные годы</h3>
              <p className="text-sm text-gray-600 mb-2">
                Високосный год содержит 366 дней вместо 365. 
                Происходит каждые 4 года (с некоторыми исключениями).
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Точность расчетов</h3>
              <p className="text-sm text-gray-600 mb-2">
                Калькулятор учитывает различную длину месяцев 
                и високосные годы для максимальной точности.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DateCalculator;