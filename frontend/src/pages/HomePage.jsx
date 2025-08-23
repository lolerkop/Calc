import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import { homeSEOData } from "../utils/seoData";
import { 
  TrendingUp, 
  Home as HomeIcon, 
  Heart, 
  GraduationCap, 
  Briefcase, 
  Bitcoin,
  Calculator,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Smartphone,
  HelpCircle
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
      popular: true,
      link: "/category/finance"
    },
    {
      id: "loans",
      name: "Кредиты и ипотека",
      description: "Ипотека, кредиты, автокредиты, рефинансирование",
      icon: HomeIcon,
      color: "from-blue-500 to-cyan-600", 
      calculators: 4,
      popular: true,
      link: "/category/loans"
    },
    {
      id: "health",
      name: "Здоровье и спорт", 
      description: "Калории, ИМТ, норма воды, калькулятор для бега",
      icon: Heart,
      color: "from-red-500 to-pink-600",
      calculators: 4,
      popular: false,
      link: "/category/health"
    },
    {
      id: "education", 
      name: "Учёба и повседневка",
      description: "Проценты, дроби, калькулятор дат, времени",
      icon: GraduationCap,
      color: "from-purple-500 to-violet-600",
      calculators: 4,
      popular: false,
      link: "/category/education"
    },
    {
      id: "business",
      name: "Для бизнеса",
      description: "НДС, налоги, зарплата, маржинальность",
      icon: Briefcase,
      color: "from-orange-500 to-amber-600",
      calculators: 4,
      popular: true,
      link: "/category/business"
    },
    {
      id: "cryptocurrency",
      name: "Криптовалюта и IT",
      description: "Майнинг, стейкинг, конвертер криптовалют",
      icon: Bitcoin,
      color: "from-yellow-500 to-orange-600", 
      calculators: 3,
      popular: false,
      link: "/category/cryptocurrency"
    }
  ];

  const stats = [
    { label: "Категорий", value: "6" },
    { label: "Калькуляторов", value: "24+" },
    { label: "Пользователей", value: "10K+" },
    { label: "Расчетов в день", value: "50K+" }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: "Точные расчеты",
      description: "Все калькуляторы используют проверенные формулы и алгоритмы, соответствующие международным стандартам",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Clock,
      title: "Мгновенные результаты",
      description: "Получайте результаты расчетов в режиме реального времени без задержек и ожидания",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Shield,
      title: "Безопасность данных",
      description: "Ваши данные не сохраняются на сервере. Все расчеты выполняются локально в браузере",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Smartphone,
      title: "Адаптивный дизайн",
      description: "Удобное использование на всех устройствах: компьютер, планшет, смартфон",
      color: "from-red-500 to-pink-600"
    }
  ];

  const popularCalculators = [
    { name: "Калькулятор ипотеки", url: "/calculator/mortgage", category: "Кредиты" },
    { name: "Конвертер валют", url: "/calculator/currency-converter", category: "Финансы" },
    { name: "Калькулятор сложного процента", url: "/calculator/compound-interest", category: "Финансы" },
    { name: "Калькулятор ИМТ", url: "/calculator/bmi", category: "Здоровье" },
    { name: "Калькулятор НДС", url: "/calculator/vat", category: "Бизнес" },
    { name: "Кредитный калькулятор", url: "/calculator/loan", category: "Кредиты" }
  ];

  const faqData = [
    {
      question: "Бесплатно ли пользоваться калькуляторами CALC.IT?",
      answer: "Да, все калькуляторы на нашем сайте абсолютно бесплатны. Мы не требуем регистрации и не ограничиваем количество расчетов."
    },
    {
      question: "Насколько точны расчеты калькуляторов?",
      answer: "Все наши калькуляторы используют проверенные математические формулы и алгоритмы. Точность расчетов соответствует профессиональным стандартам."
    },
    {
      question: "Можно ли использовать калькуляторы на мобильных устройствах?",
      answer: "Да, наш сайт полностью адаптирован для мобильных устройств. Все калькуляторы корректно работают на смартфонах и планшетах."
    },
    {
      question: "Сохраняются ли мои данные при использовании калькуляторов?",
      answer: "Нет, мы не сохраняем ваши персональные данные и результаты расчетов. Все вычисления происходят локально в вашем браузере."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CALC.IT",
    "description": homeSEOData.description,
    "url": "https://calcit-suite.preview.emergentagent.com",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "RUB"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "CALC.IT"
    },
    "featureList": [
      "Калькулятор ипотеки",
      "Кредитный калькулятор", 
      "Инвестиционный калькулятор",
      "Конвертер валют",
      "Калькулятор сложного процента",
      "Калькулятор НДС",
      "Калькулятор ИМТ",
      "Калькулятор майнинга"
    ]
  };

  return (
    <>
      <SEOHead 
        title={homeSEOData.title}
        description={homeSEOData.description}
        keywords={homeSEOData.keywords}
        canonicalUrl="/"
        structuredData={structuredData}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
              <Calculator className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            {homeSEOData.h1}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Универсальный сервис для финансовых, учебных, спортивных и бизнес-расчетов
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Более 25 профессиональных калькуляторов для решения повседневных и бизнес-задач. 
            Быстро, точно, удобно и совершенно бесплатно.
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

        {/* Popular Calculators */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Популярные калькуляторы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularCalculators.map((calc, index) => (
              <Link key={index} to={calc.url}>
                <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">{calc.name}</h3>
                        <Badge variant="outline" className="text-xs">{calc.category}</Badge>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="section-late mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Категории калькуляторов</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link key={category.id} to={category.link}>
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
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Преимущества CALC.IT</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SEO Text Section */}
        <div className="mb-16">
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-gray max-w-none">
                <h2>Профессиональные онлайн-калькуляторы для всех сфер жизни</h2>
                
                <p>
                  <strong>CALC.IT</strong> — это современная платформа, объединяющая более 25 специализированных калькуляторов 
                  для решения повседневных и профессиональных задач. Наш сервис предлагает точные расчеты в области финансов, 
                  кредитования, инвестиций, здоровья, образования, бизнеса и криптовалют.
                </p>
                
                <h3>Финансовые калькуляторы</h3>
                <p>
                  Раздел финансовых калькуляторов включает инструменты для расчета сложного процента, планирования инвестиций, 
                  оценки доходности вкладов, анализа влияния инфляции и конвертации валют в режиме реального времени. 
                  Эти калькуляторы помогут вам принимать обоснованные финансовые решения.
                </p>
                
                <h3>Кредитные и ипотечные калькуляторы</h3>
                <p>
                  Специализированные инструменты для расчета ипотеки, потребительских кредитов, автокредитов и оценки 
                  выгодности рефинансирования. Калькуляторы учитывают различные типы платежей, процентные ставки и 
                  позволяют сравнивать разные предложения банков.
                </p>
                
                <h3>Почему выбирают CALC.IT</h3>
                <ul>
                  <li>Все калькуляторы абсолютно бесплатны</li>
                  <li>Не требуется регистрация или установка приложений</li>
                  <li>Актуальные данные и курсы валют</li>
                  <li>Адаптивный дизайн для всех устройств</li>
                  <li>Безопасность — данные не сохраняются на сервере</li>
                  <li>Профессиональные алгоритмы расчетов</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center justify-center">
                <HelpCircle className="w-5 h-5" />
                Часто задаваемые вопросы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqData.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          })
        }}
      />
    </>
  );
};

export default HomePage;