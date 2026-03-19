import { Routes, Route } from "react-router-dom"

import ProtectedLayout from "./layouts/ProtectedLayout"

import Login from "./pages/Login/Login"
import RegisterUserPage from "./pages/RegisterUserPage/RegisterUserPage"

import Home from "./pages/Home/Home"
import Dashboard from "./pages/Dashboard/Dashboard"

function App() {
  return (

      <Routes>


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUserPage />} />


        <Route element={<ProtectedLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/my-items" element={<Dashboard />} />
          <Route path="/my-sales" element={<Dashboard />} />
          <Route path="/payment-methods" element={<Dashboard />} />
          <Route path="/account-settings" element={<Dashboard />} />

        </Route>

      </Routes>

  )
}

export default App