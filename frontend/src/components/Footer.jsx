import React from "react";
import { Calculator, Mail, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <p className="text-gray-400 text-sm">
              Универсальный сервис онлайн-калькуляторов для всех сфер жизни. 
              Финансовые, учебные, спортивные и бизнес-расчеты в одном месте.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Категории</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/category/finance" className="hover:text-white transition-colors">Финансы</a></li>
              <li><a href="/category/credit" className="hover:text-white transition-colors">Кредиты и ипотека</a></li>
              <li><a href="/category/health" className="hover:text-white transition-colors">Здоровье и спорт</a></li>
              <li><a href="/category/education" className="hover:text-white transition-colors">Учёба и повседневка</a></li>
              <li><a href="/category/business" className="hover:text-white transition-colors">Для бизнеса</a></li>
              <li><a href="/category/crypto" className="hover:text-white transition-colors">Криптовалюта и IT</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@calc.it</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>www.calc.it</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 CALC.IT. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;