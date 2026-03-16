import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./PaymentMethodsPage.css"

export default function PaymentMethodsPage() {

  const navigate = useNavigate()

  const [paymentMethods] = useState([
    {
      id: 1,
      type: "Cartão de Crédito",
      description: "Visa final 1234"
    },
    {
      id: 2,
      type: "PIX",
      description: "paulo@email.com"
    },
    {
      id: 3,
      type: "Conta Bancária",
      description: "Banco do Brasil - Conta 000123"
    }
  ])

  return (
    <div className="payment-methods-page">

      <div className="payment-header">
        <h1>Métodos de Pagamento</h1>

        <button
          className="add-payment-button"
          onClick={() => navigate("/register-payment-method")}
        >
          Adicionar método
        </button>
      </div>

      <div className="payment-methods-list">

        {paymentMethods.map((method) => (
          <div key={method.id} className="payment-card">

            <h3>{method.type}</h3>

            <p>{method.description}</p>

            <div className="payment-actions">
              <button>Remover</button>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}