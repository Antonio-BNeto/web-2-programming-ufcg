import { useEffect, useState } from "react"
import { itemService } from "../../services/itemService"
import "./home.css"

export default function Home() {

  const [items, setItems] = useState<any[]>([])
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)

      const response = await itemService.getAll()

      // suporta paginado ou array
      const data = response.items ?? response

      setItems(data)
      setFilteredItems(data)

    } catch (err) {
      console.error(err)
      setError("Erro ao carregar itens")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)

    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    )

    setFilteredItems(filtered)
  }

  return (
    <div className="home-page">

      <h1>Itens disponíveis</h1>

      {/* 🔍 Busca */}
      <input
        type="text"
        placeholder="Buscar item..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input"
      />

      {/* ⚠️ Estados */}
      {loading && <p>Carregando...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* 📦 Lista */}
      <div className="items-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <strong>R$ {item.price}</strong>
          </div>
        ))}
      </div>

    </div>
  )
}