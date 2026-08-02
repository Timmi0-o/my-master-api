-- Read cursors for 1:1 appointment chats (Telegram-style)
ALTER TABLE "AppointmentChats"
  ADD COLUMN IF NOT EXISTS "client_last_read_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "master_last_read_at" TIMESTAMP(3);
