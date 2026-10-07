import { useState, type FormEvent, type KeyboardEvent } from 'react'

type Props = {
  disabled?: boolean
  error?: string
  onSend: (text: string) => Promise<void> | void
}

export function MessageInput({ disabled, error, onSend }: Props) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  async function submit() {
    const value = text.trim()
    if (!value || sending || disabled) return
    setSending(true)
    try {
      await onSend(value)
      setText('')
    } catch {
      // ошибка уже показана снаружи
    } finally {
      setSending(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void submit()
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void submit()
    }
  }

  return (
    <form className="message-input" onSubmit={onSubmit}>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="message-input-row">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Сообщение"
          rows={1}
          disabled={disabled || sending}
        />
        <button type="submit" disabled={disabled || sending || !text.trim()}>
          Отправить
        </button>
      </div>
    </form>
  )
}
