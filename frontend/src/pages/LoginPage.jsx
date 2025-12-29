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

      const res = await fetch('http://localhost:4000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Erreur de connexion. Réessaie plus tard.')
        return
      }

      const user = data.data || { email }
      onLoginSuccess(user)
    } catch (err) {
      setError('Erreur réseau lors de la connexion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div>
        <div className="card shadow-sm">
          <div className="card-body">
            <h1 className="h4 text-center mb-4">Connexion</h1>

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
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>

              <p className="text-center text-muted mt-3 mb-0">
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  className="btn btn-link p-0 align-baseline"
                  onClick={onSwitchToRegister}
                  disabled={loading}
                >
                  Créer un compte
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
