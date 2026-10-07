import { useEffect, useRef } from 'react'
import type { Message } from '../api/types'

type Props = {
  messages: Message[]
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MessageList({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="message-list empty">
        <p>Напишите первое сообщение</p>
      </div>
    )
  }

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={
            msg.direction === 'out' ? 'bubble bubble-out' : 'bubble bubble-in'
          }
        >
          <p className="bubble-text">{msg.text}</p>
          <span className="bubble-time">{formatTime(msg.timestamp)}</span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
