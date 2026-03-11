import "./Navbar.css";
import React, { useState } from "react";   // ✅ ADDED

const Navbar = ({ color }) => {

  const [open, setOpen] = useState(false);   // ✅ ADDED

  return (
    <nav className="navbar" style={{ color }}>
      <div className="nav-container">

        <div className="logo">
          DE2© <br /> K24
        </div>

        {/* ✅ HAMBURGER (mobile only) */}
        <div className="hamburger" onClick={() => setOpen(!open)}>
          ☰
        </div>

        <div className="contact">
          <p>AVAILABLE FOR FREELANCE</p>
          <p>DESIGNEMBRACED@GMAIL.COM</p>
          <p>+44 07749737297</p>
        </div>

        <div className="services">
          <p>WEB DESIGN UI UX</p>
          <p>BRANDING / TYPEFACE DESIGN</p>
          <p>MOTION DESIGN</p>
        </div>

        <div className="social">
          <p>SOCIAL:</p>
          <p>TW DR LI</p>
        </div>

        <div className="menu">
          <p>→ WRK</p>
          <p>ABT</p>
        </div>

      </div>

      {/* ✅ MOBILE DROPDOWN MENU */}
      {open && (
        <div className="mobile-menu">

          <div className="contact">
            <p>AVAILABLE FOR FREELANCE</p>
            <p>DESIGNEMBRACED@GMAIL.COM</p>
            <p>+44 07749737297</p>
          </div>

          <div className="services">
            <p>WEB DESIGN UI UX</p>
            <p>BRANDING / TYPEFACE DESIGN</p>
            <p>MOTION DESIGN</p>
          </div>

          <div className="social">
            <p>SOCIAL:</p>
            <p>TW DR LI</p>
          </div>

          <div className="menu">
            <p>→ WRK</p>
            <p>ABT</p>
          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;