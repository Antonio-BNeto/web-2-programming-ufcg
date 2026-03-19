import { useEffect, useState } from "react"
import { itemService } from "../../services/itemService"

export default function MyItems() {
  const [items, setItems] = useState<any[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      const response = await itemService.getAll()
      setItems(response.items || response) // depende do formato
    } catch (err) {
      setError("Erro ao carregar itens")
    }
  }

  return (
    <div>
      <h2>Meus itens</h2>

      {error && <p>{error}</p>}

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - R$ {item.price}
          </li>
        ))}
      </ul>
    </div>
  )
}