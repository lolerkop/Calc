import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { MonitorSpeaker } from "lucide-react";

const GPUROICalculator = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-xl">
              <MonitorSpeaker className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Окупаемость видеокарт</CardTitle>
              <CardDescription>
                Расчет окупаемости видеокарт для майнинга
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center py-12">
          <MonitorSpeaker className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Калькулятор в разработке</h3>
          <p className="text-gray-600">
            Этот калькулятор будет добавлен в ближайшее время
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GPUROICalculator;