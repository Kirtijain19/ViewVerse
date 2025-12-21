import React from 'react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>About</h4>
          <a href="#about">About ViewVerse</a>
          <a href="#careers">Careers</a>
          <a href="#blog">Blog</a>
        </div>

        <div className="footer-section">
          <h4>Help & Support</h4>
          <a href="#help">Help Center</a>
          <a href="#safety">Safety</a>
          <a href="#contact">Contact Us</a>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <a href="#terms">Terms of Service</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#cookies">Cookie Policy</a>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <a href="#twitter">Twitter</a>
          <a href="#facebook">Facebook</a>
          <a href="#instagram">Instagram</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 ViewVerse. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;