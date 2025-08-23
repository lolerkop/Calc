import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl, 
  ogImage,
  structuredData,
  calculatorId,
  noindex = true 
}) => {
  const baseUrl = 'https://calcit-suite.preview.emergentagent.com';
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const defaultImage = `${baseUrl}/og-image.jpg`;
  
  // Создаем базовые структурированные данные для калькуляторов
  const generateWebApplicationSchema = () => {
    if (!calculatorId) return null;

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": title,
      "url": fullCanonicalUrl,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "description": description,
      "isAccessibleForFree": true,
      "publisher": {
        "@type": "Organization",
        "name": "CALC.IT",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        }
      },
      "inLanguage": "ru",
      "browserRequirements": "Требуется JavaScript",
      "softwareVersion": "1.0",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "150",
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    // Добавляем категорию в зависимости от типа калькулятора
    const calculatorCategories = {
      'mortgage': 'FinanceApplication',
      'loan': 'FinanceApplication', 
      'compound-interest': 'FinanceApplication',
      'investment': 'FinanceApplication',
      'currency-converter': 'FinanceApplication',
      'crypto-converter': 'FinanceApplication',
      'bmi': 'MedicalApplication',
      'calories': 'HealthApplication',
      'water': 'HealthApplication',
      'running': 'SportsApplication',
      'vat': 'BusinessApplication',
      'taxes': 'BusinessApplication',
      'salary': 'BusinessApplication',
      'mining': 'UtilitiesApplication',
      'staking': 'UtilitiesApplication'
    };

    if (calculatorCategories[calculatorId]) {
      webAppSchema.applicationCategory = calculatorCategories[calculatorId];
    }

    return webAppSchema;
  };

  // Объединяем базовые структурированные данные с пользовательскими
  const getAllStructuredData = () => {
    const schemas = [];
    
    // Добавляем WebApplication schema
    const webAppSchema = generateWebApplicationSchema();
    if (webAppSchema) {
      schemas.push(webAppSchema);
    }

    // Добавляем пользовательские структурированные данные
    if (structuredData) {
      if (Array.isArray(structuredData)) {
        schemas.push(...structuredData);
      } else {
        schemas.push(structuredData);
      }
    }

    return schemas.length > 0 ? schemas : null;
  };

  const allStructuredData = getAllStructuredData();
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Предзагрузка критических ресурсов */}
      <link rel="preload" as="font" type="font/woff2" crossOrigin="" href="/fonts/inter-var.woff2" />
      <link rel="dns-prefetch" href="//api.exchangerate-api.com" />
      <link rel="dns-prefetch" href="//api.coingecko.com" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:site_name" content="CALC.IT" />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />
      <meta name="twitter:site" content="@calcit_online" />
      
      {/* Дополнительные мета-теги для мобильных устройств */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#3B82F6" />
      
      {/* Structured Data */}
      {allStructuredData && allStructuredData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema, null, 0)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;