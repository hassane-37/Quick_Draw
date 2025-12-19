import { useState } from 'react'

function LoginPage({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email et mot de passe sont obligatoires.')
      return
    }

    try {
      setLoading(true)

      // Pour l'instant, on ne contacte pas encore le backend.
      // On simule juste un login réussi après un petit délai.
      await new Promise((resolve) => setTimeout(resolve, 800))

      onLoginSuccess({ email })
    } catch (err) {
      setError("Erreur de connexion. Réessaie plus tard.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h1>Connexion</h1>
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
            <div>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@example.com"
          />
        </label>
        </div>

        <div>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
          />
        </label>
        </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
        <p className="muted">
          Pas encore de compte ?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToRegister}
            disabled={loading}
          >
            Créer un compte
          </button>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
