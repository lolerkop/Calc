// Данные всех калькуляторов организованные по категориям
export const calculatorData = {
  finance: {
    title: "Финансовые калькуляторы",
    description: "Калькуляторы для инвестиций, вкладов и финансового планирования",
    calculators: [
      {
        id: "compound-interest",
        name: "Сложный процент",
        description: "Расчет роста капитала с учетом реинвестирования процентов",
        category: "finance"
      },
      {
        id: "investment",
        name: "Инвестиции",
        description: "Планирование инвестиционного портфеля и доходности",
        category: "finance"
      },
      {
        id: "deposit",
        name: "Вклад",
        description: "Расчет доходности банковского вклада",
        category: "finance"
      },
      {
        id: "inflation",
        name: "Инфляция",
        description: "Влияние инфляции на покупательную способность",
        category: "finance"
      },
      {
        id: "currency-converter",
        name: "Конвертер валют",
        description: "Перевод валют по актуальному курсу",
        category: "finance"
      }
    ]
  },
  credit: {
    title: "Кредиты и ипотека",
    description: "Расчет кредитных платежей и условий займов",
    calculators: [
      {
        id: "mortgage",
        name: "Ипотека",
        description: "Расчет ежемесячных платежей по ипотеке",
        category: "credit"
      },
      {
        id: "loan",
        name: "Кредит",
        description: "Расчет параметров потребительского кредита",
        category: "credit"
      },
      {
        id: "auto-loan",
        name: "Автокредит",
        description: "Специальный калькулятор для автомобильных кредитов",
        category: "credit"
      },
      {
        id: "refinancing",
        name: "Рефинансирование",
        description: "Выгода от перекредитования займа",
        category: "credit"
      }
    ]
  },
  health: {
    title: "Здоровье и спорт",
    description: "Калькуляторы для поддержания здорового образа жизни",
    calculators: [
      {
        id: "calories",
        name: "Калории",
        description: "Расчет суточной нормы калорий",
        category: "health"
      },
      {
        id: "bmi",
        name: "ИМТ",
        description: "Индекс массы тела и рекомендации",
        category: "health"
      },
      {
        id: "water",
        name: "Норма воды",
        description: "Суточная потребность в жидкости",
        category: "health"
      },
      {
        id: "running",
        name: "Бег",
        description: "Расчет темпа, времени и сожженных калорий",
        category: "health"
      }
    ]
  },
  education: {
    title: "Учёба и повседневка",
    description: "Полезные калькуляторы для учебы и повседневных задач",
    calculators: [
      {
        id: "percentage",
        name: "Проценты",
        description: "Расчет процентов от числа и процентных соотношений",
        category: "education"
      },
      {
        id: "fractions",
        name: "Дроби",
        description: "Операции с обыкновенными дробями",
        category: "education"
      },
      {
        id: "date-calculator",
        name: "Калькулятор дат",
        description: "Разница между датами, добавление дней",
        category: "education"
      },
      {
        id: "time-calculator",
        name: "Время",
        description: "Операции со временем и временными интервалами",
        category: "education"
      }
    ]
  },
  business: {
    title: "Для бизнеса",
    description: "Калькуляторы для предпринимателей и бизнеса",
    calculators: [
      {
        id: "vat",
        name: "НДС",
        description: "Расчет НДС к доплате и выделение из суммы",
        category: "business"
      },
      {
        id: "taxes",
        name: "Налоги",
        description: "Расчет подоходного налога и налоговых обязательств",
        category: "business"
      },
      {
        id: "salary",
        name: "Зарплата",
        description: "Расчет заработной платы с учетом налогов",
        category: "business"
      },
      {
        id: "margin",
        name: "Маржинальность",
        description: "Расчет прибыли, наценки и рентабельности",
        category: "business"
      }
    ]
  },
  crypto: {
    title: "Криптовалюта и IT",
    description: "Калькуляторы для криптовалют и IT-сферы",
    calculators: [
      {
        id: "mining",
        name: "Майнинг",
        description: "Прибыльность майнинга криптовалют",
        category: "crypto"
      },
      {
        id: "staking",
        name: "Стейкинг",
        description: "Доходность от стейкинга криптовалют",
        category: "crypto"
      },
      {
        id: "crypto-converter",
        name: "Конвертер криптовалют",
        description: "Перевод между криптовалютами и фиатом",
        category: "crypto"
      }
    ]
  }
};

// Функция для получения данных категории
export const getCategoryData = (categoryId) => {
  return calculatorData[categoryId] || null;
};

// Функция для получения данных калькулятора
export const getCalculatorData = (calculatorId) => {
  for (const category of Object.values(calculatorData)) {
    const calculator = category.calculators.find(calc => calc.id === calculatorId);
    if (calculator) {
      return calculator;
    }
  }
  return null;
};