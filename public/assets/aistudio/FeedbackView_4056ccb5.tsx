import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, CheckCircle2, Clock, Sparkles, Phone, User, ShieldCheck, Info } from 'lucide-react';
import { apiFetch } from '../utils/apiFetch';

interface FeedbackMessage {
  id: number;
  user_id: number | null;
  username: string;
  topic: string;
  contact_info: string;
  message: string;
  telegram_sent: number;
  created_at: string;
  telegram_message_id?: number | null;
  admin_reply?: string | null;
  replied_at?: string | null;
}

interface FeedbackViewProps {
  userRole?: string;
  currentUsername?: string;
}

const TOPICS = [
  'Общий вопрос администратору',
  'Предложение по функционалу',
  'Технический вопрос / Ошибка',
  'Вопрос по рационам и базе продуктов',
  'Индивидуальный запрос',
];

export default function FeedbackView({ userRole = 'user', currentUsername = '' }: FeedbackViewProps) {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [telegramConfigured, setTelegramConfigured] = useState(false);
  const [contactNote, setContactNote] = useState('');
  const [loading, setLoading] = useState(true);

  const [topic, setTopic] = useState(TOPICS[0]);
  const [contactInfo, setContactInfo] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const fetchFeedback = async () => {
    try {
      const res = await apiFetch('/api/feedback', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setTelegramConfigured(Boolean(data.telegramConfigured));
        setContactNote(data.contactNote || '');
      }
    } catch (err) {
      console.error('Failed to fetch feedback messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || sending) return;

    setSending(true);
    setError(null);
    setSuccessBanner(null);

    try {
      const res = await apiFetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          topic,
          contactInfo: contactInfo.trim(),
          message: messageText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Не удалось отправить сообщение');
      } else {
        if (data.message) {
          setMessages(prev => [...prev, data.message]);
        }
        setMessageText('');
        if (data.telegramSent) {
          setSuccessBanner('Сообщение мгновенно доставлено в Telegram администратора!');
        } else {
          setSuccessBanner('Сообщение сохранено и передано администратору.');
        }
        setTimeout(() => setSuccessBanner(null), 5000);
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-emerald-600" />
            Обратная связь с администратором
          </h2>
          <p className="text-black/60 mt-1">
            Напишите ваш вопрос, предложение или заявку — сообщение напрямую пересылается в Telegram-чат администратора сервиса.
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-black/5 shadow-sm shrink-0">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              telegramConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="text-xs font-medium text-black/70">
            {telegramConfigured
              ? 'Прямая линия с Telegram админа активна'
              : 'Заявки сохраняются в журнале обращений'}
          </span>
        </div>
      </div>

      {contactNote && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-emerald-950">
          <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold">Информация от администратора: </span>
            <span>{contactNote}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: History / Chat stream */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-black/5 shadow-sm flex flex-col h-[540px]">
          <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-black">
                  {userRole === 'admin' ? 'Журнал всех обращений пользователей' : 'История ваших обращений'}
                </h3>
                <p className="text-xs text-black/50">
                  {userRole === 'admin'
                    ? 'Все сообщения, отправленные пользователями в ваш Telegram'
                    : `Вы вошли как ${currentUsername || 'пользователь'}`}
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-black/40 bg-black/[0.03] px-2.5 py-1 rounded-lg">
              Сообщений: {messages.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8F9FA]/60">
            {loading ? (
              <div className="h-full flex items-center justify-center text-sm text-black/40">
                Загрузка истории сообщений...
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Sparkles className="w-7 h-7" />
                </div>
                <p className="font-semibold text-black/80">Пока нет отправленных сообщений</p>
                <p className="text-xs text-black/50 mt-1 max-w-sm">
                  Заполните форму справа, чтобы отправить вопрос, пожелание или запрос напрямую в Telegram администратору.
                </p>
              </div>
            ) : (
              messages.map(msg => {
                const isOwn = msg.username.toLowerCase() === (currentUsername || '').toLowerCase();
                return (
                  <React.Fragment key={msg.id}>
                  <div
                    className={`flex flex-col ${
                      isOwn && userRole !== 'admin' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl p-4 border shadow-xs ${
                        isOwn && userRole !== 'admin'
                          ? 'bg-emerald-600 text-white border-emerald-600 rounded-br-none'
                          : 'bg-white text-black border-black/8 rounded-bl-none'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                            isOwn && userRole !== 'admin'
                              ? 'bg-white/15 text-white'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {msg.topic || 'Общий вопрос'}
                        </span>

                        {userRole === 'admin' && (
                          <span className="text-xs font-medium text-black/60 flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {msg.username}
                          </span>
                        )}
                      </div>

                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>

                      {msg.contact_info && (
                        <div
                          className={`mt-2.5 pt-2 border-t text-xs flex items-center gap-1.5 ${
                            isOwn && userRole !== 'admin'
                              ? 'border-white/15 text-emerald-100'
                              : 'border-black/5 text-black/60'
                          }`}
                        >
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>Контакт для ответа: {msg.contact_info}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 px-1 text-[11px] text-black/45">
                      <span>
                        {new Date(msg.created_at).toLocaleString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span>•</span>
                      {msg.telegram_sent ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Доставлено в Telegram
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-black/50">
                          <Clock className="w-3 h-3" />
                          Сохранено в журнале
                        </span>
                      )}
                    </div>
                  </div>

                  {msg.admin_reply && (
                    <div className="flex flex-col items-start">
                      <div className="max-w-[90%] rounded-2xl p-4 border shadow-xs bg-white text-black border-black/8 rounded-bl-none">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 inline-flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Ответ администратора
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.admin_reply}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 px-1 text-[11px] text-black/45">
                        {msg.replied_at && (
                          <>
                            <span>
                              {new Date(msg.replied_at).toLocaleString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Ответ получен
                        </span>
                      </div>
                    </div>
                  )}
                  </React.Fragment>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Right column: New message form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-black/5 shadow-sm p-6">
          <h3 className="text-lg font-bold text-black mb-1">Написать администратору</h3>
          <p className="text-xs text-black/50 mb-5">
            Ваше обращение сразу поступит в рабочий Telegram-чат администратора.
          </p>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-black/60 mb-1.5">
                Тема обращения
              </label>
              <select
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {TOPICS.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-black/60 mb-1.5">
                Ваш контакт для обратной связи (необязательно)
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={e => setContactInfo(e.target.value)}
                placeholder="@username в Telegram, телефон или e-mail"
                className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-black/60 mb-1.5">
                Текст сообщения
              </label>
              <textarea
                rows={5}
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Опишите ваш вопрос, пожелание или запрос..."
                required
                className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {error}
              </div>
            )}

            {successBanner && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successBanner}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={sending || !messageText.trim()}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Отправка в Telegram...' : 'Отправить сообщение администратору'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
