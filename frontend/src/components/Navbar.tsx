import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> | 
      <Link to="/users">Users</Link> | 
      <Link to="/items">Items</Link> | 
      <Link to="/sales">Sales</Link> | 
      <Link to="/payments">Payments</Link>
    </nav>
  )
}