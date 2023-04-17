import React, { useState } from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <header>
      <a href="/">
        <img src="http://localhost:3000/favicon.ico" alt="Logo" />
      </a>
      <div className="desktop-menu">
        <ul className="links">
          <li>
            <Link to="/">
              <span className="link-icon">🏠</span>Home
            </Link>
          </li>
          <li>
            <Link to="/movie">
              <span className="link-icon">🎬</span>Movies
            </Link>
          </li>
          <li>
            <Link to="/show">
              <span className="link-icon">📺</span>TV Shows
            </Link>
          </li>
          <li>
            <Link to="/actor">
              <span className="link-icon">🎭</span>Actors
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <span className="link-icon">⚙️</span>Settings
            </Link>
          </li>
          <li>
            <Link to="/">
              <span className="link-icon">🔍</span>Search
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="mobile-menu">
        <button className="hamburger-menu" onClick={handleMenuOpen}>
          <div className="hamburger-menu-line" />
          <div className="hamburger-menu-line" />
          <div className="hamburger-menu-line" />
        </button>
        <Menu right effect="reveal" isOpen={menuOpen} onClose={handleMenuClose}>
          <ul className="links">
            <li>
              <Link to="/">
                <span className="link-icon">🏠</span>Home
              </Link>
            </li>
            <li>
              <Link to="/movie">
                <span className="link-icon">🎬</span>Movies
              </Link>
            </li>
            <li>
              <Link to="/show">
                <span className="link-icon">📺</span>TV Shows
              </Link>
            </li>
            <li>
              <Link to="/actor">
                <span className="link-icon">🎭</span>Actors
              </Link>
            </li>
            <li>
              <Link to="/settings">
                <span className="link-icon">⚙️</span>Settings
              </Link>
            </li>
            <li>
              <Link to="/">
                <span className="link-icon">🔍</span>Search
              </Link>
            </li>
          </ul>
      </Menu>
      </div>
    </header>
  );
}

export default Header;
