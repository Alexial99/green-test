import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Credentials } from '../api/types'

const STORAGE_KEY = 'green-api-creds'

type AuthContextValue = {
  creds: Credentials | null
  login: (creds: Credentials) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStored(): Credentials | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Credentials
    if (!parsed.idInstance || !parsed.apiTokenInstance) return null
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [creds, setCreds] = useState<Credentials | null>(() => readStored())

  const value: AuthContextValue = {
    creds,
    login: (next) => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setCreds(next)
    },
    logout: () => {
      sessionStorage.removeItem(STORAGE_KEY)
      setCreds(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth вне AuthProvider')
  return ctx
}
