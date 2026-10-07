import { ChatLayout } from './components/ChatLayout'
import { LoginForm } from './components/LoginForm'
import { AuthProvider, useAuth } from './context/AuthContext'

function Root() {
  const { creds } = useAuth()
  return creds ? <ChatLayout /> : <LoginForm />
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  )
}
