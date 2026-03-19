import { useEffect, useState } from "react"
import { itemService } from "../../services/itemService"
import type { ItemResponseDTO } from "../../types/item"

export default function MyItemsPage() {
  const [items, setItems] = useState<ItemResponseDTO[]>([])
  const [error, setError] = useState("")

  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("0")

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      const response = await itemService.getAll()
      setItems(response.items)
    } catch {
      setError("Erro ao carregar itens")
    }
  }

  const handleCreateItem = async () => {
    try {
      setLoading(true)
      setError("")

      await itemService.create({
        name,
        description,
        price: Number(price),
        quantity: Number(quantity),
      })

      setName("")
      setDescription("")
      setPrice("")
      setQuantity("0")
      setShowForm(false)

      await loadItems()
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao criar item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Meus itens</h2>

      {error && <p>{error}</p>}

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancelar" : "Novo Item"}
      </button>

      {showForm && (
        <div>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Quantidade"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <button onClick={handleCreateItem} disabled={loading}>
            {loading ? "Criando..." : "Criar"}
          </button>
        </div>
      )}

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - R$ {item.price} (Qtd: {item.quantity})
          </li>
        ))}
      </ul>
    </div>
  )
}