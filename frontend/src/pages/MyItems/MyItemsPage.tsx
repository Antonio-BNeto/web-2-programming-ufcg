import { useState } from "react"
import "./MyItemsPage.css"

export default function MyItemsPage() {

  const [items] = useState([
    { id: 1, name: "Notebook Dell", price: "R$ 2500", status: "Ativo" },
    { id: 2, name: "Teclado Mecânico", price: "R$ 350", status: "Vendido" },
    { id: 3, name: "Monitor 24''", price: "R$ 900", status: "Ativo" }
  ])

  return (
    <div className="my-items-page">

      <h1>Meus Itens</h1>

      <div className="items-list">

        {items.map((item) => (
          <div key={item.id} className="item-card">

            <h3>{item.name}</h3>

            <p className="item-price">{item.price}</p>

            <p className="item-status">
              Status: {item.status}
            </p>

            <div className="item-actions">
              <button>Editar</button>
              <button>Remover</button>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}