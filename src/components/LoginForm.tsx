import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

export function LoginForm() {
  const { login } = useAuth()
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [error, setError] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const id = idInstance.trim()
    const token = apiTokenInstance.trim()
    if (!id || !token) {
      setError('Заполните оба поля')
      return
    }
    setError('')
    login({ idInstance: id, apiTokenInstance: token })
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={onSubmit}>
        <h1>GREEN-API</h1>
        <p className="login-hint">Введите данные инстанса из личного кабинета</p>

        <label>
          idInstance
          <input
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <label>
          apiTokenInstance
          <input
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit">Войти</button>
      </form>
    </div>
  )
}
