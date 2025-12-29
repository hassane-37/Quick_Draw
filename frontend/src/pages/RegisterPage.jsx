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

      const res = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Erreur lors de l'inscription. Réessaie plus tard.")
        return
      }

      if (onRegisterSuccess) {
        onRegisterSuccess({ email, username })
      }
    } catch (err) {
      setError("Erreur réseau lors de l'inscription.")
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="container d-flex justify-content-center align-items-center vh-100">
    <div>
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="h4 text-center mb-4">Inscription</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
              Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@example.com"
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="username" className="form-label">
              Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre pseudo"
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
              Mot de passe
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
              Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez votre mot de passe"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-warning"
              disabled={loading}
            >
              {loading ? "Inscription…" : "S'inscrire"}
            </button>

            <p className="text-center text-muted mt-3 mb-0">
              Déjà un compte ?{' '}
              <button
                type="button"
                className="btn btn-warning"
                onClick={onSwitchToLogin}
                disabled={loading}
              >
              Se connecter
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
)
}

export default RegisterPage
