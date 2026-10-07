import type {
  Credentials,
  ReceiveNotificationResponse,
  SendMessageResponse,
} from './types'

function base(creds: Credentials) {
  return `/api/v3/waInstance${creds.idInstance}`
}

export async function sendMessage(
  creds: Credentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> {
  const res = await fetch(
    `${base(creds)}/sendMessage/${creds.apiTokenInstance}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message }),
    },
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Ошибка отправки (${res.status})`)
  }

  return res.json()
}

export async function receiveNotification(
  creds: Credentials,
  signal?: AbortSignal,
  receiveTimeout = 20,
): Promise<ReceiveNotificationResponse> {
  const res = await fetch(
    `${base(creds)}/receiveNotification/${creds.apiTokenInstance}?receiveTimeout=${receiveTimeout}`,
    { signal },
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Ошибка получения (${res.status})`)
  }

  const text = await res.text()
  if (!text || text === 'null') return null
  return JSON.parse(text)
}

export async function deleteNotification(
  creds: Credentials,
  receiptId: number,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(
    `${base(creds)}/deleteNotification/${creds.apiTokenInstance}/${receiptId}`,
    { method: 'DELETE', signal },
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Ошибка удаления уведомления (${res.status})`)
  }
}

export function phoneToChatId(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return `${digits}@c.us`
}

export function chatIdToPhone(chatId: string): string {
  return chatId.replace('@c.us', '')
}
