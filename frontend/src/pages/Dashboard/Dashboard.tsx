import { useLocation } from "react-router-dom"
import MyItems from "../../components/MyItems/MyItemsPage"
import MySales from "../../components/MySales/MySalesPage"
import PaymentMethods from "../../components/PaymentMethods/PaymentMethods"
import AccountSettings from "../../components/AccountSettings/AccountSettingsPage"

export default function Dashboard() {
  const location = useLocation()
  const path = location.pathname

  let tab = "items"

  if (path.includes("my-items")) tab = "items"
  else if (path.includes("my-sales")) tab = "sales"
  else if (path.includes("payment-methods")) tab = "payments"
  else if (path.includes("account-settings")) tab = "account"

  return (
    <div>
      {tab === "items" && <MyItems />}
      {tab === "sales" && <MySales />}
      {tab === "payments" && <PaymentMethods />}
      {tab === "account" && <AccountSettings />}
    </div>
  )
}