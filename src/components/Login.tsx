import React, { useState } from 'react';
import { Utensils, Lock, UserPlus, Clock, CheckCircle2, AlertCircle, Eye, EyeOff, RefreshCw, ArrowLeft, ShieldAlert } from 'lucide-react';

interface LoginProps {
  onLogin: (firstLogin?: boolean, userRole?: string, username?: string) => void;
  initialMode?: 'login' | 'register';
  onBackToLanding?: () => void;
}

interface PendingUserInfo {
  username: string;
  created_at?: string;
  status?: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, initialMode = 'login', onBackToLanding }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'pending_stub'>(initialMode);
  
  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('NutriPlan_2024_Secure!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegPasswordConfirm, setShowRegPasswordConfirm] = useState(false);

  // Stub data state
  const [pendingUser, setPendingUser] = useState<PendingUserInfo | null>(null);
  const [statusCheckLoading, setStatusCheckLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'info' | 'success' | 'error' } | null>(null);

  // Common UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rememberMe }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const isDefault = password === 'NutriPlan_2024_Secure!' && username === 'admin';
        onLogin(isDefault, data.user?.role, data.user?.username);
      } else if (response.status === 403 && data.status === 'pending') {
        // Account is waiting for admin approval -> show the stub page
        setPendingUser({
          username: data.username || username,
          created_at: data.created_at || new Date().toISOString(),
          status: 'pending'
        });
        setStatusMessage({
          text: 'Ваша заявка ожидает подтверждения администратора.',
          type: 'info'
        });
        setMode('pending_stub');
      } else if (response.status === 403 && data.status === 'rejected') {
        setError('Ваша заявка на регистрацию была отклонена администратором.');
      } else {
        setError(data.error || 'Неверный логин или пароль');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUsername = regUsername.trim();
    if (!cleanUsername) {
      setError('Введите желаемый логин');
      return;
    }

    if (cleanUsername.length < 3) {
      setError('Логин должен быть не менее 3 символов');
      return;
    }

    if (/^\d+$/.test(cleanUsername) || cleanUsername === '123' || /^(.)\1+$/.test(cleanUsername)) {
      setError('Напишите осознанное слово — 123 не пройдет.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setError('Введенные пароли не совпадают');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          password: regPassword,
          passwordConfirm: regPasswordConfirm
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Switch to stub screen with user data
        setPendingUser({
          username: cleanUsername,
          created_at: data.user?.created_at || new Date().toISOString(),
          status: 'pending'
        });
        setStatusMessage({
          text: 'Заявка успешно принята! Ожидайте одобрения администратора.',
          type: 'success'
        });
        setMode('pending_stub');
        // Clear registration form
        setRegUsername('');
        setRegPassword('');
        setRegPasswordConfirm('');
      } else {
        setError(data.error || 'Не удалось зарегистрироваться');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!pendingUser?.username) return;
    setStatusCheckLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/registration-status?username=${encodeURIComponent(pendingUser.username)}`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (!res.ok) {
        setStatusMessage({
          text: data.error || 'Не удалось получить статус заявки',
          type: 'error'
        });
      } else if (data.status === 'approved') {
        setPendingUser(prev => prev ? { ...prev, status: 'approved' } : null);
        setStatusMessage({
          text: 'Поздравляем! Ваша заявка одобрена администратором. Теперь вы можете войти в систему.',
          type: 'success'
        });
      } else if (data.status === 'rejected') {
        setPendingUser(prev => prev ? { ...prev, status: 'rejected' } : null);
        setStatusMessage({
          text: 'К сожалению, заявка была отклонена администратором.',
          type: 'error'
        });
      } else {
        setStatusMessage({
          text: 'Заявка все еще ожидает рассмотрения администратором.',
          type: 'info'
        });
      }
    } catch (e) {
      setStatusMessage({
        text: 'Ошибка при проверке статуса',
        type: 'error'
      });
    } finally {
      setStatusCheckLoading(false);
    }
  };

  // 1. Pending Approval Stub Screen
  if (mode === 'pending_stub' && pendingUser) {
    const formattedDate = pendingUser.created_at
      ? new Date(pendingUser.created_at).toLocaleString('ru-RU', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Только что';

    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-black/5 max-w-lg w-full text-center">
          {/* Animated/Glowing Icon */}
          <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 shadow-sm border border-amber-100/60 relative">
            <Clock size={40} className="animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
            </span>
          </div>

          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
            Спасибо за регистрацию!
          </h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            Ваша заявка на регистрацию принята. Ждите одобрения заявки администратором.
          </p>

          {/* User Details Card */}
          <div className="bg-gray-50/80 rounded-2xl p-5 border border-black/5 text-left mb-6 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Логин</span>
              <span className="text-sm font-black text-gray-900 font-mono bg-white px-2.5 py-1 rounded-lg border border-black/5">
                {pendingUser.username}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Дата заявки</span>
              <span className="text-xs font-medium text-gray-700">
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Статус</span>
              {pendingUser.status === 'approved' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 size={14} /> Одобрено
                </span>
              ) : pendingUser.status === 'rejected' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                  <ShieldAlert size={14} /> Отклонено
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  <Clock size={14} /> Ожидает одобрения ⏳
                </span>
              )}
            </div>
          </div>

          {/* Status Message Alert */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-medium mb-6 text-left flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : statusMessage.type === 'error'
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              ) : (
                <Clock size={16} className="text-blue-600 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCheckStatus}
              disabled={statusCheckLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl py-3 px-4 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw size={16} className={statusCheckLoading ? 'animate-spin' : ''} />
              {statusCheckLoading ? 'Проверка...' : 'Проверить статус заявки'}
            </button>

            <button
              onClick={() => {
                setUsername(pendingUser.username);
                setPassword('');
                setError('');
                setMode('login');
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl py-3 px-4 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <ArrowLeft size={16} />
              Вернуться на страницу входа
            </button>
          </div>

          <p className="text-[11px] text-gray-400 mt-6">
            Администратор получит уведомление в панели управления и активирует ваш профиль.
          </p>
        </div>
      </div>
    );
  }

  // 2. Main Auth Card (Login or Register)
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 max-w-md w-full relative">
        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-700 transition-colors mb-4 group cursor-pointer"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            На главную страницу
          </button>
        )}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3">
            <Utensils size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">NutriPlan+</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {mode === 'login' ? 'Вход в личный кабинет' : 'Подача заявки на регистрацию'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <UserPlus size={14} />
            Регистрация
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-medium flex items-start gap-2">
            <Lock size={16} className="shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Логин</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-black/10 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                placeholder="Введите логин"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-black/10 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  placeholder="Введите пароль"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  title={showPassword ? "Скрыть" : "Показать"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 bg-gray-50 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-xs text-gray-600 font-medium">Запомнить меня</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                Регистрация
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors mt-4 text-sm shadow-sm"
            >
              {loading ? 'Вход в систему...' : 'Войти'}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Логин</label>
              </div>
              <input
                type="text"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                className="w-full bg-gray-50 border border-black/10 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                placeholder="Придумайте логин (например: maria_diet)"
                required
              />
              <p className="text-[11px] text-gray-500 mt-1.5">
                Напишите осознанное слово — 123 не пройдет.
              </p>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Пароль</label>
              <div className="relative">
                <input
                  type={showRegPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-black/10 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  placeholder="Минимум 6 символов"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Повторите пароль</label>
              <div className="relative">
                <input
                  type={showRegPasswordConfirm ? "text" : "password"}
                  value={regPasswordConfirm}
                  onChange={(e) => setRegPasswordConfirm(e.target.value)}
                  className="w-full bg-gray-50 border border-black/10 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  placeholder="Повторите пароль еще раз"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegPasswordConfirm(!showRegPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showRegPasswordConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Rate limit badge / info */}
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-[11px] text-amber-800 leading-snug flex items-center gap-2">
              <Clock size={16} className="text-amber-600 shrink-0" />
              <span>Ограничение безопасности: <strong>не более 3 регистраций в час</strong>. Доступ активируется после одобрения администратором.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors mt-2 text-sm shadow-sm flex items-center justify-center gap-2"
            >
              <UserPlus size={16} />
              {loading ? 'Отправка заявки...' : 'Зарегистрироваться'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-xs text-gray-500 hover:text-emerald-600 font-medium transition-colors"
              >
                Уже есть учетная запись? <span className="font-bold underline">Войти</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
