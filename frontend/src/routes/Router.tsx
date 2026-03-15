import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Users from "../pages/UserProfile"
import Items from "../pages/Items"
import Sales from "../pages/Sales"
import Payments from "../pages/Payments"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/items" element={<Items />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/payments" element={<Payments />} />
      </Routes>
    </BrowserRouter>
  )
}