# MAX Chat (GREEN-API)

Веб-интерфейс на React для обмена текстовыми сообщениями через GREEN-API (мессенджер MAX).

## Запуск

```bash
npm install
npm run dev
```

Dev-сервер по умолчанию: `http://localhost:5173`.

## Сценарий

1. Авторизация: `idInstance` и `apiTokenInstance` из [личного кабинета GREEN-API](https://console.green-api.com/).
2. Для приёма через HTTP API у инстанса должен быть пустой `webhookUrl`; включены уведомления о входящих сообщениях.
3. Создание чата по номеру телефона (формат: `79991234567`).
4. Исходящие — `SendMessage`; входящие — long-polling (`ReceiveNotification`, `DeleteNotification`).

## Стек

- React, TypeScript, Vite
- Прокси `/api` → `https://api.green-api.com` (`vite.config.ts`)
- API: `SendMessage`, `ReceiveNotification`, `DeleteNotification`

Учётные данные хранятся в `sessionStorage` на время сессии вкладки.
