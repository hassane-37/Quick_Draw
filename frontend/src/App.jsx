import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
  return (
    <Routes>
      {/* Page de connexion */}
      <Route
        path="/login"
        element={
          !user ? (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setAuthView('register')}
            />
          ) : (
            <Navigate to="/game" replace />
          )
        }
      />

      {/* Page d'inscription */}
      <Route
        path="/register"
        element={
          !user ? (
            <RegisterPage
              onRegisterSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setAuthView('login')}
            />
          ) : (
            <Navigate to="/game" replace />
          )
        }
      />

      {/* Page de jeu (accessible même sans login pour l'instant) */}
      <Route
        path="/game"
        element={
          <GamePage
            user={user}
            onLogout={handleLogout}
            onGameFinished={handleGameFinished}
          />
        }
      />

      {/* Redirection par défaut vers /game */}
      <Route path="*" element={<Navigate to="/game" replace />} />
    </Routes>
  )
}

export default App
