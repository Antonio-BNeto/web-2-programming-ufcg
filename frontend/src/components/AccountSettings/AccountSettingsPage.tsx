import { useEffect, useState } from "react"
import "./AccountSettingsPage.css"
import { userService } from "../../services/userService"

export default function AccountSettingsPage() {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [error, setError] = useState("")

  const getUserIdFromToken = (): number | null => {
    const token = localStorage.getItem("token")
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.id
    } catch (err) {
      console.error("Erro ao decodificar token:", err)
      return null
    }
  }

  useEffect(() => {
    const userId = getUserIdFromToken()

    if (!userId) {
      setError("Usuário não autenticado")
      return
    }

    loadUser(userId)
  }, [])

  const loadUser = async (userId: number) => {
    try {
      const user = await userService.getById(userId)

      const [first, ...rest] = user.name.split(" ")

      setFirstName(first || "")
      setLastName(rest.join(" ") || "")
      setEmail(user.email)
      setCpf(user.cpf)

    } catch (err) {
      console.error(err)
      setError("Erro ao carregar dados do usuário")
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    const userId = getUserIdFromToken()

    if (!userId) {
      setError("Usuário não autenticado")
      return
    }

    try {
      await userService.update(userId, {
        name: `${firstName} ${lastName}`,
        email,
        phoneNumber: "",
        password: ""
      })

      alert("Configurações salvas com sucesso!")

    } catch (err: any) {
      console.error(err)
      setError("Erro ao salvar alterações")
    }
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

        {error && <p className="error-message">{error}</p>}

      </form>

    </div>
  )
}