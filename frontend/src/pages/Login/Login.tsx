import { useState } from "react"
import { useNavigate } from "react-router-dom"
import loginImage from "../../assets/loginImage.png"
import logo from "../../assets/logo.png"
import "./Login.css"
import { Link } from "react-router-dom"
import { api } from "../../api"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    try {
      const response = await api.login({
        email,
        password,
      })

      const token = response.data.token

      // salva token real
      localStorage.setItem("token", token)

      // redireciona após login
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