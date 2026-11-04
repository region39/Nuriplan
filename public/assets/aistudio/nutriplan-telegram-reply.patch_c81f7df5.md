diff --git a/server.ts b/server.ts
index 2d37044..0dd47ce 100644
--- a/server.ts
+++ b/server.ts
@@ -209,6 +209,18 @@ db.exec(`
   );
 `);
 
+// Migration: feedback <-> Telegram reply tracking (answers from Telegram back to the site)
+try {
+  const fbCols = db.prepare("PRAGMA table_info(feedback_messages)").all() as any[];
+  const fbNames = fbCols.map((c: any) => c.name);
+  if (!fbNames.includes("telegram_message_id")) db.exec("ALTER TABLE feedback_messages ADD COLUMN telegram_message_id INTEGER");
+  if (!fbNames.includes("telegram_chat_id")) db.exec("ALTER TABLE feedback_messages ADD COLUMN telegram_chat_id TEXT");
+  if (!fbNames.includes("admin_reply")) db.exec("ALTER TABLE feedback_messages ADD COLUMN admin_reply TEXT");
+  if (!fbNames.includes("replied_at")) db.exec("ALTER TABLE feedback_messages ADD COLUMN replied_at TEXT");
+} catch (e) {
+  console.error("feedback_messages migration error:", e);
+}
+
 // Migration for existing users table columns
 try {
   const userTableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
@@ -277,7 +289,7 @@ async function sendTelegramNotification(
   overrideBotToken?: string,
   overrideChatId?: string,
   replyMarkup?: any
-): Promise<{ ok: boolean; error?: string }> {
+): Promise<{ ok: boolean; error?: string; messageId?: number }> {
   const botToken = (overrideBotToken ?? getSettingValue("telegram_bot_token")).trim();
   const chatId = (overrideChatId ?? getSettingValue("telegram_chat_id")).trim();
 
@@ -304,7 +316,7 @@ async function sendTelegramNotification(
     if (!response.ok || !data.ok) {
       return { ok: false, error: data?.description || `Ошибка Telegram API (${response.status})` };
     }
-    return { ok: true };
+    return { ok: true, messageId: data?.result?.message_id };
   } catch (err: any) {
     console.error("Telegram notification error:", err);
     return { ok: false, error: err?.message || "Не удалось подключиться к Telegram API" };
@@ -414,15 +426,40 @@ async function handleTelegramBotCommandOrCallback(botToken: string, configuredCh
   }
 
   // 2. Handle Text Commands from Admin Chat
-  if (update.message && typeof update.message.text === "string") {
-    const incomingChatId = String(update.message.chat?.id || "");
+  const adminMsg = update.message || update.channel_post;
+  if (adminMsg && typeof adminMsg.text === "string") {
+    const incomingChatId = String(adminMsg.chat?.id || "");
     if (!configuredChatId || incomingChatId !== configuredChatId) {
       return;
     }
 
-    const rawText = update.message.text.trim();
+    const rawText = adminMsg.text.trim();
     const lowerText = rawText.toLowerCase();
 
+    // Admin replied (in Telegram) to a feedback notification -> store the answer for the site
+    const repliedTo = (adminMsg as any).reply_to_message;
+    if (repliedTo && typeof repliedTo.message_id === "number") {
+      const feedbackTarget = db.prepare(
+        "SELECT id, username FROM feedback_messages WHERE telegram_message_id = ? ORDER BY id DESC LIMIT 1"
+      ).get(repliedTo.message_id) as any;
+
+      if (feedbackTarget) {
+        const replyText = rawText;
+        db.prepare("UPDATE feedback_messages SET admin_reply = ?, replied_at = ? WHERE id = ?").run(
+          replyText,
+          new Date().toISOString(),
+          feedbackTarget.id
+        );
+        console.log(`Telegram admin reply saved for feedback #${feedbackTarget.id} (${feedbackTarget.username})`);
+        await sendTelegramNotification(
+          `✅ Ответ сохранён и доставлен пользователю <b>${escapeTelegramHtml(feedbackTarget.username)}</b> на сайте.\n💬 <i>${escapeTelegramHtml(replyText.slice(0, 200))}</i>`,
+          botToken,
+          configuredChatId
+        );
+        return;
+      }
+    }
+
     // Command: list pending users ("Заявки", "/pending", "/users")
     if (lowerText === "заявки" || lowerText === "/pending" || lowerText === "/users") {
       const pendingUsers = db.prepare(`
@@ -551,7 +588,7 @@ function startTelegramBotPoller() {
         telegramUpdateOffset = 0;
       }
 
-      const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${telegramUpdateOffset}&timeout=0&allowed_updates=${encodeURIComponent(JSON.stringify(["message", "callback_query"]))}`;
+      const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${telegramUpdateOffset}&timeout=0&allowed_updates=${encodeURIComponent(JSON.stringify(["message", "callback_query", "channel_post"]))}`;
       const res = await fetch(url);
       if (!res.ok) return;
 
@@ -960,7 +997,7 @@ seedDatabase(db);
 
 async function startServer() {
   const app = express();
-  const PORT = 3000;
+  const PORT = Number(process.env.PORT) || 3050;
 
   app.use(express.json({ limit: '10mb' }));
   app.use(cookieParser());
@@ -1137,7 +1174,7 @@ async function startServer() {
             ]
           ]
         };
-        sendTelegramNotification(msg, undefined, undefined, replyMarkup).catch(e => console.error("Failed to send registration telegram alert:", e));
+        sendTelegramNotification(msg, undefined, undefined, replyMarkup).then((r: any) => { if (!r?.ok) console.error("Failed to send registration telegram alert:", r?.error); }).catch(e => console.error("Failed to send registration telegram alert:", e));
       }
 
       return res.json({
@@ -1735,7 +1772,7 @@ async function startServer() {
           startDate && endDate ? `📅 Период: ${escapeTelegramHtml(startDate)} — ${escapeTelegramHtml(endDate)}` : null,
           `👨‍🍳 Создал: <code>${escapeTelegramHtml(creatorName)}</code>`
         ].filter(Boolean).join("\n");
-        sendTelegramNotification(msg).catch(e => console.error("Failed to send new client telegram alert:", e));
+        sendTelegramNotification(msg).then((r: any) => { if (!r?.ok) console.error("Failed to send new client telegram alert:", r?.error); }).catch(e => console.error("Failed to send new client telegram alert:", e));
       }
 
       res.json({ success: true });
@@ -1908,6 +1945,8 @@ async function startServer() {
     const now = new Date().toISOString();
     let telegramSent = 0;
     let telegramError: string | undefined;
+    let telegramMessageId: number | null = null;
+    let telegramChatIdUsed: string | null = null;
 
     if (isTelegramNotifyEnabled("telegram_notify_feedback", true)) {
       const telegramText = [
@@ -1918,20 +1957,25 @@ async function startServer() {
         ``,
         `📝 <b>Сообщение:</b>`,
         escapeTelegramHtml(messageText),
+        ``,
+        `↩️ <i>Ответьте реплаем (Reply) на это сообщение — ответ появится у пользователя на сайте.</i>`,
       ].filter(v => v !== null).join("\n");
 
       const tgResult = await sendTelegramNotification(telegramText);
       if (tgResult.ok) {
         telegramSent = 1;
+        telegramMessageId = tgResult.messageId ?? null;
+        telegramChatIdUsed = getSettingValue("telegram_chat_id", "").trim() || null;
       } else {
         telegramError = tgResult.error;
+        console.error("Failed to send feedback telegram alert:", tgResult.error);
       }
     }
 
     const insertResult = db.prepare(`
-      INSERT INTO feedback_messages (user_id, username, topic, contact_info, message, telegram_sent, created_at)
-      VALUES (?, ?, ?, ?, ?, ?, ?)
-    `).run(currentUserId, currentUsername, topic, contactInfo, messageText, telegramSent, now);
+      INSERT INTO feedback_messages (user_id, username, topic, contact_info, message, telegram_sent, created_at, telegram_message_id, telegram_chat_id)
+      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
+    `).run(currentUserId, currentUsername, topic, contactInfo, messageText, telegramSent, now, telegramMessageId, telegramChatIdUsed);
 
     const createdMessage = db.prepare("SELECT * FROM feedback_messages WHERE id = ?").get(insertResult.lastInsertRowid);
 
diff --git a/src/components/FeedbackView.tsx b/src/components/FeedbackView.tsx
index 161e6d7..0087bf3 100644
--- a/src/components/FeedbackView.tsx
+++ b/src/components/FeedbackView.tsx
@@ -11,6 +11,9 @@ interface FeedbackMessage {
   message: string;
   telegram_sent: number;
   created_at: string;
+  telegram_message_id?: number | null;
+  admin_reply?: string | null;
+  replied_at?: string | null;
 }
 
 interface FeedbackViewProps {
@@ -187,8 +190,8 @@ export default function FeedbackView({ userRole = 'user', currentUsername = '' }
               messages.map(msg => {
                 const isOwn = msg.username.toLowerCase() === (currentUsername || '').toLowerCase();
                 return (
+                  <React.Fragment key={msg.id}>
                   <div
-                    key={msg.id}
                     className={`flex flex-col ${
                       isOwn && userRole !== 'admin' ? 'items-end' : 'items-start'
                     }`}
@@ -259,6 +262,41 @@ export default function FeedbackView({ userRole = 'user', currentUsername = '' }
                       )}
                     </div>
                   </div>
+
+                  {msg.admin_reply && (
+                    <div className="flex flex-col items-start">
+                      <div className="max-w-[90%] rounded-2xl p-4 border shadow-xs bg-white text-black border-black/8 rounded-bl-none">
+                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
+                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 inline-flex items-center gap-1">
+                            <ShieldCheck className="w-3.5 h-3.5" />
+                            Ответ администратора
+                          </span>
+                        </div>
+                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.admin_reply}</p>
+                      </div>
+                      <div className="flex items-center gap-2 mt-1.5 px-1 text-[11px] text-black/45">
+                        {msg.replied_at && (
+                          <>
+                            <span>
+                              {new Date(msg.replied_at).toLocaleString('ru-RU', {
+                                day: '2-digit',
+                                month: '2-digit',
+                                year: 'numeric',
+                                hour: '2-digit',
+                                minute: '2-digit',
+                              })}
+                            </span>
+                            <span>•</span>
+                          </>
+                        )}
+                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
+                          <CheckCircle2 className="w-3 h-3" />
+                          Ответ получен
+                        </span>
+                      </div>
+                    </div>
+                  )}
+                  </React.Fragment>
                 );
               })
             )}
