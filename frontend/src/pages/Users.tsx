import { useEffect, useState } from "react"
import { getUsers } from "../api/api"

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    getUsers().then(setUsers)
  }, [])

  return (
    <div>
      <h1>Usuários</h1>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>{user.nome}</li>
        ))}
      </ul>
    </div>
  )
}