/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store';
import { Dashboard } from './components/Dashboard';
import { Planner } from './components/Planner';
import { Database } from './components/Database';
import { DishConstructor } from './components/DishConstructor';
import { SettingsView } from './components/SettingsView';
import { Notification } from './components/Notification';
import { PublicPlanView } from './components/PublicPlanView';
import { Login } from './components/Login';
import { UsersManagement } from './components/UsersManagement';
import { LandingPage } from './components/LandingPage';
import { LayoutDashboard, Calendar, Database as DbIcon, Settings as SettingsIcon, Utensils, RefreshCw, LogOut, Users as UsersIcon, Globe } from 'lucide-react';
import { APP_VERSION, BUILD_NUMBER } from './constants';

type NavigationTab = 'dashboard' | 'planner' | 'database' | 'dishes' | 'settings' | 'users';

function MainContent({ 
  onLogout, 
  onShowLanding,
  initialTab = 'dashboard',
  userRole = 'user',
  currentUsername = 'admin'
}: { 
  onLogout: () => void; 
  onShowLanding?: () => void;
  initialTab?: NavigationTab;
  userRole?: string;
  currentUsername?: string;
}) {
  const [activeTab, setActiveTab] = useState<NavigationTab>(initialTab);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const { currentPlan, loadPlans, loadProducts, loadDishes, isDishConstructorDirty, setIsDishConstructorDirty } = useApp();

  // Track pending users count for admin
  useEffect(() => {
    if (userRole === 'admin') {
      const fetchPending = async () => {
        try {
          const res = await fetch('/api/admin/users', { credentials: 'include' });
          if (res.ok) {
            const users = await res.json();
            if (Array.isArray(users)) {
              setPendingCount(users.filter((u: any) => u.status === 'pending').length);
            }
          }
        } catch {
          // ignore
        }
      };
      fetchPending();
      const interval = setInterval(fetchPending, 20000);
      return () => clearInterval(interval);
    }
  }, [userRole, activeTab]);

  const handleTabChange = (tab: NavigationTab) => {
    if (activeTab === 'dishes' && tab !== 'dishes' && isDishConstructorDirty) {
      if (!window.confirm('У вас есть несохраненные изменения в конструкторе блюд. Вы уверены, что хотите уйти? Изменения будут потеряны.')) {
        return;
      }
      setIsDishConstructorDirty(false);
    }
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
      // Clear state and redirect to root
      onLogout();
      window.location.href = '/';
    } catch (e) {
      console.error('Logout failed', e);
      window.location.href = '/';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans">
      {/* Top Navigation */}
      <header className="bg-white border-b border-black/5 flex items-center justify-between px-6 py-3 shadow-sm z-50">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-600 flex items-baseline gap-2">
              NutriPlan+
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest" title={`Build ${BUILD_NUMBER}`}>
                v{APP_VERSION}
              </span>
            </h1>
          </div>
          
          <nav className="flex items-center gap-1">
            <button 
              onClick={() => handleTabChange('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-none transition-all ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-gray-50 text-gray-500'}`}
            >
              <LayoutDashboard size={18} />
              <span className="text-sm">Журнал рационов</span>
            </button>
            
            <button 
              onClick={() => handleTabChange('planner')}
              className={`flex items-center gap-2 px-4 py-2 rounded-none transition-all ${activeTab === 'planner' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-gray-50 text-gray-500'}`}
            >
              <Calendar size={18} />
              <span className="text-sm">Планировщик</span>
            </button>

            <button 
              onClick={() => handleTabChange('dishes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-none transition-all ${activeTab === 'dishes' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-gray-50 text-gray-500'}`}
            >
              <Utensils size={18} />
              <span className="text-sm">Конструктор блюд</span>
            </button>
            
            <button 
              onClick={() => handleTabChange('database')}
              className={`flex items-center gap-2 px-4 py-2 rounded-none transition-all ${activeTab === 'database' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-gray-50 text-gray-500'}`}
            >
              <DbIcon size={18} />
              <span className="text-sm">База продуктов</span>
            </button>
            
            <button 
              onClick={() => handleTabChange('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-none transition-all ${activeTab === 'settings' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-gray-50 text-gray-500'}`}
            >
              <SettingsIcon size={18} />
              <span className="text-sm">Настройки</span>
            </button>

            {userRole === 'admin' && (
              <button 
                onClick={() => handleTabChange('users')}
                className={`flex items-center gap-2 px-4 py-2 rounded-none transition-all relative ${activeTab === 'users' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-gray-50 text-gray-500'}`}
                title="Управление пользователями и заявками"
              >
                <UsersIcon size={18} />
                <span className="text-sm">Пользователи</span>
                {pendingCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-white animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {onShowLanding && (
            <button
              onClick={onShowLanding}
              className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Посмотреть промо-лендинг сервиса"
            >
              <Globe size={17} />
              <span className="hidden sm:inline">О сервисе</span>
            </button>
          )}

          <button 
            onClick={() => {
              loadPlans();
              loadProducts();
              loadDishes();
            }}
            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
            title="Обновить данные"
          >
            <RefreshCw size={18} />
          </button>

          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Выйти"
          >
            <LogOut size={18} />
          </button>
          
          {currentPlan && (
            <div className="flex items-center gap-3 bg-emerald-50 px-4 py-1.5 rounded-none border border-emerald-100">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Активный:</p>
              <p className="text-sm font-medium text-emerald-900">{currentPlan.clientName}</p>
            </div>
          )}
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && <Dashboard onSelectPlan={() => setActiveTab('planner')} />}
        {activeTab === 'planner' && <Planner />}
        {activeTab === 'database' && <Database />}
        {activeTab === 'dishes' && <DishConstructor />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'users' && <UsersManagement currentUsername={currentUsername} />}
      </main>
      <Notification />
    </div>
  );
}

export default function App() {
  const [sharedPlanId, setSharedPlanId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | string>('admin');
  const [currentUsername, setCurrentUsername] = useState<string>('admin');
  const [initialTab, setInitialTab] = useState<NavigationTab>('dashboard');
  const [guestView, setGuestView] = useState<'landing' | 'login' | 'register'>('landing');
  const [showLandingForAuthUser, setShowLandingForAuthUser] = useState<boolean>(false);

  const checkAuth = async () => {
    // Safety timeout to prevent eternal loading
    const timeout = setTimeout(() => {
      setIsAuthenticated(prev => prev === null ? false : prev);
    }, 3000);

    try {
      const response = await fetch(`/api/me?t=${Date.now()}`, { credentials: 'include' });
      if (!response.ok) {
        setIsAuthenticated(false);
        return;
      }
      const data = await response.json();
      setIsAuthenticated(!!data.authenticated);
      if (data.authenticated) {
        if (data.role) setUserRole(data.role);
        if (data.username) setCurrentUsername(data.username);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setIsAuthenticated(false);
    } finally {
      clearTimeout(timeout);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('shared');
    if (shared) {
      setSharedPlanId(shared);
    } else {
      checkAuth();
    }
  }, []);

  if (sharedPlanId) {
    return <PublicPlanView planId={sharedPlanId} />;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is authenticated but chose to preview the landing page
  if (isAuthenticated && showLandingForAuthUser) {
    return (
      <LandingPage
        isAuthenticated={true}
        onOpenAuth={() => setShowLandingForAuthUser(false)}
        onGoToApp={() => setShowLandingForAuthUser(false)}
      />
    );
  }

  // Guest view (landing or auth)
  if (!isAuthenticated) {
    if (guestView === 'landing') {
      return (
        <LandingPage
          isAuthenticated={false}
          onOpenAuth={(mode) => setGuestView(mode || 'login')}
          onGoToApp={() => setGuestView('login')}
        />
      );
    }

    return (
      <Login 
        initialMode={guestView}
        onBackToLanding={() => setGuestView('landing')}
        onLogin={(isDefault, role, uname) => {
          setInitialTab('dashboard');
          if (role) setUserRole(role);
          if (uname) setCurrentUsername(uname);
          setIsAuthenticated(true);
        }} 
      />
    );
  }

  return (
    <AppProvider>
      <MainContent 
        onLogout={() => {
          setIsAuthenticated(false);
          setGuestView('landing');
        }} 
        onShowLanding={() => setShowLandingForAuthUser(true)}
        initialTab={initialTab} 
        userRole={userRole}
        currentUsername={currentUsername}
      />
    </AppProvider>
  );
}
