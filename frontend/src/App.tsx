import { BrowserRouter, Routes, Route } from "react-router-dom"

/* layouts */
import ProtectedLayout from "./layouts/ProtectedLayout"

/* auth pages */
import Login from "./pages/Login/Login"
import RegisterUserPage from "./pages/RegisterUserPage/RegisterUserPage"

/* main pages */
import MyItemsPage from "./pages/MyItems/MyItemsPage"
import UserItemsPage from "./pages/UserItems/UserItemsPage"
import MySalesPage from  "./pages/MySales/MySalesPage"
import PaymentMethodsPage from "./pages/PaymentMethods/PaymentMethodsPage"
import AccountSettingsPage from  "./pages/AccountSettings/AccountSettingsPage"

function App() {
  return (

      <Routes>

        {/* páginas públicas */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUserPage />} />

        {/* páginas protegidas */}

        <Route element={<ProtectedLayout />}>

          <Route path="/" element={<MyItemsPage />} />

          <Route path="/my-items" element={<MyItemsPage />} />

          <Route path="/users/:userId/items" element={<UserItemsPage />} />

          <Route path="/my-sales" element={<MySalesPage />} />

          <Route path="/payment-methods" element={<PaymentMethodsPage />} />

          <Route path="/account-settings" element={<AccountSettingsPage />} />

        </Route>

      </Routes>

  )
}

export default App