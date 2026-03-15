import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import logo from "../../assets/logo.png"

import registerImage from "../../assets/registerUserImage.png"
import "./RegisterUserPage.css"

export default function RegisterUserPage() {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")

  const navigate = useNavigate()

  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault()

    if (firstName && lastName && email && cpf) {
      console.log("Usuário registrado")

      // futuramente aqui entrará a chamada da API

      navigate("/login")
    }
  }

  return (
    <div className="register-page">

      <div className="register-image">
        <img src={registerImage} alt="Register" />
      </div>

      <div className="register-form-container">

        <form onSubmit={handleRegister} className="register-form">

          <img src={logo} alt="App logo" className="auth-logo" />

          <h2>Criar conta</h2>

          <input
            type="text"
            placeholder="Nome"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Sobrenome"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />

          <button type="submit">Cadastrar</button>

          <Link to="/login">
            <button type="button" className="login-button">
              Voltar para login
            </button>
          </Link>

        </form>

      </div>

    </div>
  )
}