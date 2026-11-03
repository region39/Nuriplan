import React, { useState, useEffect } from 'react';
import { 
  Users, Check, X, KeyRound, Trash2, Search, RefreshCw, 
  Clock, ShieldCheck, ShieldAlert, UserCheck, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { UserAccount } from '../types';
import { useApp } from '../store';
import { apiFetch } from '../utils/apiFetch';

interface UsersManagementProps {
  currentUsername?: string;
}

export const UsersManagement: React.FC<UsersManagementProps> = ({ currentUsername = 'admin' }) => {
  const { showNotification } = useApp();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');

  // Password change modal state
  const [passwordModalUser, setPasswordModalUser] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/users', { credentials: 'include' });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setUsers([]);
        showNotification(data?.error || 'Не удалось загрузить пользователей', 'error');
        return;
      }
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setUsers([]);
      showNotification('Ошибка подключения при загрузке пользователей', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected' | 'pending') => {
    try {
      const res = await apiFetch(`/api/admin/users/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      const data = await res.json();

      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
        showNotification(
          status === 'approved' 
            ? 'Пользователь успешно одобрен!' 
            : status === 'rejected' 
            ? 'Заявка отклонена' 
            : 'Статус обновлен', 
          'success'
        );
      } else {
        showNotification(data.error || 'Ошибка обновления статуса', 'error');
      }
    } catch (err) {
      showNotification('Сетевая ошибка при изменении статуса', 'error');
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser) return;
    setModalError('');

    if (newPassword.length < 6) {
      setModalError('Пароль должен быть не менее 6 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalError('Пароли не совпадают');
      return;
    }

    setModalLoading(true);
    try {
      const res = await apiFetch(`/api/admin/users/${passwordModalUser.id}/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
        credentials: 'include'
      });
      const data = await res.json();

      if (res.ok) {
        showNotification(`Пароль для пользователя ${passwordModalUser.username} успешно обновлен!`, 'success');
        setPasswordModalUser(null);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setModalError(data.error || 'Ошибка смены пароля');
      }
    } catch (err) {
      setModalError('Сетевая ошибка при смене пароля');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async (id: number, username: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
      return;
    }

    try {
      const res = await apiFetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();

      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        showNotification(`Пользователь ${username} удален`, 'info');
      } else {
        showNotification(data.error || 'Не удалось удалить пользователя', 'error');
      }
    } catch (err) {
      showNotification('Сетевая ошибка при удалении', 'error');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const pendingCount = users.filter(u => u.status === 'pending').length;
  const approvedCount = users.filter(u => u.status === 'approved').length;
  const rejectedCount = users.filter(u => u.status === 'rejected').length;

  const filteredUsers = users.filter(u => {
    const matchFilter = filter === 'all' ? true : u.status === filter;
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
              <Users size={26} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">
                Заявки и пользователи
              </h2>
              <p className="text-gray-500 text-sm">
                Управление доступом, одобрение заявок на регистрацию и сброс паролей
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-black/10 hover:border-black/20 rounded-xl text-sm font-bold text-gray-700 shadow-sm transition-all"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Обновить список
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setFilter('all')}
          className={`cursor-pointer bg-white p-4 rounded-2xl border transition-all ${filter === 'all' ? 'border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm' : 'border-black/5 hover:border-black/10'}`}
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Все пользователи</span>
          <p className="text-2xl font-black text-gray-900">{users.length}</p>
        </div>

        <div 
          onClick={() => setFilter('pending')}
          className={`cursor-pointer bg-white p-4 rounded-2xl border transition-all relative overflow-hidden ${filter === 'pending' ? 'border-amber-500 ring-2 ring-amber-500/10 shadow-sm' : 'border-black/5 hover:border-black/10'}`}
        >
          {pendingCount > 0 && (
            <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          )}
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <Clock size={12} /> Ожидают одобрения
          </span>
          <p className="text-2xl font-black text-amber-600">{pendingCount}</p>
        </div>

        <div 
          onClick={() => setFilter('approved')}
          className={`cursor-pointer bg-white p-4 rounded-2xl border transition-all ${filter === 'approved' ? 'border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm' : 'border-black/5 hover:border-black/10'}`}
        >
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <UserCheck size={12} /> Одобрены
          </span>
          <p className="text-2xl font-black text-emerald-700">{approvedCount}</p>
        </div>

        <div 
          onClick={() => setFilter('rejected')}
          className={`cursor-pointer bg-white p-4 rounded-2xl border transition-all ${filter === 'rejected' ? 'border-red-500 ring-2 ring-red-500/10 shadow-sm' : 'border-black/5 hover:border-black/10'}`}
        >
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <ShieldAlert size={12} /> Отклонены
          </span>
          <p className="text-2xl font-black text-red-600">{rejectedCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'all' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Все ({users.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${filter === 'pending' ? 'bg-white shadow-xs text-amber-700 font-black' : 'text-gray-500 hover:text-gray-800'}`}
          >
            На рассмотрении
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'approved' ? 'bg-white shadow-xs text-emerald-700' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Одобренные ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'rejected' ? 'bg-white shadow-xs text-red-700' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Отклоненные ({rejectedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по логину..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Users Table / List */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
            <RefreshCw size={24} className="animate-spin text-emerald-600" />
            <span className="text-sm">Загрузка пользователей...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users size={36} className="mx-auto mb-2 opacity-30" />
            <p className="font-bold text-gray-600 text-sm">Пользователи не найдены</p>
            <p className="text-xs text-gray-400 mt-1">Попробуйте изменить параметры поиска или фильтра</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-black/5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Пользователь</th>
                  <th className="py-3 px-4">Роль</th>
                  <th className="py-3 px-4">Статус</th>
                  <th className="py-3 px-4">Дата регистрации</th>
                  <th className="py-3 px-5 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {filteredUsers.map((user) => {
                  const isCurrent = user.username.toLowerCase() === currentUsername.toLowerCase();
                  const isMainAdmin = user.username.toLowerCase() === 'admin';
                  const formattedDate = user.created_at
                    ? new Date(user.created_at).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '—';

                  return (
                    <tr 
                      key={user.id} 
                      className={`transition-colors ${user.status === 'pending' ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-gray-50/60'}`}
                    >
                      {/* Username */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                              : user.status === 'pending'
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}>
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{user.username}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-gray-200 text-gray-700 rounded">
                                  Вы
                                </span>
                              )}
                            </div>
                            {user.ip_address && (
                              <span className="text-[11px] text-gray-400 font-mono">
                                IP: {user.ip_address}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                            Администратор
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 bg-gray-100">
                            Пользователь
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {user.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <ShieldCheck size={14} className="text-emerald-600" /> Одобрен
                          </span>
                        ) : user.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200/60">
                            <ShieldAlert size={14} className="text-red-500" /> Отклонен
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                            <Clock size={14} className="text-amber-600" /> Ожидает одобрения
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-4 text-xs text-gray-500">
                        {formattedDate}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve Button */}
                          {user.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateStatus(user.id, 'approved')}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                              title="Одобрить заявку"
                            >
                              <Check size={14} />
                              Одобрить
                            </button>
                          )}

                          {/* Reject Button */}
                          {user.status !== 'rejected' && !isMainAdmin && (
                            <button
                              onClick={() => handleUpdateStatus(user.id, 'rejected')}
                              className="px-2.5 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                              title="Отклонить заявку"
                            >
                              <X size={14} />
                              Отклонить
                            </button>
                          )}

                          {/* Change Password Button */}
                          <button
                            onClick={() => {
                              setPasswordModalUser(user);
                              setNewPassword('');
                              setConfirmPassword('');
                              setModalError('');
                            }}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Сменить пароль"
                          >
                            <KeyRound size={16} />
                          </button>

                          {/* Delete Button (Not allowed for main admin) */}
                          {!isMainAdmin && (
                            <button
                              onClick={() => handleDeleteUser(user.id, user.username)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                confirmDeleteId === user.id
                                  ? 'bg-red-600 text-white font-bold text-[10px] px-2'
                                  : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                              }`}
                              title={confirmDeleteId === user.id ? 'Нажмите еще раз для удаления' : 'Удалить пользователя'}
                            >
                              {confirmDeleteId === user.id ? 'Удалить?' : <Trash2 size={16} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-black/10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-black/5 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <KeyRound size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Смена пароля</h3>
                  <p className="text-xs text-gray-500">
                    Пользователь: <span className="font-bold text-gray-800">{passwordModalUser.username}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPasswordModalUser(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-700 flex items-start gap-2 mb-4">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Новый пароль
                </label>
                <div className="relative">
                  <input
                    type={showModalPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Минимум 6 символов"
                    className="w-full bg-gray-50 border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalPassword(!showModalPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showModalPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Повторите новый пароль
                </label>
                <input
                  type={showModalPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повтор пароля"
                  className="w-full bg-gray-50 border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
                >
                  {modalLoading ? 'Сохранение...' : 'Сохранить пароль'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
