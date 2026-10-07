import { useCallback, useState } from 'react'
import { chatIdToPhone, sendMessage } from '../api/greenApi'
import type { Chat, Message } from '../api/types'
import { useAuth } from '../context/AuthContext'
import { useIncoming } from '../hooks/useIncoming'
import { ChatList } from './ChatList'
import { MessageInput } from './MessageInput'
import { MessageList } from './MessageList'
import { NewChatForm } from './NewChatForm'

export function ChatLayout() {
  const { creds, logout } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [sendError, setSendError] = useState('')

  const upsertChat = useCallback((chatId: string, title?: string) => {
    const phone = chatIdToPhone(chatId)
    setChats((prev) => {
      if (prev.some((c) => c.chatId === chatId)) {
        if (!title) return prev
        return prev.map((c) =>
          c.chatId === chatId && title ? { ...c, title } : c,
        )
      }
      return [
        ...prev,
        {
          chatId,
          phone,
          title: title || `+${phone}`,
        },
      ]
    })
  }, [])

  const onIncoming = useCallback(
    (msg: Message, meta?: { chatName?: string }) => {
      upsertChat(msg.chatId, meta?.chatName)
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    },
    [upsertChat],
  )

  useIncoming(creds, onIncoming)

  function startChat(chatId: string, _phone: string) {
    upsertChat(chatId)
    setActiveChatId(chatId)
    setSendError('')
  }

  async function handleSend(text: string) {
    if (!creds || !activeChatId) return
    setSendError('')
    try {
      const { idMessage } = await sendMessage(creds, activeChatId, text)
      setMessages((prev) => [
        ...prev,
        {
          id: idMessage,
          chatId: activeChatId,
          text,
          direction: 'out',
          timestamp: Date.now(),
        },
      ])
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Не удалось отправить')
    }
  }

  const activeMessages = messages.filter((m) => m.chatId === activeChatId)
  const activeChat = chats.find((c) => c.chatId === activeChatId)

  return (
    <div className="chat-app">
      <aside className="sidebar">
        <header className="sidebar-header">
          <span>Чаты</span>
          <button type="button" className="link-btn" onClick={logout}>
            Выйти
          </button>
        </header>
        <NewChatForm onStart={startChat} />
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelect={setActiveChatId}
        />
      </aside>

      <main className="chat-main">
        {activeChat ? (
          <>
            <header className="chat-header">
              <h2>{activeChat.title}</h2>
              <span>+{activeChat.phone}</span>
            </header>
            <MessageList messages={activeMessages} />
            <MessageInput error={sendError} onSend={handleSend} />
          </>
        ) : (
          <div className="chat-placeholder">
            <p>Выберите чат или начните новый по номеру телефона</p>
          </div>
        )}
      </main>
    </div>
  )
}
