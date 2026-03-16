import { useState } from "react"
import "./UserItemsPage.css"

export default function UserItemsPage() {

  const [items] = useState([
    { id: 1, name: "Notebook Dell", price: "R$ 2500", description: "Notebook usado em bom estado" },
    { id: 2, name: "Teclado Mecânico", price: "R$ 350", description: "Teclado RGB com switches blue" },
    { id: 3, name: "Monitor 24''", price: "R$ 900", description: "Monitor Full HD 144hz" }
  ])

  const userName = "João Silva"

  return (
    <div className="user-items-page">

      <h1>Itens de {userName}</h1>

      <div className="items-list">

        {items.map((item) => (
          <div key={item.id} className="item-card">

            <h3>{item.name}</h3>

            <p className="item-description">
              {item.description}
            </p>

            <p className="item-price">
              {item.price}
            </p>

            <div className="item-actions">
              <button>Ver detalhes</button>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}