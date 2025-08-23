import React, { Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { getCalculatorData, getCategoryData } from "../utils/calculatorData";
import { getSEOData } from "../utils/seoData";
import SEOHead from "../components/SEOHead";
import SEOContent from "../components/SEOContent";
import CalculatorNavigation from "../components/CalculatorNavigation";

// Ленивые импорты калькуляторов для оптимизации производительности
const CompoundInterestCalculator = React.lazy(() => import("../components/calculators/CompoundInterestCalculator"));
const InvestmentCalculator = React.lazy(() => import("../components/calculators/InvestmentCalculator"));
const DepositCalculator = React.lazy(() => import("../components/calculators/DepositCalculator"));
const InflationCalculator = React.lazy(() => import("../components/calculators/InflationCalculator"));
const CurrencyConverter = React.lazy(() => import("../components/calculators/CurrencyConverter"));
const MortgageCalculator = React.lazy(() => import("../components/calculators/MortgageCalculator"));
const LoanCalculator = React.lazy(() => import("../components/calculators/LoanCalculator"));
const AutoLoanCalculator = React.lazy(() => import("../components/calculators/AutoLoanCalculator"));
const RefinancingCalculator = React.lazy(() => import("../components/calculators/RefinancingCalculator"));
const CaloriesCalculator = React.lazy(() => import("../components/calculators/CaloriesCalculator"));
const BMICalculator = React.lazy(() => import("../components/calculators/BMICalculator"));
const WaterCalculator = React.lazy(() => import("../components/calculators/WaterCalculator"));
const RunningCalculator = React.lazy(() => import("../components/calculators/RunningCalculator"));
const PercentageCalculator = React.lazy(() => import("../components/calculators/PercentageCalculator"));
const FractionsCalculator = React.lazy(() => import("../components/calculators/FractionsCalculator"));
const DateCalculator = React.lazy(() => import("../components/calculators/DateCalculator"));
const TimeCalculator = React.lazy(() => import("../components/calculators/TimeCalculator"));
const VATCalculator = React.lazy(() => import("../components/calculators/VATCalculator"));
const TaxesCalculator = React.lazy(() => import("../components/calculators/TaxesCalculator"));
const SalaryCalculator = React.lazy(() => import("../components/calculators/SalaryCalculator"));
const MarginCalculator = React.lazy(() => import("../components/calculators/MarginCalculator"));
const MiningCalculator = React.lazy(() => import("../components/calculators/MiningCalculator"));
const StakingCalculator = React.lazy(() => import("../components/calculators/StakingCalculator"));
const CryptoConverter = React.lazy(() => import("../components/calculators/CryptoConverter"));

const CalculatorPage = () => {
  const { calculatorId } = useParams();
  const calculatorData = getCalculatorData(calculatorId);
  const seoData = getSEOData(calculatorId);

  if (!calculatorData) {
    return (
      <>
        <SEOHead 
          title="Калькулятор не найден | CALC.IT"
          description="Запрашиваемый калькулятор не найден. Вернитесь на главную страницу чтобы выбрать нужный калькулятор."
          canonicalUrl={`/calculator/${calculatorId}`}
          noindex={true}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Калькулятор не найден</h1>
            <Link to="/">
              <Button>Вернуться на главную</Button>
          </Link>
        </div>
      </div>
      </>
    );
  }

  const categoryData = getCategoryData(calculatorData.category);

  // Создаем структурированные данные для калькулятора
  const structuredData = seoData ? {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": calculatorData.name,
    "description": calculatorData.description,
    "url": `https://calcit-suite.preview.emergentagent.com/calculator/${calculatorId}`,
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
    }
  } : null;

  const renderCalculator = () => {
    switch (calculatorId) {
      case "compound-interest":
        return <CompoundInterestCalculator />;
      case "investment":
        return <InvestmentCalculator />;
      case "deposit":
        return <DepositCalculator />;
      case "inflation":
        return <InflationCalculator />;
      case "currency-converter":
        return <CurrencyConverter />;
      case "mortgage":
        return <MortgageCalculator />;
      case "loan":
        return <LoanCalculator />;
      case "auto-loan":
        return <AutoLoanCalculator />;
      case "refinancing":
        return <RefinancingCalculator />;
      case "calories":
        return <CaloriesCalculator />;
      case "bmi":
        return <BMICalculator />;
      case "water":
        return <WaterCalculator />;
      case "running":
        return <RunningCalculator />;
      case "percentage":
        return <PercentageCalculator />;
      case "fractions":
        return <FractionsCalculator />;
      case "date-calculator":
        return <DateCalculator />;
      case "time-calculator":
        return <TimeCalculator />;
      case "vat":
        return <VATCalculator />;
      case "taxes":
        return <TaxesCalculator />;
      case "salary":
        return <SalaryCalculator />;
      case "margin":
        return <MarginCalculator />;
      case "mining":
        return <MiningCalculator />;
      case "staking":
        return <StakingCalculator />;
      case "crypto-converter":
        return <CryptoConverter />;
      default:
        return <div>Калькулятор в разработке</div>;
    }
  };

  return (
    <>
      {/* SEO Head */}
      <SEOHead 
        title={seoData?.title || `${calculatorData.name} онлайн | CALC.IT`}
        description={seoData?.description || calculatorData.description}
        keywords={seoData?.keywords || `${calculatorData.name}, калькулятор онлайн`}
        canonicalUrl={`/calculator/${calculatorId}`}
        structuredData={structuredData}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 mb-8 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Главная
          </Link>
          <span>/</span>
          <Link 
            to={`/category/${calculatorData.category}`} 
            className="hover:text-blue-600 transition-colors"
          >
            {categoryData?.title}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{calculatorData.name}</span>
        </div>

        {/* Header with SEO H1 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {seoData?.h1 || `Калькулятор ${calculatorData.name.toLowerCase()}`}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {calculatorData.description}
          </p>
        </div>

        {/* Calculator Component */}
        <div className="mb-12">
          {renderCalculator()}
        </div>

        {/* Navigation between calculators */}
        <CalculatorNavigation currentCalculatorId={calculatorId} />

        {/* SEO Content */}
        <SEOContent seoData={seoData} />

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <Link to={`/category/${calculatorData.category}`}>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            ← Все калькуляторы категории
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            🏠 На главную
          </Button>
        </Link>
      </div>
    </div>
    </>
  );
};

export default CalculatorPage;