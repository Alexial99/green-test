export type Credentials = {
  idInstance: string
  apiTokenInstance: string
}

export type Message = {
  id: string
  chatId: string
  text: string
  direction: 'out' | 'in'
  timestamp: number
}

export type Chat = {
  chatId: string
  phone: string
  title: string
}

export type SendMessageResponse = {
  idMessage: string
}

export type NotificationBody = {
  typeWebhook: string
  timestamp: number
  idMessage: string
  senderData?: {
    chatId: string
    chatName?: string
    sender?: string
    senderName?: string
    senderPhoneNumber?: number
  }
  messageData?: {
    typeMessage: string
    textMessageData?: {
      textMessage: string
    }
    extendedTextMessageData?: {
      text: string
    }
  }
}

export type ReceiveNotificationResponse = {
  receiptId: number
  body: NotificationBody
} | null
