import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { Settings as SettingsIcon, Info, Plus, Trash2, Utensils, ChevronUp, ChevronDown, Lock, Eye, EyeOff, MessageSquare, Bell, Send, Save, Check, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { APP_VERSION, BUILD_NUMBER } from '../constants';

interface SettingsViewProps {
  userRole?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ userRole = 'admin' }) => {
  const isAdmin = userRole === 'admin';
  const { settings, updateSettings, currentPlan, updatePlanSettings, dishes, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'global' | 'project'>(currentPlan ? 'project' : 'global');
  const [newMealLabel, setNewMealLabel] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Telegram integration state (Admin only)
  const [tgBotToken, setTgBotToken] = useState('');
  const [tgChatId, setTgChatId] = useState('');
  const [tgContactNote, setTgContactNote] = useState('');
  const [tgNotifyNewClients, setTgNotifyNewClients] = useState(true);
  const [tgNotifyNewUsers, setTgNotifyNewUsers] = useState(true);
  const [tgNotifyFeedback, setTgNotifyFeedback] = useState(true);
  const [tgConfigured, setTgConfigured] = useState(false);
  const [showBotToken, setShowBotToken] = useState(false);
  const [showTgHelp, setShowTgHelp] = useState(false);
  const [tgSaving, setTgSaving] = useState(false);
  const [tgSaved, setTgSaved] = useState(false);
  const [tgTesting, setTgTesting] = useState(false);
  const [tgStatusMsg, setTgStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetch('/api/admin/telegram', { credentials: 'include' })
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data) {
            setTgBotToken(data.botToken || '');
            setTgChatId(data.chatId || '');
            setTgContactNote(data.contactNote || '');
            setTgNotifyNewClients(data.notifyNewClients !== false);
            setTgNotifyNewUsers(data.notifyNewUsers !== false);
            setTgNotifyFeedback(data.notifyFeedback !== false);
            setTgConfigured(Boolean(data.isConfigured));
          }
        })
        .catch(err => console.error('Failed to load Telegram settings:', err));
    }
  }, [isAdmin]);

  const handleSaveTelegram = async () => {
    setTgSaving(true);
    setTgStatusMsg(null);
    try {
      const res = await fetch('/api/admin/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          botToken: tgBotToken.trim(),
          chatId: tgChatId.trim(),
          contactNote: tgContactNote.trim(),
          notifyNewClients: tgNotifyNewClients,
          notifyNewUsers: tgNotifyNewUsers,
          notifyFeedback: tgNotifyFeedback,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTgConfigured(Boolean(data.isConfigured));
        setTgSaved(true);
        setTgStatusMsg({ type: 'success', text: 'Настройки Telegram и уведомлений сохранены' });
        showNotification('Настройки Telegram сохранены', 'success');
        setTimeout(() => setTgSaved(false), 2500);
      } else {
        setTgStatusMsg({ type: 'error', text: data.error || 'Ошибка сохранения настроек' });
      }
    } catch {
      setTgStatusMsg({ type: 'error', text: 'Ошибка подключения к серверу' });
    } finally {
      setTgSaving(false);
    }
  };

  const handleTestTelegram = async () => {
    setTgTesting(true);
    setTgStatusMsg(null);
    try {
      const res = await fetch('/api/admin/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          botToken: tgBotToken.trim(),
          chatId: tgChatId.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTgStatusMsg({ type: 'success', text: 'Тестовое сообщение доставлено в ваш Telegram!' });
        showNotification('Тестовое сообщение отправлено в Telegram', 'success');
      } else {
        setTgStatusMsg({ type: 'error', text: data.error || 'Не удалось отправить тестовое сообщение' });
      }
    } catch {
      setTgStatusMsg({ type: 'error', text: 'Ошибка соединения при отправке теста' });
    } finally {
      setTgTesting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification('Новые пароли не совпадают', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showNotification('Новый пароль должен быть не менее 6 символов', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        showNotification('Пароль успешно изменен', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showNotification(data.error || 'Ошибка при смене пароля', 'error');
      }
    } catch (err) {
      showNotification('Ошибка подключения к серверу', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const isProject = activeTab === 'project' && currentPlan;
  const currentMealTypes = isProject ? (currentPlan.mealTypes || settings.mealTypes) : settings.mealTypes;
  const currentCategories = isProject ? (currentPlan.mealCategories || settings.mealCategories) : settings.mealCategories;

  const addMealType = () => {
    if (!newMealLabel) return;
    const id = Math.random().toString(36).substr(2, 9);
    const newTypes = [...currentMealTypes, { id, label: newMealLabel }];
    
    if (isProject) {
      updatePlanSettings(newTypes, currentCategories);
    } else {
      updateSettings({ ...settings, mealTypes: newTypes });
    }
    setNewMealLabel('');
  };

  const removeMealType = (id: string) => {
    if (isProject && currentPlan) {
      let hasData = false;
      Object.values(currentPlan.data).forEach((day: any) => {
        if (day && day.meals) {
          const meal = day.meals.find((m: any) => m.type === id);
          if (meal && meal.items) {
            const hasFilledItems = meal.items.some((item: any) => item.weight > 0 || item.kcal > 0 || item.proteins > 0 || item.fats > 0 || item.carbs > 0 || item.productId || item.dishId);
            if (hasFilledItems) {
              hasData = true;
            }
          }
        }
      });

      if (hasData) {
        if (confirmDeleteId !== id) {
          setConfirmDeleteId(id);
          setTimeout(() => setConfirmDeleteId(null), 3000);
          return;
        }
      }
    }

    const newTypes = currentMealTypes.filter(m => m.id !== id);
    if (isProject) {
      updatePlanSettings(newTypes, currentCategories);
    } else {
      updateSettings({ ...settings, mealTypes: newTypes });
    }
    setConfirmDeleteId(null);
  };

  const updateMealLabel = (id: string, label: string) => {
    const newTypes = currentMealTypes.map(m => m.id === id ? { ...m, label } : m);
    if (isProject) {
      updatePlanSettings(newTypes, currentCategories);
    } else {
      updateSettings({ ...settings, mealTypes: newTypes });
    }
  };

  const moveMealType = (index: number, direction: 'up' | 'down') => {
    const newMealTypes = [...currentMealTypes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newMealTypes.length) return;
    
    const [moved] = newMealTypes.splice(index, 1);
    newMealTypes.splice(targetIndex, 0, moved);
    
    if (isProject) {
      updatePlanSettings(newMealTypes, currentCategories);
    } else {
      updateSettings({ ...settings, mealTypes: newMealTypes });
    }
  };

  const [newCategoryLabel, setNewCategoryLabel] = useState('');

  const addCategory = () => {
    if (!newCategoryLabel) return;
    const newCats = [...currentCategories, newCategoryLabel];
    if (isProject) {
      updatePlanSettings(currentMealTypes, newCats);
    } else {
      updateSettings({ ...settings, mealCategories: newCats });
    }
    setNewCategoryLabel('');
  };

  const removeCategory = (index: number) => {
    const categoryName = currentCategories[index];
    
    // Check if any dish uses this category
    const isUsedByDish = dishes.some(d => d.categories?.includes(categoryName));
    
    if (isUsedByDish) {
      showNotification(`Категория "${categoryName}" используется в блюдах. Сначала удалите её из всех блюд в конструкторе.`, 'error');
      return;
    }

    const newCats = currentCategories.filter((_, i) => i !== index);
    if (isProject) {
      updatePlanSettings(currentMealTypes, newCats);
    } else {
      updateSettings({ ...settings, mealCategories: newCats });
    }
  };

  const updateCategoryLabel = (index: number, label: string) => {
    const newCategories = [...currentCategories];
    newCategories[index] = label;
    if (isProject) {
      updatePlanSettings(currentMealTypes, newCategories);
    } else {
      updateSettings({ ...settings, mealCategories: newCategories });
    }
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...currentCategories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCategories.length) return;
    
    const [moved] = newCategories.splice(index, 1);
    newCategories.splice(targetIndex, 0, moved);
    
    if (isProject) {
      updatePlanSettings(currentMealTypes, newCategories);
    } else {
      updateSettings({ ...settings, mealCategories: newCategories });
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Настройки</h2>
          <p className="text-gray-500">Конфигурация системы расчета и визуализации</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl border border-black/5">
          <button 
            onClick={() => setActiveTab('global')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'global' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Общие (Шаблоны)
          </button>
          <button 
            onClick={() => setActiveTab('project')}
            disabled={!currentPlan}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!currentPlan ? 'opacity-50 cursor-not-allowed' : ''} ${activeTab === 'project' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Текущий рацион
          </button>
        </div>
      </div>

      {isProject && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <Info size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-900">Настройки для рациона: {currentPlan.clientName}</p>
            <p className="text-xs text-emerald-700">Изменения здесь коснутся только этого конкретного проекта.</p>
          </div>
        </div>
      )}

      {/* Admin-only Telegram Bot & Notifications Integration Module */}
      {isAdmin && (
        <div className="mb-8 bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-100 text-sky-600 rounded-xl">
                <MessageSquare size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-lg">Канал связи и интеграция с Telegram</h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      tgConfigured
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {tgConfigured ? 'Подключено' : 'Не настроено'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Привязка вашего Telegram-бота или чата для получения сообщений обратной связи от пользователей и уведомлений
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTgHelp(prev => !prev)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              <HelpCircle size={15} />
              {showTgHelp ? 'Скрыть инструкцию' : 'Как подключить бота?'}
            </button>
          </div>

          <div className="p-6 space-y-6">
            {showTgHelp && (
              <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 text-xs text-sky-950 space-y-3">
                <div>
                  <p className="font-bold text-sm mb-1">Быстрая привязка Telegram-чата администратора:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sky-900/90">
                    <li>
                      В Telegram откройте <b>@BotFather</b>, отправьте команду <code>/newbot</code> и скопируйте полученный <b>Bot Token</b>.
                    </li>
                    <li>
                      Напишите вашему новому боту сообщение <code>/start</code> (или добавьте бота в рабочую группу администраторов).
                    </li>
                    <li>
                      Узнайте ваш <b>Chat ID</b> (например, через <b>@userinfobot</b> или <b>@getmyid_bot</b>) и укажите его ниже. Для группового чата ID начинается со знака минус (например, <code>-100123456789</code>).
                    </li>
                  </ol>
                </div>
                <div className="pt-2 border-t border-sky-200/80">
                  <p className="font-bold text-sm mb-1">Подтверждение и отклонение новых пользователей прямо в боте:</p>
                  <ul className="list-disc list-inside space-y-1 text-sky-900/90">
                    <li>
                      Под каждым уведомлением о новой регистрации приходят интерактивные кнопки <b>«✅ Подтвердить»</b> и <b>«❌ Отклонить»</b>.
                    </li>
                    <li>
                      Также поддерживаются текстовые команды в чате с ботом: <code>Подтвердить</code> (или <code>Подтвердить логин</code>), <code>Отклонить</code> (или <code>Отклонить логин</code>), а также <code>Заявки</code> (или <code>/pending</code>) для вывода всех ожидающих пользователей.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Telegram Bot Token
                </label>
                <div className="relative">
                  <input
                    type={showBotToken ? 'text' : 'password'}
                    value={tgBotToken}
                    onChange={e => setTgBotToken(e.target.value)}
                    placeholder="1234567890:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowBotToken(prev => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                    title={showBotToken ? 'Скрыть токен' : 'Показать токен'}
                  >
                    {showBotToken ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  ID чата или канала администратора (Telegram Chat ID)
                </label>
                <input
                  type="text"
                  value={tgChatId}
                  onChange={e => setTgChatId(e.target.value)}
                  placeholder="Например: 482910492 или -100192837465"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Информационная подпись для пользователей (отображается в окне «Обратная связь»)
              </label>
              <input
                type="text"
                value={tgContactNote}
                onChange={e => setTgContactNote(e.target.value)}
                placeholder="Например: Отвечаем ежедневно с 9:00 до 20:00. Для быстрого ответа укажите ваш @username или телефон."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Уведомления (Notifications) */}
            <div className="pt-4 border-t border-black/5">
              <div className="flex items-center gap-2 mb-2">
                <Bell size={18} className="text-emerald-600" />
                <h4 className="font-bold text-sm text-gray-900">Уведомления</h4>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Настройте, о каких событиях отправлять мгновенные оповещения в ваш Telegram-чат:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    tgNotifyNewClients
                      ? 'border-emerald-600/40 bg-emerald-50/40'
                      : 'border-black/10 hover:border-black/20 bg-gray-50/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={tgNotifyNewClients}
                    onChange={e => setTgNotifyNewClients(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-sm text-gray-900">Уведомления о новых клиентах</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Оповещать при создании нового рациона клиента в журнале рационов
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    tgNotifyNewUsers
                      ? 'border-emerald-600/40 bg-emerald-50/40'
                      : 'border-black/10 hover:border-black/20 bg-gray-50/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={tgNotifyNewUsers}
                    onChange={e => setTgNotifyNewUsers(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-sm text-gray-900">Регистрация новых пользователей</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Оповещения о новых заявках с кнопками «✅ Подтвердить» / «❌ Отклонить» и поддержкой команд прямо в боте
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    tgNotifyFeedback
                      ? 'border-emerald-600/40 bg-emerald-50/40'
                      : 'border-black/10 hover:border-black/20 bg-gray-50/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={tgNotifyFeedback}
                    onChange={e => setTgNotifyFeedback(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-sm text-gray-900">Сообщения обратной связи</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Пересылать обращения авторизованных пользователей из окна чата в Telegram
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {tgStatusMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  tgStatusMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {tgStatusMsg.type === 'success' ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                ) : (
                  <XCircle size={16} className="text-red-600 shrink-0" />
                )}
                <span>{tgStatusMsg.text}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestTelegram}
                disabled={tgTesting || !tgBotToken.trim() || !tgChatId.trim()}
                className="flex items-center gap-2 px-4 py-2.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-sm font-bold hover:bg-sky-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send size={16} />
                {tgTesting ? 'Отправка теста...' : 'Проверить связь (Тест)'}
              </button>

              <button
                type="button"
                onClick={handleSaveTelegram}
                disabled={tgSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {tgSaved ? <Check size={16} /> : <Save size={16} />}
                {tgSaved ? 'Сохранено' : 'Сохранить настройки Telegram'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {/* Column 1: Core Configuration */}
        <div className="space-y-6">
          {/* Deviation Setting */}
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <SettingsIcon size={20} />
              </div>
              <h3 className="font-bold text-lg">Отклонение</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Допустимый % отклонения от цели.
            </p>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="20" 
                step="1"
                className="flex-1 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                value={settings.deviation}
                onChange={(e) => updateSettings({ ...settings, deviation: Number(e.target.value) })}
              />
              <span className="w-12 text-center font-bold text-emerald-600 bg-emerald-50 py-1 rounded-lg border border-emerald-100 text-sm">
                {settings.deviation}%
              </span>
            </div>
          </div>

          {/* Calculation Method */}
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Info size={20} />
              </div>
              <h3 className="font-bold text-lg">Расчет</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-black/5 bg-gray-50">
                <input 
                  type="radio" 
                  id="proportional" 
                  name="calcMethod" 
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  checked={settings.calculationMethod === 'proportional'}
                  onChange={() => updateSettings({ ...settings, calculationMethod: 'proportional' })}
                />
                <label htmlFor="proportional" className="flex-1 cursor-pointer">
                  <span className="block font-medium text-sm">Пропорциональный</span>
                  <span className="block text-[10px] text-gray-400">
                    БЖУ пересчитываются пропорционально весу (база 100г).
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-black/5 bg-gray-50">
                <input 
                  type="radio" 
                  id="fixed" 
                  name="calcMethod" 
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  checked={settings.calculationMethod === 'fixed'}
                  onChange={() => updateSettings({ ...settings, calculationMethod: 'fixed' })}
                />
                <label htmlFor="fixed" className="flex-1 cursor-pointer">
                  <span className="block font-medium text-sm">Фиксированный (на порцию)</span>
                  <span className="block text-[10px] text-gray-400">
                    Расчет на 1 шт/порцию. Изменение веса не влияет на БЖУ.
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-black/5 bg-gray-50">
                <input 
                  type="radio" 
                  id="manual" 
                  name="calcMethod" 
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  checked={settings.calculationMethod === 'manual'}
                  onChange={() => updateSettings({ ...settings, calculationMethod: 'manual' })}
                />
                <label htmlFor="manual" className="flex-1 cursor-pointer">
                  <span className="block font-medium text-sm">Ручной ввод</span>
                  <span className="block text-[10px] text-gray-400">
                    Автоматический расчет отключен. Все данные вводятся вручную.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Authentication Mode */}
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Lock size={20} />
              </div>
              <h3 className="font-bold text-lg">Авторизация</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-black/5 bg-gray-50">
                <input 
                  type="radio" 
                  id="auth_password" 
                  name="authMode" 
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  checked={settings.authMode === 'password'}
                  onChange={() => updateSettings({ ...settings, authMode: 'password' })}
                />
                <label htmlFor="auth_password" className="flex-1 cursor-pointer">
                  <span className="block font-medium text-sm">По паролю</span>
                  <span className="block text-[10px] text-gray-400">
                    Требуется ввод логина и пароля при входе.
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-black/5 bg-gray-50">
                <input 
                  type="radio" 
                  id="auth_none" 
                  name="authMode" 
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  checked={settings.authMode === 'none'}
                  onChange={() => updateSettings({ ...settings, authMode: 'none' })}
                />
                <label htmlFor="auth_none" className="flex-1 cursor-pointer">
                  <span className="block font-medium text-sm">Без пароля</span>
                  <span className="block text-[10px] text-gray-400">
                    Вход в систему выполняется автоматически.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* AI Instructions */}
          <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Info size={18} />
              AI Prompt Guide (JSON)
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] text-indigo-100 leading-relaxed mb-2 font-bold uppercase">
                  1. Генерация Рациона:
                </p>
                <div className="bg-black/20 p-3 rounded-xl text-[10px] font-mono break-all select-all cursor-pointer hover:bg-black/30 transition-colors">
                  {'Return ONLY a JSON object: { "clientName": string, "targetKcal": number, "targetProteins": number, "targetFats": number, "targetCarbs": number, "data": { "day1": { "meals": [ { "type": "meal_id_from_settings", "items": [ { "name": string, "weight": number, "proteins": number, "fats": number, "carbs": number, "kcal": number } ] } ] }, ... "day7": { ... } } }. Important: "type" must match IDs from settings.'}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-indigo-100 leading-relaxed mb-2 font-bold uppercase">
                  2. База Продуктов:
                </p>
                <div className="bg-black/20 p-3 rounded-xl text-[10px] font-mono break-all select-all cursor-pointer hover:bg-black/30 transition-colors">
                  {'Return ONLY a JSON ARRAY []. Each object MUST be flat: { "name": string, "proteins": number, "fats": number, "carbs": number, "kcal": number, "portion": 100 }. MANDATORY: All nutrient values (BJU/Kcal) MUST be strictly per 100g. Do NOT include "id" or "ingredients".'}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-indigo-100 leading-relaxed mb-2 font-bold uppercase">
                  3. Готовые Блюда:
                </p>
                <div className="bg-black/20 p-3 rounded-xl text-[10px] font-mono break-all select-all cursor-pointer hover:bg-black/30 transition-colors">
                  {'Return ONLY a JSON ARRAY []. Each object: { "name": string, "proteins": number, "fats": number, "carbs": number, "kcal": number, "portion": number, "ingredients": [ { "name": string, "weight": number, "proteins": number, "fats": number, "carbs": number, "kcal": number } ] }. Values are for the total "portion".'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Meal Types */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Utensils size={20} />
              </div>
              <h3 className="font-bold text-lg">Приемы пищи</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Список основных приемов пищи (Завтрак, Обед и т.д.)
            </p>
            
            <div className="space-y-2 mb-4 max-h-[400px] overflow-auto pr-2">
              {currentMealTypes.map((meal, idx) => (
                <div key={meal.id} className="flex items-center gap-2 group">
                  <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => moveMealType(idx, 'up')}
                      disabled={idx === 0}
                      className="p-0.5 text-gray-400 hover:text-emerald-600 disabled:opacity-20"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button 
                      onClick={() => moveMealType(idx, 'down')}
                      disabled={idx === currentMealTypes.length - 1}
                      className="p-0.5 text-gray-400 hover:text-emerald-600 disabled:opacity-20"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    className="flex-1 min-w-0 px-3 py-2 border border-black/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    value={meal.label}
                    onChange={(e) => updateMealLabel(meal.id, e.target.value)}
                  />
                  <button 
                    onClick={() => removeMealType(meal.id)}
                    className={`p-2 rounded-lg transition-colors shrink-0 ${confirmDeleteId === meal.id ? 'bg-red-600 text-white opacity-100' : 'text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100'}`}
                    title={confirmDeleteId === meal.id ? "Нажмите еще раз для удаления (есть заполненные блюда)" : "Удалить"}
                  >
                    {confirmDeleteId === meal.id ? <span className="text-[10px] font-bold whitespace-nowrap">УДАЛИТЬ?</span> : <Trash2 size={16} />}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Новый прием..." 
                className="flex-1 px-3 py-2 border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={newMealLabel}
                onChange={(e) => setNewMealLabel(e.target.value)}
              />
              <button 
                onClick={addMealType}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Categories */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Plus size={20} />
              </div>
              <h3 className="font-bold text-lg">Категории блюд</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Подстроки, создаваемые внутри каждого приема.
            </p>
            
            <div className="space-y-2 mb-4 max-h-[400px] overflow-auto pr-2">
              {currentCategories.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => moveCategory(idx, 'up')}
                      disabled={idx === 0}
                      className="p-0.5 text-gray-400 hover:text-blue-600 disabled:opacity-20"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button 
                      onClick={() => moveCategory(idx, 'down')}
                      disabled={idx === currentCategories.length - 1}
                      className="p-0.5 text-gray-400 hover:text-blue-600 disabled:opacity-20"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    className="flex-1 min-w-0 px-3 py-2 border border-black/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={cat}
                    onChange={(e) => updateCategoryLabel(idx, e.target.value)}
                  />
                  <button 
                    onClick={() => removeCategory(idx)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Новая категория..." 
                className="flex-1 px-3 py-2 border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={newCategoryLabel}
                onChange={(e) => setNewCategoryLabel(e.target.value)}
              />
              <button 
                onClick={addCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
            <h4 className="font-bold mb-2">Совет</h4>
            <p className="text-[11px] text-emerald-50/80 leading-relaxed">
              Настройте приемы пищи один раз и используйте их как шаблон для всех новых клиентов.
            </p>
          </div>

          {/* Security Section */}
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <Lock size={20} />
              </div>
              <h3 className="font-bold text-lg">Безопасность</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Смена пароля администратора.
            </p>
            
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div className="relative">
                <input 
                  type={showPasswords ? "text" : "password"} 
                  placeholder="Текущий пароль" 
                  className="w-full px-3 py-2 border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <input 
                  type={showPasswords ? "text" : "password"} 
                  placeholder="Новый пароль" 
                  className="w-full px-3 py-2 border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <input 
                  type={showPasswords ? "text" : "password"} 
                  placeholder="Повторите пароль" 
                  className="w-full px-3 py-2 border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center justify-between gap-2">
                <button 
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="text-[10px] font-bold text-gray-400 uppercase hover:text-gray-600 flex items-center gap-1"
                >
                  {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPasswords ? 'Скрыть' : 'Показать'}
                </button>
                
                <button 
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {passwordLoading ? '...' : 'Обновить'}
                </button>
              </div>
            </form>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-[10px] text-gray-400 leading-tight">
                <span className="font-bold text-gray-500">Восстановление:</span> Если вы забыли пароль, создайте файл <code className="bg-gray-200 px-1 rounded">reset_password.txt</code> в корневой папке программы и впишите туда новый пароль. Перезапустите программу.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-400 text-xs">
            <p>NutriPlan+ v{APP_VERSION}</p>
            <p className="text-[10px] mt-1 opacity-70">Сборка {BUILD_NUMBER}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
