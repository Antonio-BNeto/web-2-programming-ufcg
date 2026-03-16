import { useState } from "react"
import "./AccountSettingsPage.css"

export default function AccountSettingsPage() {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const updatedUser = {
      firstName,
      lastName,
      email,
      cpf
    }

    console.log("Updated user data:", updatedUser)

    alert("Configurações salvas (simulação)")
  }

  return (
    <div className="account-settings-page">

      <h1>Configurar Conta</h1>

      <form className="account-settings-form" onSubmit={handleSubmit}>

        <label>Nome</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Digite seu nome"
        />

        <label>Sobrenome</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Digite seu sobrenome"
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
        />

        <label>CPF</label>
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="Digite seu CPF"
        />

        <button type="submit">
          Salvar alterações
        </button>

      </form>

    </div>
  )
}