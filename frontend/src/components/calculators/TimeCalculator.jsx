import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Clock } from "lucide-react";

const TimeCalculator = () => {
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
        <CardContent className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Калькулятор в разработке</h3>
          <p className="text-gray-600">
            Этот калькулятор будет добавлен в ближайшее время
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeCalculator;