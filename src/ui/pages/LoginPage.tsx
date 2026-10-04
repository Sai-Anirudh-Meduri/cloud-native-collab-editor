import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { authClient } from '../../logic/auth-client'

function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    const { error } = await authClient.signIn.email({
      email,
      password,
    })

    if (error) {
      setError(error.message ?? 'Login failed')
      return
    }

    navigate('/')
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleLogin}>
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">Login</button>

        <p>
          Need an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  )
}

export default LoginPage
