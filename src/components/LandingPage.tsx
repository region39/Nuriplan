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
  Plus, 
  Minus,
  Layers,
  HeartPulse,
  TrendingDown,
  TrendingUp,
  Target
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (initialMode?: 'login' | 'register') => void;
  isAuthenticated?: boolean;
  onGoToApp?: () => void;
}

interface DemoDish {
  id: string;
  name: string;
  category: 'Завтрак' | 'Обед' | 'Полдник' | 'Ужин';
  portionGrams: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbsPer100g: number;
  fiberPer100g: number;
  iconName: string;
  description: string;
  active: boolean;
}

const INITIAL_DEMO_DISHES: DemoDish[] = [
  {
    id: 'dish-1',
    name: 'Овсяная каша с лесными ягодами и миндалем',
    category: 'Завтрак',
    portionGrams: 260,
    caloriesPer100g: 135,
    proteinPer100g: 4.8,
    fatPer100g: 4.5,
    carbsPer100g: 18.2,
    fiberPer100g: 3.1,
    iconName: 'oatmeal',
    description: 'Овсяные хлопья длительной варки, миндальное молоко, семена чиа, свежая черника',
    active: true,
  },
  {
    id: 'dish-2',
    name: 'Филе мурманского лосося с диким киноа и брокколи',
    category: 'Обед',
    portionGrams: 320,
    caloriesPer100g: 168,
    proteinPer100g: 14.5,
    fatPer100g: 7.8,
    carbsPer100g: 9.8,
    fiberPer100g: 2.6,
    iconName: 'salmon',
    description: 'Лосось на пару су-вид, триколор киноа, спаржевая капуста, лимонный дрессинг',
    active: true,
  },
  {
    id: 'dish-3',
    name: 'Греческий йогурт с грецким орехом и цветочным медом',
    category: 'Полдник',
    portionGrams: 170,
    caloriesPer100g: 122,
    proteinPer100g: 9.2,
    fatPer100g: 5.6,
    carbsPer100g: 8.5,
    fiberPer100g: 0.8,
    iconName: 'yogurt',
    description: 'Фермерский йогурт 2%, дробленый калифорнийский орех, липовый мед',
    active: true,
  },
  {
    id: 'dish-4',
    name: 'Стейк из филе индейки с печеными овощами гриль',
    category: 'Ужин',
    portionGrams: 300,
    caloriesPer100g: 130,
    proteinPer100g: 16.4,
    fatPer100g: 4.2,
    carbsPer100g: 6.5,
    fiberPer100g: 2.9,
    iconName: 'turkey',
    description: 'Грудка индейки в травах Прованса, кабачки цукини, паприка, соус песто',
    active: true,
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onOpenAuth, 
  isAuthenticated = false, 
  onGoToApp 
}) => {
  // Demo calculator state
  const [goal, setGoal] = useState<'balance' | 'loss' | 'gain'>('balance');
  const [targetCalories, setTargetCalories] = useState<number>(2000);
  const [dishes, setDishes] = useState<DemoDish[]>(INITIAL_DEMO_DISHES);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Goal handler
  const handleSelectGoal = (selected: 'balance' | 'loss' | 'gain') => {
    setGoal(selected);
    if (selected === 'loss') setTargetCalories(1700);
    else if (selected === 'gain') setTargetCalories(2500);
    else setTargetCalories(2050);
  };

  const handleToggleDish = (id: string) => {
    setDishes(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  const handlePortionChange = (id: string, delta: number) => {
    setDishes(prev => prev.map(d => {
      if (d.id === id) {
        const nextWeight = Math.max(50, Math.min(800, d.portionGrams + delta));
        return { ...d, portionGrams: nextWeight };
      }
      return d;
    }));
  };

  // Calculations
  const activeDishes = dishes.filter(d => d.active);
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
            {/* Goal selector - segmented button tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
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

            {/* Layout: Dishes list + Summary Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
              {/* Left Column: Sample Menu */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    2. Пример блюд в суточном плане ({activeDishes.length} из {dishes.length} выбрано)
                  </span>
                  <span className="text-xs text-gray-500">
                    Нажмите на блюдо для включения или измените граммовку
                  </span>
                </div>

                {dishes.map((dish) => {
                  const dishCalories = Math.round((dish.caloriesPer100g * dish.portionGrams) / 100);
                  const dishProtein = ((dish.proteinPer100g * dish.portionGrams) / 100).toFixed(1);
                  const dishFat = ((dish.fatPer100g * dish.portionGrams) / 100).toFixed(1);
                  const dishCarbs = ((dish.carbsPer100g * dish.portionGrams) / 100).toFixed(1);

                  return (
                    <div 
                      key={dish.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        dish.active 
                          ? 'bg-white border-black/10 shadow-xs' 
                          : 'bg-gray-50/70 border-dashed border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleDish(dish.id)}
                            className={`w-6 h-6 mt-0.5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                              dish.active 
                                ? 'bg-emerald-600 border-emerald-600 text-white' 
                                : 'border-gray-300 hover:border-gray-400 bg-white'
                            }`}
                            title={dish.active ? 'Отключить блюдо' : 'Включить блюдо'}
                          >
                            {dish.active && <CheckCircle2 size={16} />}
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-700 tracking-wide">
                                {dish.category}
                              </span>
                              <span className="text-gray-300">·</span>
                              <h4 className="text-sm font-bold text-gray-900">
                                {dish.name}
                              </h4>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {dish.description}
                            </p>
                          </div>
                        </div>

                        {/* Weight controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            disabled={!dish.active || dish.portionGrams <= 50}
                            onClick={() => handlePortionChange(dish.id, -20)}
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors disabled:opacity-40"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="font-mono text-xs font-bold text-gray-900 w-12 text-center">
                            {dish.portionGrams} г
                          </span>
                          <button
                            type="button"
                            disabled={!dish.active || dish.portionGrams >= 800}
                            onClick={() => handlePortionChange(dish.id, 20)}
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors disabled:opacity-40"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Nutrient micro-bar */}
                      {dish.active && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                          <span className="font-mono font-semibold text-gray-900">
                            {dishCalories} ккал
                          </span>
                          <div className="flex items-center gap-3 text-[11px] text-gray-500 font-mono">
                            <span>Б: <strong className="text-gray-800">{dishProtein}г</strong></span>
                            <span>Ж: <strong className="text-gray-800">{dishFat}г</strong></span>
                            <span>У: <strong className="text-gray-800">{dishCarbs}г</strong></span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Reactive Summary Panel */}
              <div className="lg:col-span-5 bg-[#FBFBFA] rounded-2xl border border-black/5 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      3. Итоговый баланс рациона
                    </span>
                    <span className="text-xs font-medium text-emerald-700 font-mono">
                      Онлайн-калькуляция
                    </span>
                  </div>

                  {/* Calories total */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">Энергетическая ценность</span>
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

                  {/* Additional Micro summary */}
                  <div className="p-3.5 bg-white rounded-xl border border-black/5 mb-6 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Пищевые волокна (клетчатка)</span>
                      <span className="font-mono font-bold text-gray-900">{totalFiber} г</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Чистый вес рациона</span>
                      <span className="font-mono font-bold text-gray-900">
                        {activeDishes.reduce((s, d) => s + d.portionGrams, 0)} г
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Уварка / упек учтены</span>
                      <span className="text-emerald-700 font-medium">Да, в ТТК</span>
                    </div>
                  </div>
                </div>

                {/* Save CTA */}
                <div>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group"
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
