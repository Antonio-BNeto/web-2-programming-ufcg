import { useState } from "react"
import { useNavigate } from "react-router-dom"
import loginImage from "../../assets/loginImage.png"
import logo from "../../assets/logo.png"
import "./Login.css"
import { Link } from "react-router-dom"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault()

    if (email && password) {
      localStorage.setItem("token", "fake-token")
      navigate("/")
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