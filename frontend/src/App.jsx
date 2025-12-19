import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GamePage from './pages/GamePage'

function App() {
  const [user, setUser] = useState(null)
  const [, setLastResult] = useState(null)
  const [authView, setAuthView] = useState('login') // 'login' | 'register'

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser)
  }

  const handleRegisterSuccess = (registeredUser) => {
    setUser(registeredUser)
  }

  const handleLogout = () => {
    setUser(null)
    setLastResult(null)
    setAuthView('login')
  }

  const handleGameFinished = (result) => {
    setLastResult(result)
    alert(
      `Mot : ${result.word}\nCatégorie : ${result.category}\nTemps : ${result.time}s\nTentatives : ${result.attempts}`,
    )
  }

  if (!user) {
    if (authView === 'register') {
      return (
        <RegisterPage
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setAuthView('login')}
        />
      )
    }

    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setAuthView('register')}
      />
    )
  }

  return (
    <GamePage
      user={user}
      onLogout={handleLogout}
      onGameFinished={handleGameFinished}
    />
  )
}

export default App
