import React from "react";
import "./Footer.css";

const Footer = ({ color }) => {
  return (
    <footer className="portfolio-footer" style={{ color }}>
      <div className="footer-left">
        <p>© DESIGN</p>
        <p>EMBRACED LTD</p>
      </div>

      <div className="footer-right">
        <p>C-NR. 07186749</p>
        <p>DEV. PEROZZI</p>
      </div>
    </footer>
  );
};

export default Footer;