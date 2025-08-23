import React from "react";
import { Link } from "react-router-dom";
import { Calculator, Mail, Globe, Shield, FileText, Info } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О проекте */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">CALC.IT</h3>
                <p className="text-sm text-gray-400">все калькуляторы онлайн</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Универсальный сервис онлайн-калькуляторов для всех сфер жизни. 
              Финансовые, учебные, спортивные и бизнес-расчеты в одном месте.
            </p>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Бесплатно • Без регистрации • Точные расчеты</span>
            </div>
          </div>

          {/* Категории калькуляторов */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Калькуляторы
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/category/finance" className="hover:text-white transition-colors hover:underline">Финансы и инвестиции</Link></li>
              <li><Link to="/category/credit" className="hover:text-white transition-colors hover:underline">Кредиты и ипотека</Link></li>
              <li><Link to="/category/health" className="hover:text-white transition-colors hover:underline">Здоровье и спорт</Link></li>
              <li><Link to="/category/education" className="hover:text-white transition-colors hover:underline">Учёба и повседневное</Link></li>
              <li><Link to="/category/business" className="hover:text-white transition-colors hover:underline">Для бизнеса</Link></li>
              <li><Link to="/category/crypto" className="hover:text-white transition-colors hover:underline">Криптовалюта и IT</Link></li>
            </ul>
          </div>

          {/* Популярные калькуляторы */}
          <div>
            <h4 className="font-semibold mb-4">Популярные</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/calculator/mortgage" className="hover:text-white transition-colors hover:underline">Ипотечный калькулятор</Link></li>
              <li><Link to="/calculator/loan" className="hover:text-white transition-colors hover:underline">Кредитный калькулятор</Link></li>
              <li><Link to="/calculator/currency-converter" className="hover:text-white transition-colors hover:underline">Конвертер валют</Link></li>
              <li><Link to="/calculator/bmi" className="hover:text-white transition-colors hover:underline">Калькулятор ИМТ</Link></li>
              <li><Link to="/calculator/vat" className="hover:text-white transition-colors hover:underline">Калькулятор НДС</Link></li>
              <li><Link to="/calculator/compound-interest" className="hover:text-white transition-colors hover:underline">Сложный процент</Link></li>
            </ul>
          </div>

          {/* Информация и контакты */}
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <div className="space-y-3">
              {/* Дополнительные страницы */}
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <Link to="/about" className="hover:text-white transition-colors hover:underline">О проекте CALC.IT</Link>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <Link to="/privacy" className="hover:text-white transition-colors hover:underline">Политика конфиденциальности</Link>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <Link to="/terms" className="hover:text-white transition-colors hover:underline">Пользовательское соглашение</Link>
                </div>
              </div>
              
              {/* Контакты */}
              <div className="pt-3 border-t border-gray-800">
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <a href="mailto:info@calc.it" className="hover:text-white transition-colors">info@calc.it</a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span>calc-it.ru</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2025 CALC.IT. Все права защищены.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
              <span className="bg-gray-800 px-2 py-1 rounded">25+ калькуляторов</span>
              <span className="bg-gray-800 px-2 py-1 rounded">Без регистрации</span>
              <span className="bg-gray-800 px-2 py-1 rounded">Актуальные данные</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;