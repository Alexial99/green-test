import { useEffect, useRef } from 'react'
import { deleteNotification, receiveNotification } from '../api/greenApi'
import type { Credentials, Message } from '../api/types'

type IncomingMeta = {
  chatName?: string
}

function extractText(body: {
  messageData?: {
    typeMessage: string
    textMessageData?: { textMessage: string }
    extendedTextMessageData?: { text: string }
  }
}): string | null {
  const data = body.messageData
  if (!data) return null
  if (data.typeMessage === 'textMessage' && data.textMessageData?.textMessage) {
    return data.textMessageData.textMessage
  }
  if (
    data.typeMessage === 'extendedTextMessage' &&
    data.extendedTextMessageData?.text
  ) {
    return data.extendedTextMessageData.text
  }
  return null
}

export function useIncoming(
  creds: Credentials | null,
  onMessage: (msg: Message, meta?: IncomingMeta) => void,
) {
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  useEffect(() => {
    if (!creds) return

    const ac = new AbortController()
    let alive = true

    async function loop() {
      while (alive) {
        try {
          const note = await receiveNotification(creds!, ac.signal)
          if (!alive) break
          if (!note) continue

          try {
            if (note.body.typeWebhook === 'incomingMessageReceived') {
              const text = extractText(note.body)
              const chatId = note.body.senderData?.chatId
              if (text && chatId) {
                onMessageRef.current(
                  {
                    id: note.body.idMessage,
                    chatId,
                    text,
                    direction: 'in',
                    timestamp: (note.body.timestamp || Date.now() / 1000) * 1000,
                  },
                  { chatName: note.body.senderData?.chatName },
                )
              }
            }
          } finally {
            if (alive) {
              await deleteNotification(creds!, note.receiptId, ac.signal)
            }
          }
        } catch {
          if (!alive || ac.signal.aborted) break
          await new Promise((r) => setTimeout(r, 2000))
        }
      }
    }

    void loop()

    return () => {
      alive = false
      ac.abort()
    }
  }, [creds])
}
