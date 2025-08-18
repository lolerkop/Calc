import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  TrendingUp, 
  Home as HomeIcon, 
  Heart, 
  GraduationCap, 
  Briefcase, 
  Bitcoin,
  Calculator,
  Star,
  ArrowRight
} from "lucide-react";

const HomePage = () => {
  const categories = [
    {
      id: "finance",
      name: "Финансы",
      description: "Сложный процент, инвестиции, вклады, инфляция, конвертер валют",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
      calculators: 5,
      popular: true
    },
    {
      id: "credit",
      name: "Кредиты и ипотека",
      description: "Ипотека, кредиты, автокредиты, рефинансирование",
      icon: HomeIcon,
      color: "from-blue-500 to-cyan-600",
      calculators: 4,
      popular: true
    },
    {
      id: "health",
      name: "Здоровье и спорт", 
      description: "Калории, ИМТ, норма воды, калькулятор для бега",
      icon: Heart,
      color: "from-red-500 to-pink-600",
      calculators: 4,
      popular: false
    },
    {
      id: "education",
      name: "Учёба и повседневка",
      description: "Проценты, дроби, калькулятор дат, времени",
      icon: GraduationCap,
      color: "from-purple-500 to-violet-600",
      calculators: 4,
      popular: false
    },
    {
      id: "business",
      name: "Для бизнеса",
      description: "НДС, налоги, зарплата, маржинальность",
      icon: Briefcase,
      color: "from-orange-500 to-amber-600",
      calculators: 4,
      popular: true
    },
    {
      id: "crypto",
      name: "Криптовалюта и IT",
      description: "Майнинг, стейкинг, конвертер криптовалют, окупаемость видеокарт",
      icon: Bitcoin,
      color: "from-yellow-500 to-orange-600",
      calculators: 4,
      popular: false
    }
  ];

  const stats = [
    { label: "Категорий", value: "6" },
    { label: "Калькуляторов", value: "25+" },
    { label: "Пользователей", value: "10K+" },
    { label: "Расчетов в день", value: "50K+" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
            <Calculator className="h-16 w-16 text-white" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          CALC.IT
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
          Все калькуляторы онлайн в одном месте
        </p>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          Универсальный сервис для финансовых, учебных, спортивных и бизнес-расчетов. 
          Быстро, точно, удобно.
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Категории калькуляторов</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} to={`/category/${category.id}`}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`bg-gradient-to-r ${category.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        {category.popular && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Популярно
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {category.calculators} калькуляторов
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      variant="ghost" 
                      className="w-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
                    >
                      Перейти к калькуляторам
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8">Почему выбирают CALC.IT?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Точные расчеты</h3>
            <p className="text-gray-600">Все калькуляторы используют проверенные формулы и алгоритмы</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Удобный интерфейс</h3>
            <p className="text-gray-600">Интуитивно понятный дизайн, адаптивная верстка для всех устройств</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Всегда актуально</h3>
            <p className="text-gray-600">Регулярно обновляем калькуляторы и добавляем новые</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;