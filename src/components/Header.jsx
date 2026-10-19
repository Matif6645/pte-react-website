import './Header.css';

function Header() {
  return (
    <header className="header_grid">
      <div className="header_container">

        <div className="logo">
          <h2>PTE Practice</h2>
        </div>

        <nav className="header_nav">
          <a href="/">Home</a>
          <a href="#practice">Practice</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header_buttons">
          <button className="login_btn">Login</button>
          <button className="signup_btn">Sign Up</button>
        </div>

        <button className="header_menu">Menu</button>

      </div>
    </header>
  );
}

export default Header;