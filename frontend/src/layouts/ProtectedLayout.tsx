import { Navigate, Outlet } from "react-router-dom"
import Navbar from "../components/Navbar/Navbar"

export default function ProtectedLayout() {

  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
    </>
  )
}