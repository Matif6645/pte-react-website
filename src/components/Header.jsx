import "./Header.css";
import logo from "../assets/PTE logo.gif";

function Header() {
  return (
    <header className="header_grid">

      {/* Decorative waves */}
      <svg
        className="header_waves"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 35 C180 120 300 -10 500 55 S850 110 1050 55 S1300 30 1440 75"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.45"
        />

        <path
          d="M0 55 C200 130 360 10 550 70 S900 130 1100 65 S1340 45 1440 90"
          fill="none"
          stroke="white"
          strokeWidth="1"
          opacity="0.25"
        />
      </svg>

      <div className="header_container">

        {/* Logo */}
        <div className="logo">
          <a href="/">
            <img src={logo} alt="PTE Academy Logo" />
          </a>
        </div>

        {/* Navigation */}
        <nav className="header_nav">
          <a href="/">Home</a>
          <a href="#practice">Practice</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* Login and Signup */}
        <div className="header_buttons">
          <button className="login_btn">Login</button>
          <button className="signup_btn">Sign Up</button>
        </div>

        {/* Mobile Menu */}
        <button className="header_menu">Menu</button>

      </div>

    </header>
  );
}

export default Header;