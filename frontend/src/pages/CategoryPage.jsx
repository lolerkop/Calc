import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowRight, Calculator } from "lucide-react";
import { getCategoryData } from "../utils/calculatorData";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const categoryData = getCategoryData(categoryId);

  if (!categoryData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Категория не найдена</h1>
          <Link to="/">
            <Button>Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {categoryData.title}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {categoryData.description}
        </p>
        <Badge variant="secondary" className="mt-4">
          {categoryData.calculators.length} калькуляторов
        </Badge>
      </div>

      {/* Calculators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {categoryData.calculators.map((calculator, index) => (
          <Link key={calculator.id} to={`/calculator/${calculator.id}`}>
            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Calculator className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline">
                    #{index + 1}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                  {calculator.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {calculator.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  variant="ghost" 
                  className="w-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
                >
                  Открыть калькулятор
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Back to Categories */}
      <div className="text-center">
        <Link to="/">
          <Button variant="outline" size="lg">
            ← Все категории
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CategoryPage;