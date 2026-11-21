import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Smart Rural Clinic
      </Link>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">
          Home
        </Link>

        <Link to="/about" className="navbar-link">
          About Us
        </Link>

        <Link to="/contact" className="navbar-link">
          Contact Us
        </Link>

        <Link to="/login" className="navbar-login">
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;