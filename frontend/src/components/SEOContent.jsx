import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { ChevronRight, HelpCircle } from 'lucide-react';

const SEOContent = ({ seoData }) => {
  if (!seoData) return null;

  return (
    <div className="max-w-4xl mx-auto mt-12 space-y-8">
      {/* SEO текст */}
      <Card>
        <CardContent className="pt-6">
          <div 
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: seoData.seoText }}
          />
        </CardContent>
      </Card>

      {/* FAQ секция */}
      {seoData.faq && seoData.faq.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Часто задаваемые вопросы
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {seoData.faq.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Похожие калькуляторы */}
      {seoData.relatedCalculators && seoData.relatedCalculators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Смотрите также</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {seoData.relatedCalculators.map((calc, index) => (
                <Link 
                  key={index}
                  to={calc.url}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{calc.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* О сайте CALC.IT */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">О сайте CALC.IT</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <p className="mb-3">
            <strong>CALC.IT</strong> — это универсальный сервис онлайн-калькуляторов, который объединяет более 25 специализированных инструментов для решения повседневных и профессиональных задач.
          </p>
          <p className="mb-3">
            Наш сайт предлагает точные и быстрые расчеты в области финансов, кредитования, инвестиций, здоровья, образования, бизнеса и криптовалют. Все калькуляторы работают в режиме реального времени и не требуют регистрации.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Бесплатно</Badge>
            <Badge variant="secondary">Без регистрации</Badge>
            <Badge variant="secondary">Точные расчеты</Badge>
            <Badge variant="secondary">Актуальные данные</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Структурированные данные для FAQ */}
      {seoData.faq && seoData.faq.length > 0 && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": seoData.faq.map(item => ({
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
      )}
    </div>
  );
};

export default SEOContent;