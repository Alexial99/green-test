import type { Chat } from '../api/types'

type Props = {
  chats: Chat[]
  activeChatId: string | null
  onSelect: (chatId: string) => void
}

export function ChatList({ chats, activeChatId, onSelect }: Props) {
  if (chats.length === 0) {
    return <p className="chat-list-empty">Пока нет чатов</p>
  }

  return (
    <ul className="chat-list">
      {chats.map((chat) => (
        <li key={chat.chatId}>
          <button
            type="button"
            className={
              chat.chatId === activeChatId ? 'chat-item active' : 'chat-item'
            }
            onClick={() => onSelect(chat.chatId)}
          >
            <span className="chat-item-title">{chat.title}</span>
            <span className="chat-item-phone">+{chat.phone}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
