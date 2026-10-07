import { useState, type FormEvent } from 'react'
import { phoneToChatId } from '../api/greenApi'

type Props = {
  onStart: (chatId: string, phone: string) => void
}

export function NewChatForm({ onStart }: Props) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) {
      setError('Введите номер целиком')
      return
    }
    setError('')
    setPhone('')
    onStart(phoneToChatId(digits), digits)
  }

  return (
    <form className="new-chat" onSubmit={onSubmit}>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Номер телефона"
        inputMode="tel"
      />
      <button type="submit">Чат</button>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  )
}
