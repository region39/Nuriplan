import React, { useState } from 'react';
import { 
  Utensils, 
  ChefHat, 
  Users, 
  Activity, 
  FileSpreadsheet, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  Scale, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Plus, 
  Minus,
  Layers,
  HeartPulse,
  TrendingDown,
  TrendingUp,
  Target,
  Clock,
  Trash2,
  X,
  Calendar,
  BookOpen
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (initialMode?: 'login' | 'register') => void;
  isAuthenticated?: boolean;
  onGoToApp?: () => void;
}

export interface DemoIngredient {
  id: string;
  name: string;
  weightGrams: number;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface DemoDish {
  id: string;
  name: string;
  portionGrams: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbsPer100g: number;
  fiberPer100g: number;
  description: string;
  active: boolean;
  ingredients?: DemoIngredient[];
  isCustomConstructed?: boolean;
}

export interface DemoMeal {
  id: string;
  name: string;
  time: string;
  dishes: DemoDish[];
}

export const DEMO_BASE_PRODUCTS = [
  { id: 'p1', name: 'Филе грудки индейки сырое', kcal100: 130, p100: 25.0, f100: 2.5, c100: 0, defaultG: 180 },
  { id: 'p2', name: 'Мурманский лосось (семга) сырой', kcal100: 197, p100: 20.0, f100: 13.0, c100: 0, defaultG: 160 },
  { id: 'p3', name: 'Филе цыпленка су-вид сырое', kcal100: 115, p100: 23.5, f100: 1.8, c100: 0.4, defaultG: 170 },
  { id: 'p4', name: 'Киноа триколор крупа', kcal100: 368, p100: 14.1, f100: 6.1, c100: 57.2, defaultG: 80 },
  { id: 'p5', name: 'Бурый рис басмати крупа', kcal100: 337, p100: 7.5, f100: 1.9, c100: 72.8, defaultG: 80 },
  { id: 'p6', name: 'Овсяные хлопья длительной варки', kcal100: 342, p100: 12.3, f100: 6.2, c100: 59.5, defaultG: 60 },
  { id: 'p7', name: 'Брокколи свежая на пару', kcal100: 34, p100: 2.8, f100: 0.4, c100: 6.6, defaultG: 70 },
  { id: 'p8', name: 'Авокадо Hass спелое', kcal100: 160, p100: 2.0, f100: 14.7, c100: 1.8, defaultG: 60 },
  { id: 'p9', name: 'Оливковое масло Extra Virgin', kcal100: 898, p100: 0, f100: 99.8, c100: 0, defaultG: 10 },
  { id: 'p10', name: 'Греческий йогурт 2%', kcal100: 73, p100: 9.0, f100: 2.0, c100: 4.2, defaultG: 140 },
  { id: 'p11', name: 'Грецкий орех очищенный', kcal100: 654, p100: 15.2, f100: 65.2, c100: 7.0, defaultG: 20 },
  { id: 'p12', name: 'Черника и лесные ягоды', kcal100: 44, p100: 1.0, f100: 0.4, c100: 9.7, defaultG: 45 },
  { id: 'p13', name: 'Свежий шпинат мини', kcal100: 23, p100: 2.9, f100: 0.4, c100: 3.6, defaultG: 40 },
  { id: 'p14', name: 'Сыр Фета фермерский', kcal100: 264, p100: 14.2, f100: 21.3, c100: 4.1, defaultG: 35 },
];

export const INITIAL_MONDAY_MEALS: DemoMeal[] = [
  {
    id: 'breakfast',
    name: 'Завтрак',
    time: '08:30',
    dishes: [
      {
        id: 'dish-1',
        name: 'Овсяная каша с лесными ягодами и миндалем',
        portionGrams: 260,
        caloriesPer100g: 135,
        proteinPer100g: 4.8,
        fatPer100g: 4.5,
        carbsPer100g: 18.2,
        fiberPer100g: 3.1,
        description: 'Собрано в конструкторе из чистых хлопьев, миндального молока и дикой черники',
        active: true,
        ingredients: [
          { id: 'ing-1', name: 'Овсяные хлопья монастырские', weightGrams: 60, kcal: 205, protein: 7.4, fat: 3.7, carbs: 35.7 },
          { id: 'ing-2', name: 'Миндальное молоко без сахара', weightGrams: 150, kcal: 36, protein: 1.5, fat: 2.7, carbs: 1.2 },
          { id: 'ing-3', name: 'Черника и лесные ягоды', weightGrams: 40, kcal: 18, protein: 0.4, fat: 0.2, carbs: 3.9 },
          { id: 'ing-4', name: 'Лепестки миндаля', weightGrams: 10, kcal: 58, protein: 2.1, fat: 5.0, carbs: 1.1 },
        ],
      },
    ],
  },
  {
    id: 'lunch',
    name: 'Обед',
    time: '13:00',
    dishes: [
      {
        id: 'dish-2',
        name: 'Филе мурманского лосося с диким киноа и брокколи',
        portionGrams: 320,
        caloriesPer100g: 168,
        proteinPer100g: 14.5,
        fatPer100g: 7.8,
        carbsPer100g: 9.8,
        fiberPer100g: 2.6,
        description: 'ТТК: Мурманский лосось су-вид, триколор киноа, спаржевая капуста, лимонный дрессинг',
        active: true,
        ingredients: [
          { id: 'ing-5', name: 'Филе лосося сырое (уварка -12%)', weightGrams: 160, kcal: 315, protein: 32.0, fat: 20.8, carbs: 0 },
          { id: 'ing-6', name: 'Киноа триколор крупа', weightGrams: 100, kcal: 120, protein: 4.4, fat: 1.9, carbs: 21.3 },
          { id: 'ing-7', name: 'Брокколи на пару аль-денте', weightGrams: 50, kcal: 17, protein: 1.4, fat: 0.2, carbs: 3.3 },
          { id: 'ing-8', name: 'Оливковое масло Extra Virgin', weightGrams: 10, kcal: 90, protein: 0, fat: 10.0, carbs: 0 },
        ],
      },
    ],
  },
  {
    id: 'snack',
    name: 'Полдник',
    time: '16:30',
    dishes: [
      {
        id: 'dish-3',
        name: 'Греческий йогурт с грецким орехом и цветочным медом',
        portionGrams: 170,
        caloriesPer100g: 122,
        proteinPer100g: 9.2,
        fatPer100g: 5.6,
        carbsPer100g: 8.5,
        fiberPer100g: 0.8,
        description: 'Фермерский йогурт 2%, дробленый грецкий орех, натуральный цветочный мед',
        active: true,
        ingredients: [
          { id: 'ing-9', name: 'Греческий фермерский йогурт 2%', weightGrams: 140, kcal: 102, protein: 12.6, fat: 2.8, carbs: 5.9 },
          { id: 'ing-10', name: 'Грецкий орех очищенный', weightGrams: 20, kcal: 131, protein: 3.0, fat: 13.0, carbs: 1.4 },
          { id: 'ing-11', name: 'Цветочный липовый мед', weightGrams: 10, kcal: 31, protein: 0.1, fat: 0, carbs: 8.2 },
        ],
      },
    ],
  },
  {
    id: 'dinner',
    name: 'Ужин',
    time: '19:30',
    dishes: [
      {
        id: 'dish-4',
        name: 'Стейк из филе индейки с печеными овощами гриль',
        portionGrams: 300,
        caloriesPer100g: 130,
        proteinPer100g: 16.4,
        fatPer100g: 4.2,
        carbsPer100g: 6.5,
        fiberPer100g: 2.9,
        description: 'ТТК: Грудка индейки в травах Прованса, кабачки цукини, паприка гриль, соус песто',
        active: true,
        ingredients: [
          { id: 'ing-12', name: 'Филе грудки индейки (упек -18%)', weightGrams: 180, kcal: 234, protein: 45.0, fat: 4.5, carbs: 0 },
          { id: 'ing-13', name: 'Овощи гриль (цукини, паприка)', weightGrams: 110, kcal: 35, protein: 1.5, fat: 0.3, carbs: 6.2 },
          { id: 'ing-14', name: 'Соус песто из базилика', weightGrams: 10, kcal: 45, protein: 0.6, fat: 4.5, carbs: 0.4 },
        ],
      },
    ],
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onOpenAuth, 
  isAuthenticated = false, 
  onGoToApp 
}) => {
  // Demo calculator state: single day Monday with free meal planning
  const [goal, setGoal] = useState<'balance' | 'loss' | 'gain'>('balance');
  const [targetCalories, setTargetCalories] = useState<number>(2050);
  const [meals, setMeals] = useState<DemoMeal[]>(INITIAL_MONDAY_MEALS);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Free meal planning state
  const [expandedTtkDishId, setExpandedTtkDishId] = useState<string | null>(null);
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [customMealName, setCustomMealName] = useState('');
  const [customMealTime, setCustomMealTime] = useState('11:00');

  // Interactive Dish Constructor state
  const [showDishConstructor, setShowDishConstructor] = useState(false);
  const [targetMealForConstructor, setTargetMealForConstructor] = useState<string>('lunch');
  const [constructedDishName, setConstructedDishName] = useState('Боул с цыпленком су-вид и авокадо');
  const [constructorNotification, setConstructorNotification] = useState<string | null>(null);
  const [constructorIngredients, setConstructorIngredients] = useState<Array<{
    id: string;
    productId: string;
    name: string;
    weightGrams: number;
    kcal100: number;
    p100: number;
    f100: number;
    c100: number;
  }>>([
    { id: 'c-1', productId: 'p3', name: 'Филе цыпленка су-вид сырое', weightGrams: 160, kcal100: 115, p100: 23.5, f100: 1.8, c100: 0.4 },
    { id: 'c-2', productId: 'p4', name: 'Киноа триколор крупа', weightGrams: 70, kcal100: 368, p100: 14.1, f100: 6.1, c100: 57.2 },
    { id: 'c-3', productId: 'p8', name: 'Авокадо Hass спелое', weightGrams: 50, kcal100: 160, p100: 2.0, f100: 14.7, c100: 1.8 },
    { id: 'c-4', productId: 'p9', name: 'Оливковое масло Extra Virgin', weightGrams: 10, kcal100: 898, p100: 0, f100: 99.8, c100: 0 },
  ]);

  // Goal handler
  const handleSelectGoal = (selected: 'balance' | 'loss' | 'gain') => {
    setGoal(selected);
    if (selected === 'loss') setTargetCalories(1700);
    else if (selected === 'gain') setTargetCalories(2500);
    else setTargetCalories(2050);
  };

  const handleToggleDish = (dishId: string) => {
    setMeals(prev => prev.map(meal => ({
      ...meal,
      dishes: meal.dishes.map(d => d.id === dishId ? { ...d, active: !d.active } : d)
    })));
  };

  const handlePortionChange = (dishId: string, delta: number) => {
    setMeals(prev => prev.map(meal => ({
      ...meal,
      dishes: meal.dishes.map(d => {
        if (d.id === dishId) {
          const nextWeight = Math.max(50, Math.min(800, d.portionGrams + delta));
          return { ...d, portionGrams: nextWeight };
        }
        return d;
      })
    })));
  };

  const handleRemoveDish = (mealId: string, dishId: string) => {
    setMeals(prev => prev.map(m => {
      if (m.id === mealId) {
        return { ...m, dishes: m.dishes.filter(d => d.id !== dishId) };
      }
      return m;
    }));
  };

  const handleAddMeal = (name: string, time: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    const newMeal: DemoMeal = {
      id: `meal-${Date.now()}`,
      name: cleanName,
      time: time.trim() || '12:00',
      dishes: []
    };
    setMeals(prev => [...prev, newMeal]);
    setIsAddingMeal(false);
    setCustomMealName('');
  };

  const handleRemoveMeal = (mealId: string) => {
    if (meals.length <= 1) return;
    setMeals(prev => prev.filter(m => m.id !== mealId));
  };

  // Constructor helpers
  const handleAddIngredientToConstructor = (productId: string) => {
    const prod = DEMO_BASE_PRODUCTS.find(p => p.id === productId);
    if (!prod) return;
    setConstructorIngredients(prev => [
      ...prev,
      {
        id: `c-ing-${Date.now()}-${Math.random()}`,
        productId: prod.id,
        name: prod.name,
        weightGrams: prod.defaultG,
        kcal100: prod.kcal100,
        p100: prod.p100,
        f100: prod.f100,
        c100: prod.c100
      }
    ]);
  };

  const handleUpdateIngredientWeight = (id: string, weight: number) => {
    const safeWeight = Math.max(5, Math.min(600, weight));
    setConstructorIngredients(prev => prev.map(ing => ing.id === id ? { ...ing, weightGrams: safeWeight } : ing));
  };

  const handleRemoveIngredientFromConstructor = (id: string) => {
    setConstructorIngredients(prev => prev.filter(ing => ing.id !== id));
  };

  const constructorRawWeight = constructorIngredients.reduce((s, i) => s + i.weightGrams, 0);
  const constructorCookedWeight = Math.max(50, Math.round(constructorRawWeight * 0.85)); // ~15% shrinkage
  const constructorTotalKcal = Math.round(constructorIngredients.reduce((s, i) => s + (i.kcal100 * i.weightGrams) / 100, 0));
  const constructorTotalP = Number(constructorIngredients.reduce((s, i) => s + (i.p100 * i.weightGrams) / 100, 0).toFixed(1));
  const constructorTotalF = Number(constructorIngredients.reduce((s, i) => s + (i.f100 * i.weightGrams) / 100, 0).toFixed(1));
  const constructorTotalC = Number(constructorIngredients.reduce((s, i) => s + (i.c100 * i.weightGrams) / 100, 0).toFixed(1));

  const constructorKcalPer100g = Math.round((constructorTotalKcal / (constructorCookedWeight || 1)) * 100);
  const constructorPPer100g = Number(((constructorTotalP / (constructorCookedWeight || 1)) * 100).toFixed(1));
  const constructorFPer100g = Number(((constructorTotalF / (constructorCookedWeight || 1)) * 100).toFixed(1));
  const constructorCPer100g = Number(((constructorTotalC / (constructorCookedWeight || 1)) * 100).toFixed(1));

  const handleSaveConstructedDish = () => {
    if (!constructedDishName.trim() || constructorIngredients.length === 0) return;
    const newDish: DemoDish = {
      id: `custom-dish-${Date.now()}`,
      name: constructedDishName.trim(),
      portionGrams: constructorCookedWeight,
      caloriesPer100g: constructorKcalPer100g,
      proteinPer100g: constructorPPer100g,
      fatPer100g: constructorFPer100g,
      carbsPer100g: constructorCPer100g,
      fiberPer100g: 2.8,
      description: `Собрано из ${constructorIngredients.length} продуктов в конструкторе блюд`,
      active: true,
      isCustomConstructed: true,
      ingredients: constructorIngredients.map(ing => ({
        id: `ing-${Date.now()}-${Math.random()}`,
        name: ing.name,
        weightGrams: ing.weightGrams,
        kcal: Math.round((ing.kcal100 * ing.weightGrams) / 100),
        protein: Number(((ing.p100 * ing.weightGrams) / 100).toFixed(1)),
        fat: Number(((ing.f100 * ing.weightGrams) / 100).toFixed(1)),
        carbs: Number(((ing.c100 * ing.weightGrams) / 100).toFixed(1))
      }))
    };

    setMeals(prev => prev.map(meal => {
      if (meal.id === targetMealForConstructor) {
        return { ...meal, dishes: [...meal.dishes, newDish] };
      }
      return meal;
    }));

    setShowDishConstructor(false);
    const targetMealName = meals.find(m => m.id === targetMealForConstructor)?.name || 'Понедельник';
    setConstructorNotification(`Блюдо "${newDish.name}" успешно собрано и добавлено в ${targetMealName}!`);
    setTimeout(() => setConstructorNotification(null), 4000);
  };

  // Calculations across all Monday meals
  const allDishes = meals.flatMap(m => m.dishes);
  const activeDishes = meals.flatMap(m => m.dishes.filter(d => d.active));
  const totalCalories = Math.round(activeDishes.reduce((sum, d) => sum + (d.caloriesPer100g * d.portionGrams) / 100, 0));
  const totalProtein = Number(activeDishes.reduce((sum, d) => sum + (d.proteinPer100g * d.portionGrams) / 100, 0).toFixed(1));
  const totalFat = Number(activeDishes.reduce((sum, d) => sum + (d.fatPer100g * d.portionGrams) / 100, 0).toFixed(1));
  const totalCarbs = Number(activeDishes.reduce((sum, d) => sum + (d.carbsPer100g * d.portionGrams) / 100, 0).toFixed(1));
  const totalFiber = Number(activeDishes.reduce((sum, d) => sum + (d.fiberPer100g * d.portionGrams) / 100, 0).toFixed(1));

  // Calories breakdown
  const proteinKcal = totalProtein * 4;
  const fatKcal = totalFat * 9;
  const carbsKcal = totalCarbs * 4;
  const macroKcalSum = proteinKcal + fatKcal + carbsKcal || 1;
  const proteinPct = Math.round((proteinKcal / macroKcalSum) * 100);
  const fatPct = Math.round((fatKcal / macroKcalSum) * 100);
  const carbsPct = 100 - proteinPct - fatPct;

  const calDiff = totalCalories - targetCalories;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1A1A1A] font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-50 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Utensils size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-gray-900">NutriPlan+</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">Кулинарный & нутрициологический расчет</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <button 
              onClick={() => scrollToSection('audiences')} 
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Направления
            </button>
            <button 
              onClick={() => scrollToSection('calculator')} 
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Демо-калькулятор
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Возможности
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Тарифы
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Вопросы
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={onGoToApp}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                В кабинет
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Войти
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                >
                  Регистрация
                  <ArrowRight size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Quiet unboxed kicker without pills */}
            <div className="text-xs font-semibold tracking-wider uppercase text-emerald-700 mb-4 flex items-center justify-center gap-2">
              <span>Технологические карты</span>
              <span aria-hidden="true" className="text-gray-300">·</span>
              <span>Точный учет потерь уварки</span>
              <span aria-hidden="true" className="text-gray-300">·</span>
              <span>Контроль КБЖУ</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-950 tracking-tight leading-[1.12] mb-6">
              Профессиональная точность каждого грамма и калории
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-normal mb-10">
              Единая интеллектуальная платформа расчета рационов для <span className="text-gray-900 font-medium">кулинарных производств на заказ</span>, <span className="text-gray-900 font-medium">выездного кейтеринга</span> и каждого, кто составляет себе <span className="text-gray-900 font-medium">безупречный персональный рацион</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection('calculator')}
                className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
              >
                Попробовать онлайн-расчет
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-base rounded-xl border border-black/10 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                Создать профиль организации
              </button>
            </div>

            {/* Metric proof bar - pure typography, no static pill enclosures */}
            <div className="mt-14 pt-8 border-t border-black/5 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
              <div>
                <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">0.1 г</div>
                <div className="text-xs text-gray-500 mt-0.5">Точность взвешивания ингредиентов</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">1000+</div>
                <div className="text-xs text-gray-500 mt-0.5">Продуктов и нутриентов в базе</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">100%</div>
                <div className="text-xs text-gray-500 mt-0.5">Учет коэффициентов уварки и упека</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">PDF & ТТК</div>
                <div className="text-xs text-gray-500 mt-0.5">Печать технологических карт в 1 клик</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Core Pillars Section */}
      <section id="audiences" className="py-20 bg-white border-y border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-700 block mb-2">
              Специализация платформы
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight">
              Спроектировано под ваши задачи
            </h2>
            <p className="text-gray-600 mt-3 text-base leading-relaxed">
              Один инструмент заменяет разрозненные Excel-таблицы, калькуляторы калорий и записные книжки шеф-повара.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Custom Meal Prep */}
            <div className="bg-[#FBFBFA] p-8 rounded-2xl border border-black/5 flex flex-col justify-between hover:border-emerald-500/30 transition-all shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                  <ChefHat size={26} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Кулинарии и рационы на заказ
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Для цехов готовой еды, доставки правильного питания и шеф-поваров, готовящих под индивидуальные запросы клиентов.
                </p>
                <ul className="space-y-3 text-sm text-gray-700 mb-6">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Автоматический учет коэффициентов термообработки (уварка, упек, жарка)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Быстрая печать этикеток КБЖУ на контейнеры со штрихкодом и составом</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Клиентские профили с фиксацией персональных калорий и предпочтений</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Мгновенная замена ингредиентов с сохранением планового баланса</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-black/5 text-xs text-gray-500 font-medium">
                Результат: исключение ошибок на кухне и нулевой перерасход продуктов
              </div>
            </div>

            {/* Card 2: Catering & Events */}
            <div className="bg-[#FBFBFA] p-8 rounded-2xl border border-black/5 flex flex-col justify-between hover:border-emerald-500/30 transition-all shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6">
                  <Users size={26} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Кейтеринг и банкетные службы
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Для банкетных менеджеров, выездных ресторанов и организаторов мероприятий с переменным числом гостей.
                </p>
                <ul className="space-y-3 text-sm text-gray-700 mb-6">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Масштабирование раскладок на 10, 50, 150 или 500 персон в один клик</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Сводная ведомость закупки сырья
                      <span className="inline-block text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70 ml-1.5 align-middle">
                        В разработке
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Учет аллергенов и фильтры диет (халяль, кето, веган)
                      <span className="inline-block text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70 ml-1.5 align-middle">
                        В разработке
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Формирование технологических карт для поваров заготовочного цеха</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-black/5 text-xs text-gray-500 font-medium">
                Результат: быстрая калькуляция сметы и идеальная синхронизация с кухней
              </div>
            </div>

            {/* Card 3: Personal Nutrition Planning */}
            <div className="bg-[#FBFBFA] p-8 rounded-2xl border border-black/5 flex flex-col justify-between hover:border-emerald-500/30 transition-all shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
                  <Activity size={26} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Персональный точный рацион
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Для тех, кто заботится о теле, готовит себе самостоятельно или работает с частным нутрициологом.
                </p>
                <ul className="space-y-3 text-sm text-gray-700 mb-6">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Честный расчет граммов — без приблизительных «ложек» и «чашек»</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Контроль не только БЖУ, но и клетчатки, витаминов и микроэлементов</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Конструктор блюд из простых продуктов: крупы, птица, рыба, овощи</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Экспорт дневного и недельного меню в чистый мобильный формат</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-black/5 text-xs text-gray-500 font-medium">
                Результат: уверенность в калориях и достижение спортивных или оздоровительных целей
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Live Demo Calculator */}
      <section id="calculator" className="py-20 bg-[#F5F5F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-700 block mb-2">
              Интерактивная демонстрация
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight">
              Попробуйте расчет прямо сейчас
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              Выберите цель и настройте порции. Данные пересчитываются на лету с учетом чистого выхода и нутриентного баланса.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 sm:p-8 lg:p-10">
            {/* Goal selector & Demo stand notification banner (Selected element) */}
            <div className="pb-6 border-b border-gray-100 space-y-4">
              {/* Notice that this is a demo stand */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 shadow-xs">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-amber-950 tracking-tight">
                        Это демо-стенд
                      </span>
                      <span className="text-[11px] font-semibold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                        Ознакомительный режим
                      </span>
                    </div>
                    <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                      Полный функционал доступен после регистрации: сохранение клиентов, экспорт технологических карт в PDF и Excel, полная база продуктов и рационы на 7+ дней.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  Зарегистрироваться
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Goal selector - segmented button tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    1. Целевой режим питания
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {goal === 'loss' && 'Дефицит калорий для снижения веса (1700 ккал)'}
                    {goal === 'balance' && 'Поддержание веса и тонуса (2050 ккал)'}
                    {goal === 'gain' && 'Профицит и набор мышечной массы (2500 ккал)'}
                  </span>
                </div>

                {/* Functional tabs */}
                <div className="p-1 bg-gray-100 rounded-xl flex items-center gap-1 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleSelectGoal('loss')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                      goal === 'loss' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <TrendingDown size={14} />
                    Снижение
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectGoal('balance')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                      goal === 'balance' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Target size={14} />
                    Баланс
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectGoal('gain')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                      goal === 'gain' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <TrendingUp size={14} />
                    Набор
                  </button>
                </div>
              </div>
            </div>

            {/* Notification when custom dish is added */}
            {constructorNotification && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span className="font-medium">{constructorNotification}</span>
                </div>
                <button 
                  onClick={() => setConstructorNotification(null)}
                  className="text-emerald-600 hover:text-emerald-800"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Layout: Monday Meal Schedule + Summary Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
              {/* Left Column: Monday Schedule with Meals & Dish Constructor */}
              <div className="lg:col-span-7 space-y-6">
                {/* Monday Header & Planning Mode Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      ПН
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900">Понедельник</h3>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-white border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Calendar size={11} />
                          День 1
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {meals.length} {meals.length === 1 ? 'прием' : meals.length < 5 ? 'приема' : 'приемов'} пищи · Свободная планировка графика
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetMealForConstructor(meals[0]?.id || 'lunch');
                      setShowDishConstructor(true);
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-300 font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    title="Собрать авторское блюдо из сырых ингредиентов"
                  >
                    <Sparkles size={14} className="text-amber-500" />
                    <span>Конструктор блюд (ТТК)</span>
                  </button>
                </div>

                {/* Meals container */}
                <div className="space-y-4">
                  {meals.map((meal) => {
                    const mealActiveDishes = meal.dishes.filter(d => d.active);
                    const mealKcal = Math.round(mealActiveDishes.reduce((s, d) => s + (d.caloriesPer100g * d.portionGrams) / 100, 0));
                    const mealP = mealActiveDishes.reduce((s, d) => s + (d.proteinPer100g * d.portionGrams) / 100, 0).toFixed(1);
                    const mealF = mealActiveDishes.reduce((s, d) => s + (d.fatPer100g * d.portionGrams) / 100, 0).toFixed(1);
                    const mealC = mealActiveDishes.reduce((s, d) => s + (d.carbsPer100g * d.portionGrams) / 100, 0).toFixed(1);

                    return (
                      <div 
                        key={meal.id} 
                        className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-xs hover:border-black/20 transition-all"
                      >
                        {/* Meal Header */}
                        <div className="p-3.5 sm:p-4 bg-gray-50/80 border-b border-black/5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <h4 className="text-sm font-bold text-gray-900 tracking-tight">
                              {meal.name}
                            </h4>
                            <span className="text-[11px] font-mono text-gray-500 bg-white border border-black/5 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Clock size={11} className="text-gray-400" />
                              {meal.time}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                              <span className="text-xs font-mono font-bold text-gray-900">
                                {mealKcal} ккал
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono block">
                                Б:{mealP} Ж:{mealF} У:{mealC}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setTargetMealForConstructor(meal.id);
                                setShowDishConstructor(true);
                              }}
                              className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title={`Собрать новое блюдо для приема «${meal.name}»`}
                            >
                              <Plus size={14} />
                              <span className="hidden md:inline">Блюдо</span>
                            </button>

                            {meals.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMeal(meal.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title={`Удалить прием «${meal.name}»`}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Dishes in this Meal */}
                        <div className="p-3 sm:p-4 space-y-3">
                          {meal.dishes.length === 0 ? (
                            <div className="py-6 px-4 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                              <p className="text-xs text-gray-500 mb-2">
                                В этом приеме пищи пока нет блюд.
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setTargetMealForConstructor(meal.id);
                                  setShowDishConstructor(true);
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Sparkles size={13} />
                                <span>Собрать блюдо в конструкторе</span>
                              </button>
                            </div>
                          ) : (
                            meal.dishes.map((dish) => {
                              const dishCalories = Math.round((dish.caloriesPer100g * dish.portionGrams) / 100);
                              const dishProtein = ((dish.proteinPer100g * dish.portionGrams) / 100).toFixed(1);
                              const dishFat = ((dish.fatPer100g * dish.portionGrams) / 100).toFixed(1);
                              const dishCarbs = ((dish.carbsPer100g * dish.portionGrams) / 100).toFixed(1);
                              const isTtkExpanded = expandedTtkDishId === dish.id;

                              return (
                                <div 
                                  key={dish.id}
                                  className={`p-3.5 rounded-xl border transition-all ${
                                    dish.active 
                                      ? 'bg-white border-black/10 shadow-2xs' 
                                      : 'bg-gray-50/70 border-dashed border-gray-200 opacity-60'
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleDish(dish.id)}
                                        className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                                          dish.active 
                                            ? 'bg-emerald-600 border-emerald-600 text-white' 
                                            : 'border-gray-300 hover:border-gray-400 bg-white'
                                        }`}
                                        title={dish.active ? 'Отключить блюдо' : 'Включить блюдо'}
                                      >
                                        {dish.active && <CheckCircle2 size={13} />}
                                      </button>

                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <h5 className="text-sm font-bold text-gray-900 truncate">
                                            {dish.name}
                                          </h5>
                                          <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.2 rounded-md">
                                            Конструктор блюд (ТТК)
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                          {dish.description}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Weight controls & delete */}
                                    <div className="flex items-center gap-2 shrink-0">
                                      <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg border border-black/5">
                                        <button
                                          type="button"
                                          disabled={!dish.active || dish.portionGrams <= 50}
                                          onClick={() => handlePortionChange(dish.id, -20)}
                                          className="w-6 h-6 rounded bg-white hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
                                        >
                                          <Minus size={12} />
                                        </button>
                                        <span className="font-mono text-xs font-bold text-gray-900 w-11 text-center">
                                          {dish.portionGrams} г
                                        </span>
                                        <button
                                          type="button"
                                          disabled={!dish.active || dish.portionGrams >= 800}
                                          onClick={() => handlePortionChange(dish.id, 20)}
                                          className="w-6 h-6 rounded bg-white hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
                                        >
                                          <Plus size={12} />
                                        </button>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => handleRemoveDish(meal.id, dish.id)}
                                        className="p-1.5 text-gray-300 hover:text-red-500 rounded transition-colors cursor-pointer"
                                        title="Удалить блюдо"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Macro numbers & TTK Toggle */}
                                  <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs flex-wrap gap-2">
                                    <div className="flex items-center gap-3 text-xs text-gray-600 font-mono">
                                      <span className="font-bold text-gray-900">{dishCalories} ккал</span>
                                      <span className="text-[11px] text-gray-500">Б: <strong className="text-gray-800">{dishProtein}г</strong></span>
                                      <span className="text-[11px] text-gray-500">Ж: <strong className="text-gray-800">{dishFat}г</strong></span>
                                      <span className="text-[11px] text-gray-500">У: <strong className="text-gray-800">{dishCarbs}г</strong></span>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => setExpandedTtkDishId(isTtkExpanded ? null : dish.id)}
                                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                                    >
                                      <BookOpen size={12} />
                                      <span>{isTtkExpanded ? 'Скрыть рецепт ТТК' : `Состав из сырых продуктов (${dish.ingredients?.length || 3})`}</span>
                                      {isTtkExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    </button>
                                  </div>

                                  {/* Expandable TTK (Tech Card Breakdown) */}
                                  {isTtkExpanded && dish.ingredients && (
                                    <div className="mt-3 p-3 bg-[#FBFBFA] rounded-xl border border-emerald-100/80 text-xs">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px]">
                                          Технологическая карта (ингредиенты блюда)
                                        </span>
                                        <span className="text-[10px] text-emerald-700">
                                          Уварка и потери учтены
                                        </span>
                                      </div>
                                      <div className="divide-y divide-gray-200">
                                        {dish.ingredients.map((ing) => (
                                          <div key={ing.id} className="py-1.5 flex items-center justify-between text-[11px]">
                                            <span className="text-gray-800 font-medium">{ing.name}</span>
                                            <div className="flex items-center gap-3 font-mono text-gray-600">
                                              <span className="font-bold text-gray-900">{ing.weightGrams} г</span>
                                              <span>{ing.kcal} ккал</span>
                                              <span className="text-[10px] text-gray-500">Б:{ing.protein} Ж:{ing.fat} У:{ing.carbs}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom of Monday: "+ Добавить прием пищи" (Free Meal Planning) */}
                <div className="pt-2">
                  {!isAddingMeal ? (
                    <div className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => setIsAddingMeal(true)}
                        className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/50 text-emerald-700 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs group"
                      >
                        <Plus size={18} className="group-hover:scale-110 transition-transform" />
                        <span>+ Добавить прием пищи в Понедельник</span>
                      </button>
                      <p className="text-[11px] text-gray-500 text-center mt-2">
                        Функционал свободной планировки: добавляйте перекусы, тренировочные шейки или дополнительные приемы пищи без ограничений.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                          Добавление приема пищи в Понедельник
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAddingMeal(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Quick Presets */}
                      <div className="mb-3">
                        <span className="text-[11px] text-gray-500 block mb-1.5">
                          Быстрый выбор типичного приема:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Второй завтрак', time: '11:00' },
                            { name: 'Перекус перед тренировкой', time: '17:30' },
                            { name: 'Спортивный шейк', time: '18:45' },
                            { name: 'Второй ужин / Поздний перекус', time: '21:30' }
                          ].map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => handleAddMeal(preset.name, preset.time)}
                              className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-emerald-100 text-gray-800 hover:text-emerald-900 rounded-lg transition-colors cursor-pointer"
                            >
                              + {preset.name} ({preset.time})
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom input fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Название своего приема
                          </label>
                          <input 
                            type="text"
                            placeholder="Напр. Предтренировочный прием"
                            value={customMealName}
                            onChange={(e) => setCustomMealName(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Время
                          </label>
                          <input 
                            type="time"
                            value={customMealTime}
                            onChange={(e) => setCustomMealTime(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 mt-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingMeal(false)}
                          className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          Отмена
                        </button>
                        <button
                          type="button"
                          disabled={!customMealName.trim()}
                          onClick={() => handleAddMeal(customMealName, customMealTime)}
                          className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg disabled:opacity-40 cursor-pointer"
                        >
                          Добавить прием в Понедельник
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Reactive Summary Panel */}
              <div className="lg:col-span-5 bg-[#FBFBFA] rounded-2xl border border-black/5 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      3. Итоговый баланс Понедельника
                    </span>
                    <span className="text-xs font-medium text-emerald-700 font-mono">
                      Онлайн-калькуляция
                    </span>
                  </div>

                  {/* Calories total */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">Энергетическая ценность дня</span>
                      <span className="text-3xl font-black text-gray-950 font-mono tracking-tight">
                        {totalCalories} <span className="text-base font-normal text-gray-500">ккал</span>
                      </span>
                    </div>

                    {/* Progress to target */}
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          Math.abs(calDiff) <= 150 ? 'bg-emerald-500' : calDiff > 150 ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, (totalCalories / targetCalories) * 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1.5 font-mono">
                      <span>Цель: {targetCalories} ккал</span>
                      <span className={Math.abs(calDiff) <= 150 ? 'text-emerald-700 font-medium' : 'text-gray-600'}>
                        {calDiff === 0 ? 'Идеальное попадание' : calDiff > 0 ? `+${calDiff} ккал от нормы` : `${calDiff} ккал дефицита`}
                      </span>
                    </div>
                  </div>

                  {/* BJU Breakdown Cards */}
                  <div className="grid grid-cols-3 gap-2.5 mb-6">
                    <div className="bg-white p-3 rounded-xl border border-black/5 text-center">
                      <span className="text-[11px] font-bold text-gray-400 uppercase">Белки</span>
                      <div className="text-lg font-bold text-gray-900 font-mono mt-0.5">{totalProtein} г</div>
                      <span className="text-[10px] text-gray-500 font-mono">{proteinPct}% ккал</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-black/5 text-center">
                      <span className="text-[11px] font-bold text-gray-400 uppercase">Жиры</span>
                      <div className="text-lg font-bold text-gray-900 font-mono mt-0.5">{totalFat} г</div>
                      <span className="text-[10px] text-gray-500 font-mono">{fatPct}% ккал</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-black/5 text-center">
                      <span className="text-[11px] font-bold text-gray-400 uppercase">Углеводы</span>
                      <div className="text-lg font-bold text-gray-900 font-mono mt-0.5">{totalCarbs} г</div>
                      <span className="text-[10px] text-gray-500 font-mono">{carbsPct}% ккал</span>
                    </div>
                  </div>

                  {/* Meal-by-meal Distribution breakdown */}
                  <div className="bg-white p-3.5 rounded-xl border border-black/5 mb-6">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2.5">
                      Распределение калорий по приемам пищи:
                    </span>
                    <div className="space-y-2">
                      {meals.map((m) => {
                        const mActive = m.dishes.filter(d => d.active);
                        const mKcal = Math.round(mActive.reduce((s, d) => s + (d.caloriesPer100g * d.portionGrams) / 100, 0));
                        const mPct = totalCalories > 0 ? Math.round((mKcal / totalCalories) * 100) : 0;
                        return (
                          <div key={m.id} className="text-xs">
                            <div className="flex items-center justify-between text-gray-700 mb-1">
                              <span className="font-medium">{m.name} ({m.time})</span>
                              <span className="font-mono text-gray-900 font-semibold">{mKcal} ккал ({mPct}%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full" 
                                style={{ width: `${Math.min(100, mPct)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional Micro summary */}
                  <div className="p-3.5 bg-white rounded-xl border border-black/5 mb-6 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Пищевые волокна (клетчатка)</span>
                      <span className="font-mono font-bold text-gray-900">{totalFiber} г</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Чистый вес рациона Понедельника</span>
                      <span className="font-mono font-bold text-gray-900">
                        {activeDishes.reduce((s, d) => s + d.portionGrams, 0)} г
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Собрано в Конструкторе блюд</span>
                      <span className="text-emerald-700 font-medium">Да, {allDishes.length} блюд(а)</span>
                    </div>
                  </div>
                </div>

                {/* Save CTA */}
                <div>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    Сохранить рацион в своем кабинете
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <p className="text-[11px] text-center text-gray-400 mt-2">
                    В кабинете доступно создание собственных блюд, экспорт ТТК и учет клиентов
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Dish Constructor Modal / Full Drawer */}
            {showDishConstructor && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
                <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-black/10">
                  {/* Modal Header */}
                  <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-emerald-50/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-emerald-600 text-white">
                          <ChefHat size={16} />
                        </span>
                        <h3 className="text-lg font-bold text-gray-950">
                          Инженерный конструктор блюда
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Собирайте блюдо из сырых продуктов с учетом уварки/упека и точным расчетом КБЖУ
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDishConstructor(false)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    {/* Dish Name & Presets */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Название блюда
                      </label>
                      <input 
                        type="text"
                        value={constructedDishName}
                        onChange={(e) => setConstructedDishName(e.target.value)}
                        placeholder="Напр. Боул с лососем и киноа"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />

                      {/* Recipe Presets */}
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-gray-400">Пресеты:</span>
                        {[
                          'Боул с цыпленком и авокадо',
                          'Филе лосося с диким рисом',
                          'Омлет с фетой и шпинатом',
                          'Творожный десерт с черникой'
                        ].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setConstructedDishName(preset)}
                            className="text-[11px] text-emerald-700 hover:bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 transition-colors cursor-pointer"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ingredients in Recipe */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Ингредиенты рецепта ({constructorIngredients.length})
                        </label>
                        <span className="text-[11px] text-gray-500 font-mono">
                          Вес сырых продуктов (брутто): <strong className="text-gray-900">{constructorRawWeight}г</strong>
                        </span>
                      </div>

                      <div className="space-y-2 border border-gray-200 rounded-2xl p-3 bg-gray-50/50">
                        {constructorIngredients.map((ing) => {
                          const ingKcal = Math.round((ing.kcal100 * ing.weightGrams) / 100);
                          const ingP = ((ing.p100 * ing.weightGrams) / 100).toFixed(1);
                          const ingF = ((ing.f100 * ing.weightGrams) / 100).toFixed(1);
                          const ingC = ((ing.c100 * ing.weightGrams) / 100).toFixed(1);

                          return (
                            <div 
                              key={ing.id}
                              className="p-2.5 bg-white rounded-xl border border-black/5 flex items-center justify-between gap-3 shadow-2xs"
                            >
                              <div className="flex-1 min-w-0">
                                <h6 className="text-xs font-bold text-gray-900 truncate">
                                  {ing.name}
                                </h6>
                                <span className="text-[10px] text-gray-500 font-mono">
                                  {ingKcal} ккал · Б:{ingP} Ж:{ingF} У:{ingC}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateIngredientWeight(ing.id, ing.weightGrams - 10)}
                                    className="w-6 h-6 rounded bg-white text-gray-700 flex items-center justify-center text-xs font-bold shadow-2xs hover:bg-gray-200"
                                  >
                                    -
                                  </button>
                                  <input 
                                    type="number"
                                    value={ing.weightGrams}
                                    onChange={(e) => handleUpdateIngredientWeight(ing.id, Number(e.target.value))}
                                    className="w-12 text-center text-xs font-mono font-bold bg-transparent focus:outline-none"
                                  />
                                  <span className="text-[10px] text-gray-400 mr-1">г</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateIngredientWeight(ing.id, ing.weightGrams + 10)}
                                    className="w-6 h-6 rounded bg-white text-gray-700 flex items-center justify-center text-xs font-bold shadow-2xs hover:bg-gray-200"
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveIngredientFromConstructor(ing.id)}
                                  className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                                  title="Удалить продукт"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* Add product to recipe dropdown */}
                        <div className="pt-2 border-t border-gray-200 flex items-center gap-2">
                          <select 
                            id="add-prod-select"
                            className="flex-1 px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAddIngredientToConstructor(e.target.value);
                                e.target.value = '';
                              }
                            }}
                          >
                            <option value="" disabled>+ Добавить продукт из базы...</option>
                            {DEMO_BASE_PRODUCTS.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.kcal100} ккал / 100г)
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Calculated Live Nutrition of the Dish */}
                    <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                          Автоматический расчет блюда (ТТК):
                        </span>
                        <span className="text-xs font-mono font-semibold text-emerald-800">
                          Выход готовой порции: ~{constructorCookedWeight} г
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center font-mono">
                        <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                          <span className="text-[10px] text-gray-400 uppercase font-sans">Калории</span>
                          <div className="text-base font-bold text-gray-900 mt-0.5">{constructorTotalKcal}</div>
                          <span className="text-[9px] text-gray-400">ккал</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                          <span className="text-[10px] text-gray-400 uppercase font-sans">Белки</span>
                          <div className="text-base font-bold text-emerald-700 mt-0.5">{constructorTotalP}г</div>
                          <span className="text-[9px] text-gray-400">протеин</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                          <span className="text-[10px] text-gray-400 uppercase font-sans">Жиры</span>
                          <div className="text-base font-bold text-amber-700 mt-0.5">{constructorTotalF}г</div>
                          <span className="text-[9px] text-gray-400">липиды</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                          <span className="text-[10px] text-gray-400 uppercase font-sans">Углеводы</span>
                          <div className="text-base font-bold text-blue-700 mt-0.5">{constructorTotalC}г</div>
                          <span className="text-[9px] text-gray-400">карбс</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-emerald-800 mt-2">
                        * Учтен средний технологический коэффициент термической кулинарной обработки (-15% от сырой массы).
                      </p>
                    </div>

                    {/* Target meal selection */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        В какой прием пищи Понедельника добавить:
                      </label>
                      <select 
                        value={targetMealForConstructor}
                        onChange={(e) => setTargetMealForConstructor(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {meals.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.time})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDishConstructor(false)}
                      className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Отмена
                    </button>
                    <button
                      type="button"
                      disabled={!constructedDishName.trim() || constructorIngredients.length === 0}
                      onClick={handleSaveConstructedDish}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                    >
                      <CheckCircle2 size={15} />
                      <span>Добавить собранное блюдо в Понедельник</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Features Grid Section */}
      <section id="features" className="py-20 bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-700 block mb-2">
              Технологический стек платформы
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight">
              Все инструменты пищевого инжиниринга
            </h2>
            <p className="text-gray-600 mt-3 text-base">
              Создано профессионалами для шефов, технологов пищевых производств и диетологов.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#FBFBFA] border border-black/5 hover:border-black/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Flame size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Коэффициенты термообработки
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Точные формулы потерь массы (уварка круп и мяса, упек выпечки, жарка). Вы вводите вес сырого продукта — система считает готовый выход.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBFBFA] border border-black/5 hover:border-black/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Генератор технологических карт (ТТК)
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Формирование карт по стандартам общепита: брутто, нетто, технология приготовления, органолептические показатели и КБЖУ.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBFBFA] border border-black/5 hover:border-black/15 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Scale size={20} />
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                  В разработке
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Сводные ведомости закупки сырья
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Автоматический агрегатор сырья на партию заказов или банкет. Функция формирования суммарных списков закупки для отдела снабжения находится в разработке.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBFBFA] border border-black/5 hover:border-black/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                <FileText size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Экспорт в стильный PDF для клиента
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Создавайте эстетичные отчеты по суточному рациону с фотографиями блюд и графиками нутриентов для отправки заказчикам в WhatsApp или Telegram.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBFBFA] border border-black/5 hover:border-black/15 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                  <HeartPulse size={20} />
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                  В разработке
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Фильтры диет и аллергенов
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Автоматическая проверка на лактозу, глютен, орехи и диетические протоколы (кето, халяль, веганство) находится в процессе интеграции.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBFBFA] border border-black/5 hover:border-black/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Администрирование и безопасность
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Многопользовательский режим с премодерацией регистраций администратором, защита конфиденциальности коммерческих рецептов.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing & Plans */}
      <section id="pricing" className="py-20 bg-[#FBFBFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-700 block mb-2">
              Тарифные планы
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight">
              Прозрачные условия под масштаб вашей работы
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              Все тарифные планы сейчас доступны по <span className="font-semibold text-gray-900">0 ₽</span> — открытый доступ ко всем модулям на этапе бета-тестирования после одобрения заявки администратором.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tier 1 */}
            <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Личный & Нутрициолог
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-2">Индивидуальный</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Для частного расчета своих рационов и ведения до 5 постоянных клиентов.
                </p>
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-950 font-mono">0 ₽</span>
                  <span className="text-xs text-emerald-700 font-medium">/ сейчас бесплатно</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>База 1000+ продуктов</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Расчет калорий и БЖУ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Конструктор сложных блюд</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Экспорт в PDF</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm rounded-xl transition-colors"
              >
                Подать заявку бесплатно
              </button>
            </div>

            {/* Tier 2 (Highlighted) */}
            <div className="bg-white p-8 rounded-3xl border-2 border-emerald-600 shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Популярный выбор кулинарий
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Готовая еда & Цех
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-2">Шеф & Кулинария</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Для проектов доставки рационов, фабрик-кухонь и заказных кулинарий.
                </p>
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-950 font-mono">0 ₽</span>
                  <span className="text-xs text-emerald-700 font-medium">/ 0 ₽ (сейчас бесплатно)</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Все из Индивидуального тарифа</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Неограниченная база клиентов</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Технологические карты (ТТК) для цеха</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Печать этикеток КБЖУ для контейнеров</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Учет потерь уварки и упека</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
              >
                Подключить для производства (0 ₽)
              </button>
            </div>

            {/* Tier 3 */}
            <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Банкеты & Мероприятия
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-2">Кейтеринг Pro</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Для кейтеринговых служб, выездных ресторанов и банкетных залов.
                </p>
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-950 font-mono">0 ₽</span>
                  <span className="text-xs text-emerald-700 font-medium">/ 0 ₽ (сейчас бесплатно)</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Все функции тарифа «Шеф & Кулинария»</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Масштабирование меню на 500+ персон</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>
                      Сводная ведомость закупки сырья
                      <span className="inline-block text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70 ml-1.5 align-middle">
                        В разработке
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>
                      Фильтры диет и аллергенов
                      <span className="inline-block text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70 ml-1.5 align-middle">
                        В разработке
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Многопользовательский доступ</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm rounded-xl transition-colors"
              >
                Оформить заявку Pro (0 ₽)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Accordion */}
      <section id="faq" className="py-20 bg-white border-t border-black/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-700 block mb-2">
              База знаний
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight">
              Часто задаваемые вопросы
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Можно ли вносить свои собственные ингредиенты и фирменные полуфабрикаты?',
                a: 'Да, в приложении есть полноценная база продуктов с возможностью добавлять любые свои позиции с указанием калорийности, БЖУ, витаминов и микроэлементов. Также поддерживается создание сложных составных блюд и полуфабрикатов.'
              },
              {
                q: 'Как работает премодерация регистрации?',
                a: 'После подачи заявки (логин и пароль) вы видите статус-заглушку. Администратор системы в панели управления проверяет заявку и активирует доступ. Предусмотрен лимит до 3 регистраций в час для защиты от спама.'
              },
              {
                q: 'Как система учитывает уварку и упек при готовке?',
                a: 'Каждый продукт имеет технологические коэффициенты термической обработки (варка, запекание, жарка, тушение). При расчете рецепта калорийность рассчитывается по исходному сырью, а выход порции приводится к фактическому готовому весу.'
              },
              {
                q: 'Подходит ли сервис для кейтеринга на сотни гостей?',
                a: 'Да, планировщик позволяет масштабировать рационы и формировать технологические карты (ТТК) на любое количество персон. Модуль автоматической сводной ведомости закупки сырья для отдела снабжения находится в разработке.'
              },
              {
                q: 'Есть ли встроенные фильтры диет и учет аллергенов?',
                a: 'Автоматическая система тегирования аллергенов (лактоза, глютен, орехи) и специализированных диет (кето, халяль, веган) находится в активной разработке. На данный момент ингредиенты и нутриенты точно настраиваются вручную в базе продуктов и конструкторе блюд.'
              },
              {
                q: 'В каком формате можно выгружать меню клиентам?',
                a: 'Доступна выгрузка в красивый брендированный PDF с фотографиями блюд и подробными макросами, а также прямая печать технологических карт (ТТК) для поваров на кухне.'
              }
            ].map((item, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-black/5 bg-[#FBFBFA] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-semibold text-gray-900 text-sm hover:text-emerald-700 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={18} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180 text-emerald-600' : 'text-gray-400'}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-black/5 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Final Call to Action */}
      <section className="py-20 bg-emerald-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
            Готовы автоматизировать расчет рационов?
          </h2>
          <p className="text-emerald-100 text-base md:text-lg mb-8 max-w-2xl mx-auto font-normal">
            Исключите человеческий фактор, сократите время шеф-повара на калькуляцию и предоставьте клиентам сервис ресторанного уровня с безупречным КБЖУ.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-950 font-bold text-base rounded-xl shadow-lg hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
            >
              Зарегистрироваться в NutriPlan+
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-800 hover:bg-emerald-750 text-white font-semibold text-base rounded-xl border border-emerald-700/60 transition-all"
            >
              Войти в существующий аккаунт
            </button>
          </div>
        </div>
      </section>

      {/* 9. Clean Footer */}
      <footer className="py-12 bg-[#F5F5F0] border-t border-black/5 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Utensils size={16} />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm">NutriPlan+</span>
              <p className="text-[11px] text-gray-400">Профессиональная система расчета питания</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-600">
            <button onClick={() => scrollToSection('audiences')} className="hover:text-emerald-700">Направления</button>
            <button onClick={() => scrollToSection('calculator')} className="hover:text-emerald-700">Калькулятор</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-emerald-700">Тарифы</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-emerald-700">FAQ</button>
          </div>

          <div className="text-center md:text-right text-[11px] text-gray-400">
            © {new Date().getFullYear()} NutriPlan+. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};
