# NutriPlan+ (mfcstroy.ru) — двусторонняя связь формы обратной связи с Telegram

Дата: 2026-11-04
Репозиторий: `github.com/region39/Nuriplan`, ветка `main`, база — коммит `51f02b4` (`feat(auth): implement token-based authentication`).
Файлы изменены: `server.ts`, `src/components/FeedbackView.tsx`.
Приложены: `nutriplan-telegram-reply.patch` (git diff), полные `server.ts` и `FeedbackView.tsx` для сверки.

---

## 1. Зачем

Было: сообщение из формы обратной связи на сайте уходит в Telegram-канал/группу администратора (односторонне).
Не было: ответа администратора обратно на сайт. Администратор писал в Telegram — пользователь этого не видел.

Стало: администратор **отвечает реплаем (Reply) на сообщение-уведомление в Telegram** → ответ сохраняется в БД и отображается у пользователя на сайте в истории обращений.

## 2. Что именно изменено

### `server.ts`

1. **Миграция схемы** (после создания таблиц, рядом с миграцией `users`):
   в `feedback_messages` добавляются колонки (идемпотентно, `ALTER TABLE` только если колонки нет):
   - `telegram_message_id INTEGER` — `message_id` отправленного в Telegram уведомления (ключ связи),
   - `telegram_chat_id TEXT` — чат, куда ушло уведомление,
   - `admin_reply TEXT` — текст ответа администратора,
   - `replied_at TEXT` — ISO-время ответа.

2. **`sendTelegramNotification()`**: тип возврата расширен до `{ ok, error?, messageId? }`, в успешной ветке возвращается `messageId: data.result.message_id`. Нужно, чтобы связать сообщение в Telegram с записью в БД.

3. **`POST /api/feedback`**:
   - сохраняет `telegram_message_id` и `telegram_chat_id` в новую запись (INSERT расширен двумя колонками);
   - в текст уведомления добавлена подсказка: «↩️ Ответьте реплаем (Reply) на это сообщение — ответ появится у пользователя на сайте»;
   - ошибка отправки в Telegram теперь пишется в лог (`console.error("Failed to send feedback telegram alert:", ...)`).

4. **Polling `getUpdates`**: `allowed_updates` расширен до `["message", "callback_query", "channel_post"]`.
   Причина: **в канале сообщения администратора приходят как `channel_post`, а не `message`** — без этого текст из канала бот не получает вообще (нажатия кнопок приходят как `callback_query` и работали всегда).

5. **`handleTelegramBotCommandOrCallback()`**:
   - текст команды читается из `update.message || update.channel_post` (`adminMsg`);
   - новая ветка: если пришёл текст с `reply_to_message` и `reply_to_message.message_id` совпадает с `feedback_messages.telegram_message_id` (в том же `chat_id`), то `admin_reply` + `replied_at` пишутся в запись, а в чат уходит подтверждение «✅ Ответ сохранён и доставлен пользователю <username> на сайте»;
   - если реплай не относится к отзыву — управление идёт дальше, к обычным командам (`Помощь`, `Заявки`, `Подтвердить <логин>`, `Отклонить <логин>`).

6. Побочно (важно для диагностики): уведомления о регистрации и о новом клиенте логируются через `.then(r => { if (!r?.ok) console.error(...) })` — раньше `.catch()` не срабатывал на `{ok:false}`, и ошибки отправки терялись молча.

### `src/components/FeedbackView.tsx`

- интерфейс `FeedbackMessage` расширен: `telegram_message_id?`, `admin_reply?`, `replied_at?`;
- ответ администратора рендерится **отдельным сообщением с левой стороны ленты** (как реплика собеседника), а не мелким блоком внутри обращения пользователя — чтобы ответ не терялся визуально. Метка «Ответ администратора», время ответа, пометка «Ответ получен»;
- обращение и его ответ рендерятся одним `React.Fragment` (key на фрагменте).

## 3. Как применить

```bash
cd /opt/NutriPlanApp          # или любой рабочий каталог проекта
git fetch origin && git checkout main && git pull --ff-only
git apply --check /path/to/nutriplan-telegram-reply.patch   # проверка
git apply /path/to/nutriplan-telegram-reply.patch
npm run build                  # ОБЯЗАТЕЛЬНО: изменился фронт (src/)
# перезапуск сервиса, на VPS: systemctl restart nutriplan
```

Миграция БД выполняется автоматически при старте сервера — отдельный SQL-скрипт не нужен.

**Не забыть про `PORT`.** В репозитории в `server.ts` жёстко `const PORT = 3000;`. На VPS приложение слушает `3050` (см. `nutriplan.service` и nginx `mfcstroy-site.conf`, `proxy_pass http://127.0.0.1:3050`). В патче эта строка уже приведена к `const PORT = Number(process.env.PORT) || 3050;` — просьба сохранить её при мерже (в `.env` сервера `PORT=3050`).

## 4. Как проверить

1. Отправить сообщение из формы на сайте → в Telegram приходит уведомление с подсказкой про Reply, в БД:
   ```sql
   SELECT id, username, telegram_sent, telegram_message_id, telegram_chat_id, admin_reply FROM feedback_messages ORDER BY id DESC LIMIT 3;
   ```
   `telegram_message_id` должен быть не NULL.
2. В Telegram **ответить реплаем** на это сообщение (именно Reply на уведомление, не новое сообщение).
3. В БД у этой записи появляются `admin_reply` и `replied_at`; в чат приходит подтверждение; пользователь видит «Ответ администратора» в истории обращений на сайте.

## 5. Границы текущей реализации

- Работает ответ **только реплаем на уведомление**. Свободный текст в чате по-прежнему трактуется как команда.
- Ответ админа с самого сайта (кнопка «ответить» в журнале администратора) не реализован — можно добавить `POST /api/feedback/:id/reply` с отправкой в Telegram.
- Вложения (фото/документы) из Telegram не сохраняются — только текст.
- Пользователю не приходит уведомление о новом ответе (только визуально при открытии истории обращений).

## 6. Отладка

- Логи сервиса: `journalctl -u nutriplan -f`. Ключевые строки: `Telegram admin reply saved for feedback #N (username)`, `Failed to send ... telegram alert: <причина>`.
- Если ответ не сохраняется: проверить, что `allowed_updates` в polling содержит `channel_post` (канал!), что бот администратор чата, и что в `feedback_messages.telegram_message_id` не NULL (для отзывов, отправленных до патча, он NULL — старые сообщения ответами не обновятся).
