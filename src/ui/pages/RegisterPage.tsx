import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { authClient } from '../../logic/auth-client'

function RegisterPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    })

    if (error) {
      setError(error.message ?? 'Registration failed')
      return
    }

    navigate('/')
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleRegister}>
        <h1>Create Account</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

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

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  )
}

export default RegisterPage
