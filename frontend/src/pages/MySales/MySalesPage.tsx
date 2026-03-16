import { useState } from "react"
import "./MySalesPage.css"

export default function MySalesPage() {

  const [sales] = useState([
    {
      id: 1,
      itemName: "Notebook Dell",
      price: "R$ 2500",
      buyer: "Maria Souza",
      date: "10/03/2026"
    },
    {
      id: 2,
      itemName: "Teclado Mecânico",
      price: "R$ 350",
      buyer: "Carlos Lima",
      date: "05/03/2026"
    },
    {
      id: 3,
      itemName: "Mouse Gamer",
      price: "R$ 150",
      buyer: "Ana Pereira",
      date: "01/03/2026"
    }
  ])

  return (
    <div className="my-sales-page">

      <h1>Minhas Vendas</h1>

      <div className="sales-list">

        {sales.map((sale) => (
          <div key={sale.id} className="sale-card">

            <h3>{sale.itemName}</h3>

            <p className="sale-price">
              {sale.price}
            </p>

            <p className="sale-buyer">
              Comprador: {sale.buyer}
            </p>

            <p className="sale-date">
              Data: {sale.date}
            </p>

            <div className="sale-actions">
              <button>Ver detalhes</button>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}