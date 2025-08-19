import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Clock, Calculator, Plus, Minus } from "lucide-react";

const TimeCalculator = () => {
  // Сложение времени
  const [hours1, setHours1] = useState("");
  const [minutes1, setMinutes1] = useState("");
  const [seconds1, setSeconds1] = useState("");
  const [hours2, setHours2] = useState("");
  const [minutes2, setMinutes2] = useState("");
  const [seconds2, setSeconds2] = useState("");
  const [addResult, setAddResult] = useState(null);

  // Вычитание времени
  const [startHours, setStartHours] = useState("");
  const [startMinutes, setStartMinutes] = useState("");
  const [startSeconds, setStartSeconds] = useState("");
  const [endHours, setEndHours] = useState("");
  const [endMinutes, setEndMinutes] = useState("");
  const [endSeconds, setEndSeconds] = useState("");
  const [subtractResult, setSubtractResult] = useState(null);

  // Конвертация времени
  const [totalSeconds, setTotalSeconds] = useState("");
  const [convertResult, setConvertResult] = useState(null);

  const formatTime = (hours, minutes, seconds) => {
    const h = Math.floor(hours);
    const m = Math.floor(minutes);
    const s = Math.floor(seconds);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculateAddition = useCallback(() => {
    const h1 = parseInt(hours1) || 0;
    const m1 = parseInt(minutes1) || 0;
    const s1 = parseInt(seconds1) || 0;
    const h2 = parseInt(hours2) || 0;
    const m2 = parseInt(minutes2) || 0;
    const s2 = parseInt(seconds2) || 0;

    if (h1 < 0 || m1 < 0 || s1 < 0 || h2 < 0 || m2 < 0 || s2 < 0) return;
    if (m1 >= 60 || s1 >= 60 || m2 >= 60 || s2 >= 60) return;

    const totalSec = s1 + s2;
    const totalMin = m1 + m2 + Math.floor(totalSec / 60);
    const totalHr = h1 + h2 + Math.floor(totalMin / 60);

    const resultSeconds = totalSec % 60;
    const resultMinutes = totalMin % 60;
    const resultHours = totalHr;

    setAddResult({
      time1: formatTime(h1, m1, s1),
      time2: formatTime(h2, m2, s2),
      result: formatTime(resultHours, resultMinutes, resultSeconds),
      totalSeconds: h1 * 3600 + m1 * 60 + s1 + h2 * 3600 + m2 * 60 + s2
    });
  }, [hours1, minutes1, seconds1, hours2, minutes2, seconds2]);

  const calculateSubtraction = useCallback(() => {
    const sh = parseInt(startHours) || 0;
    const sm = parseInt(startMinutes) || 0;
    const ss = parseInt(startSeconds) || 0;
    const eh = parseInt(endHours) || 0;
    const em = parseInt(endMinutes) || 0;
    const es = parseInt(endSeconds) || 0;

    if (sh < 0 || sm < 0 || ss < 0 || eh < 0 || em < 0 || es < 0) return;
    if (sm >= 60 || ss >= 60 || em >= 60 || es >= 60) return;

    const startTotalSeconds = sh * 3600 + sm * 60 + ss;
    const endTotalSeconds = eh * 3600 + em * 60 + es;
    const diffSeconds = Math.abs(endTotalSeconds - startTotalSeconds);

    const resultHours = Math.floor(diffSeconds / 3600);
    const resultMinutes = Math.floor((diffSeconds % 3600) / 60);
    const resultSecs = diffSeconds % 60;

    setSubtractResult({
      startTime: formatTime(sh, sm, ss),
      endTime: formatTime(eh, em, es),
      result: formatTime(resultHours, resultMinutes, resultSecs),
      totalSeconds: diffSeconds,
      isNegative: endTotalSeconds < startTotalSeconds
    });
  }, [startHours, startMinutes, startSeconds, endHours, endMinutes, endSeconds]);

  const calculateConversion = useCallback(() => {
    const seconds = parseInt(totalSeconds);
    if (!seconds || seconds < 0) return;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    setConvertResult({
      originalSeconds: seconds,
      time: formatTime(hours, minutes, remainingSeconds),
      days: days,
      hours: remainingHours,
      minutes: minutes,
      seconds: remainingSeconds,
      totalMinutes: Math.floor(seconds / 60),
      totalHours: Math.floor(seconds / 3600)
    });
  }, [totalSeconds]);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор времени</CardTitle>
              <CardDescription>
                Операции со временем и временными интервалами
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="add">Сложение</TabsTrigger>
              <TabsTrigger value="subtract">Разность</TabsTrigger>
              <TabsTrigger value="convert">Конвертация</TabsTrigger>
            </TabsList>

            {/* Сложение времени */}
            <TabsContent value="add" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Первое время</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="hours1">Часы</Label>
                      <Input
                        id="hours1"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={hours1}
                        onChange={(e) => setHours1(e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="minutes1">Минуты</Label>
                      <Input
                        id="minutes1"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={minutes1}
                        onChange={(e) => setMinutes1(e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="seconds1">Секунды</Label>
                      <Input
                        id="seconds1"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={seconds1}
                        onChange={(e) => setSeconds1(e.target.value)}
                        className="text-center"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Второе время</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="hours2">Часы</Label>
                      <Input
                        id="hours2"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={hours2}
                        onChange={(e) => setHours2(e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="minutes2">Минуты</Label>
                      <Input
                        id="minutes2"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={minutes2}
                        onChange={(e) => setMinutes2(e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="seconds2">Секунды</Label>
                      <Input
                        id="seconds2"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={seconds2}
                        onChange={(e) => setSeconds2(e.target.value)}
                        className="text-center"
                      />
                    </div>
                  </div>

                  <Button onClick={calculateAddition} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Сложить время
                  </Button>
                </div>

                <div>
                  {addResult ? (
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold font-mono text-purple-600">
                            {addResult.result}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {addResult.time1} + {addResult.time2}
                          </p>
                        </div>
                        <div className="bg-white rounded p-3">
                          <p className="text-sm text-gray-600">Всего секунд: {addResult.totalSeconds}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Результат появится здесь</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Вычитание времени */}
            <TabsContent value="subtract" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Начальное время</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="startHours">Часы</Label>
                      <Input
                        id="startHours"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={startHours}
                        onChange={(e) => setStartHours(e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="startMinutes">Минуты</Label>
                      <Input
                        id="startMinutes"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={startMinutes}
                        onChange={(e) => setStartMinutes(e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="startSeconds">Секунды</Label>
                      <Input
                        id="startSeconds"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={startSeconds}
                        onChange={(e) => setStartSeconds(e.target.value)}
                        className="text-center"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold">Конечное время</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="endHours">Часы</Label>
                      <Input
                        id="endHours"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={endHours}
                        onChange={(e) => setEndHours(e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="endMinutes">Минуты</Label>
                      <Input
                        id="endMinutes"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={endMinutes}
                        onChange={(e) => setEndMinutes(e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="endSeconds">Секунды</Label>
                      <Input
                        id="endSeconds"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={endSeconds}
                        onChange={(e) => setEndSeconds(e.target.value)}
                        className="text-center"
                      />
                    </div>
                  </div>

                  <Button onClick={calculateSubtraction} className="w-full">
                    <Minus className="w-4 h-4 mr-2" />
                    Найти разность
                  </Button>
                </div>

                <div>
                  {subtractResult ? (
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold font-mono text-purple-600">
                            {subtractResult.result}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {subtractResult.endTime} - {subtractResult.startTime}
                          </p>
                        </div>
                        <div className="bg-white rounded p-3">
                          <p className="text-sm text-gray-600">Всего секунд: {subtractResult.totalSeconds}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Результат появится здесь</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Конвертация времени */}
            <TabsContent value="convert" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Конвертировать секунды в время</h3>
                  <div className="space-y-2">
                    <Label htmlFor="totalSeconds">Количество секунд</Label>
                    <Input
                      id="totalSeconds"
                      type="number"
                      min="0"
                      placeholder="3661"
                      value={totalSeconds}
                      onChange={(e) => setTotalSeconds(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <Button onClick={calculateConversion} className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Конвертировать
                  </Button>
                </div>

                <div>
                  {convertResult ? (
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold font-mono text-purple-600">
                            {convertResult.time}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {convertResult.originalSeconds} секунд
                          </p>
                        </div>
                        
                        {convertResult.days > 0 && (
                          <div className="bg-white rounded p-3">
                            <p className="text-sm">
                              <strong>{convertResult.days}</strong> дней, 
                              <strong> {convertResult.hours}</strong> часов, 
                              <strong> {convertResult.minutes}</strong> минут, 
                              <strong> {convertResult.seconds}</strong> секунд
                            </p>
                          </div>
                        )}

                        <div className="bg-white rounded p-3 space-y-1 text-sm">
                          <p><strong>Всего минут:</strong> {convertResult.totalMinutes}</p>
                          <p><strong>Всего часов:</strong> {convertResult.totalHours}</p>
                          {convertResult.days > 0 && (
                            <p><strong>Всего дней:</strong> {Math.floor(convertResult.totalHours / 24)}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="text-center py-12">
                        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
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

      {/* Examples Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Примеры использования</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Сложение времени</h3>
              <ul className="text-sm space-y-2">
                <li>• Суммирование рабочих часов</li>
                <li>• Общее время проектов</li>
                <li>• Время в пути</li>
                <li>• Продолжительность видео</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Разность времени</h3>
              <ul className="text-sm space-y-2">
                <li>• Продолжительность работы</li>
                <li>• Время между событиями</li>
                <li>• Длительность перерывов</li>
                <li>• Возраст в часах/минутах</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Конвертация</h3>
              <ul className="text-sm space-y-2">
                <li>• Секунды в часы</li>
                <li>• Unix timestamp</li>
                <li>• Время выполнения программ</li>
                <li>• Продолжительность процессов</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeCalculator;