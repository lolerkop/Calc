import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Coins } from "lucide-react";

const StakingCalculator = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-xl">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Калькулятор стейкинга</CardTitle>
              <CardDescription>
                Доходность от стейкинга криптовалют
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Калькулятор в разработке</h3>
          <p className="text-gray-600">
            Этот калькулятор будет добавлен в ближайшее время
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakingCalculator;