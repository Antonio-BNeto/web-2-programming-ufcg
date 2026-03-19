import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import loginImage from "../../assets/loginImage.png"
import logo from "../../assets/logo.png"
import "./login.css"
import { Link } from "react-router-dom"
import { authService } from "../../services/authService"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const token = localStorage.getItem("token")

  const navigate = useNavigate()

  const handleLogin = async (event: React.FormEvent) => {
  event.preventDefault()
  setError("")

  try {
    const data = await authService.login({
      email,
      password,
    })

    const token = data.token

    localStorage.setItem("token", token)

    navigate("/")

  } catch (err: any) {
    console.error(err)

    if (err.response?.status === 401) {
      setError("Email ou senha inválidos")
    } else {
      setError("Erro ao fazer login")
    }
  }
}

  if (token) {
    return <Navigate to="/" />
  }

  return (
    <div className="login-page">

      <div className="login-image">
        <img src={loginImage} alt="Login" />
      </div>

      <div className="login-form-container">
        <form onSubmit={handleLogin} className="login-form">

          <img src={logo} alt="App logo" className="auth-logo" />

          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Entrar</button>

          {error && <p className="error-message">{error}</p>}

          <Link to="/register">
            <button type="button" className="register-button">
              Criar conta
            </button>
          </Link>

        </form>
        
      </div>

    </div>
  )
}