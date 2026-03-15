import "./Navbar.css"
import { Link } from "react-router-dom"
import logo from "../../assets/logo.png"
import profilePicture from "../../assets/profilePicture.png"

function Navbar() {
  return (
    <nav>
      <div className="nav-left">
        <Link to="/">
          <img src={logo} alt="Home" className="navbar-logo" />
        </Link>
      </div>

      <div className="nav-right">
        <Link to="/my-items">Meus itens</Link>
        <Link to="/my-sales">Minhas vendas</Link>
        <Link to="/payment-methods">Métodos de pagamento</Link>
        <Link to="/account-settings">Configurar conta</Link>

        <img src={profilePicture} alt="Profile" className="navbar-profile" />
      </div>
    </nav>
  )
}

export default Navbar