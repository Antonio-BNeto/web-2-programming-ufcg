import { useEffect, useState } from "react"
import { paymentMethodService } from "../../services/paymentMethodService"

export default function PaymentMethods() {
  const [methods, setMethods] = useState<any[]>([])

  useEffect(() => {
    loadMethods()
  }, [])

  const loadMethods = async () => {
    try {
      const response = await paymentMethodService.getAll()

      setMethods(response.items)

    } catch {
      console.error("Erro ao carregar métodos")
    }
  }

  return (
    <div>
      <h2>Métodos de pagamento</h2>

      <ul>
        {methods.map((m) => (
          <li key={m.id}>
            {m.type} {m.main ? "(Principal)" : ""}
          </li>
        ))}
      </ul>
    </div>
  )
}