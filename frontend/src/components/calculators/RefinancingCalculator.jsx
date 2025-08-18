import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { RefreshCw } from "lucide-react";

const RefinancingCalculator = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор рефинансирования</CardTitle>
              <CardDescription>
                Выгода от перекредитования займа
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center py-12">
          <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Калькулятор в разработке</h3>
          <p className="text-gray-600">
            Этот калькулятор будет добавлен в ближайшее время
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefinancingCalculator;