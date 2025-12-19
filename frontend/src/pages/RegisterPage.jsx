import { useState } from 'react'

function RegisterPage({ onRegisterSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !username || !password || !confirmPassword) {
      setError('Tous les champs sont obligatoires.')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    try {
      setLoading(true)

      // TODO: remplacer par un appel à ton backend /api/auth/register
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (onRegisterSuccess) {
        onRegisterSuccess({ email, username })
      }
    } catch (err) {
      setError("Erreur lors de l'inscription. Réessaie plus tard.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h1>Inscription</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@example.com"
          />
        </label>

        <label>
          Nom d'utilisateur
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Votre pseudo"
          />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
          />
        </label>

        <label>
          Confirmer le mot de passe
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmez votre mot de passe"
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Inscription…" : "S'inscrire"}
        </button>
        <p className="muted">
          Déjà un compte ?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToLogin}
            disabled={loading}
          >
            Se connecter
          </button>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
