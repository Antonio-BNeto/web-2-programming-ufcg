import { useEffect, useState } from "react"
import { saleService } from "../../services/saleService"

export default function MySales() {
  const [sales, setSales] = useState<any[]>([])

  useEffect(() => {
    loadSales()
  }, [])

  const loadSales = async () => {
    try {
      const response = await saleService.getAll()
      setSales(response.items || response)
    } catch {
      console.error("Erro ao carregar vendas")
    }
  }

  return (
    <div>
      <h2>Minhas vendas</h2>

      <ul>
        {sales.map((sale) => (
          <li key={sale.id}>
            {sale.description} - R$ {sale.valueTotal}
          </li>
        ))}
      </ul>
    </div>
  )
}