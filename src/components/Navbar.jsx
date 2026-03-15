import "./Navbar.css";
import React, { useState } from "react";

const Navbar = ({ color }) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar" style={{ color }}>

      <div className="nav-container">

        {/* Logo */}
        <div className="logo">
          <img src="/zig-logo.png" alt="logo" />
        </div>

        {/* Desktop Menu */}
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/">Artwork ▾</a>
          <a href="/">Artist ▾</a>
          <a href="/">About</a>
          <a href="/">Blog</a>
          <a href="/">Contest</a>
          <a href="/">Contact</a>
        </div>

        {/* Right Icons */}
        <div className="nav-icons">
          <span>🔍</span>
          <span>👤</span>
          <span>🛒</span>
        </div>

        {/* Hamburger (Mobile) */}
        <div className="hamburger" onClick={() => setOpen(!open)}>
          ☰
        </div>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="mobile-menu">
          <a href="/">Home</a>
          <a href="/">Artwork</a>
          <a href="/">Artist</a>
          <a href="/">About</a>
          <a href="/">Blog</a>
          <a href="/">Contest</a>
          <a href="/">Contact</a>
        </div>
      )}

    </nav>
  );
};

export default Navbar;