import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import logo from "../../assets/logo.png"

import registerImage from "../../assets/registerUserImage.png"
import "./RegisterUserPage.css"
import { api } from "../../api"

export default function RegisterUserPage() {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    try {
      await api.createUser({
        cpf,
        phoneNumber,
        name: `${firstName} ${lastName}`,
        email,
        password,
      })

      alert("Usuário cadastrado com sucesso!")
      navigate("/login")

    } catch (err: any) {
      console.error(err)

      let message = "Erro ao cadastrar usuário"

      if (err.response) {
        // resposta do backend (caso ideal)
        message =
          err.response.data?.message ||
          JSON.stringify(err.response.data)
      } else if (err.request) {
        // requisição feita mas sem resposta
        message = "Servidor não respondeu"
      } else {
        // erro inesperado
        message = err.message
      }

      setError(message)
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

          <input
            type="text"
            placeholder="Telefone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Cadastrar</button>

          {error && <p className="error-message">{error}</p>}

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