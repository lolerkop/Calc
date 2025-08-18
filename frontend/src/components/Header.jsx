import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Calculator, Home, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const categories = [
    { id: "finance", name: "Финансы", path: "/category/finance" },
    { id: "credit", name: "Кредиты и ипотека", path: "/category/credit" },
    { id: "health", name: "Здоровье и спорт", path: "/category/health" },
    { id: "education", name: "Учёба и повседневка", path: "/category/education" },
    { id: "business", name: "Для бизнеса", path: "/category/business" },
    { id: "crypto", name: "Криптовалюта и IT", path: "/category/crypto" },
  ];

  return (
    <header className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CALC.IT
              </h1>
              <p className="text-xs text-gray-500">все калькуляторы онлайн</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "secondary" : "ghost"} 
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Главная
              </Button>
            </Link>
            {categories.map((category) => (
              <Link key={category.id} to={category.path}>
                <Button 
                  variant={location.pathname === category.path ? "secondary" : "ghost"} 
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {category.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant={location.pathname === "/" ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Главная
                  </Button>
                </Link>
                {categories.map((category) => (
                  <Link key={category.id} to={category.path} onClick={() => setIsOpen(false)}>
                    <Button 
                      variant={location.pathname === category.path ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                    >
                      {category.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;