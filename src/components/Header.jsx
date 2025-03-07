import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/CMM-Logo-Teal.png"; // Corrected image import

const Header = () => {
  return (
    <header className="header">
      {/* Logo */}
      <Link to="/main-web" className="logo">
        <img src={logo} alt="CMM Logo" />
      </Link>

      {/* Navigation Buttons */}
      <nav className="button-container">
        <div className="dropdown">
          <button className="button">Search</button>
          <div className="dropdown-content">
            <ul>
              <li>
                <Link to="/simple-search">Simple Search</Link>
              </li>
              <li>
                <Link to="/batch-search">Batch Search</Link>
              </li>
              <li>
                <Link to="#">Batch Advanced Search</Link>
              </li>
              <li>
                <Link to="#">RT Pred Search</Link>
              </li>
              <li>
                <Link to="#">Aspergillus Search</Link>
              </li>
              <li>
                <Link to="#">IM-MS Search</Link>
              </li>
              <li>
                <Link to="#">LC-IM-MS Advanced Search</Link>
              </li>
              <li>
                <Link to="#">Browse Search</Link>
              </li>
              <li>
                <Link to="#">MS/MS Search</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="dropdown">
          <button className="button">CE-MS Search</button>
          <div className="dropdown-content">
            <ul>
              <li>
                <Link to="#">CE-MS EXP RMT Search</Link>
              </li>
              <li>
                <Link to="#">CE-MS EFF MOB Search</Link>
              </li>
              <li>
                <Link to="#">CE-MS MT 1 Marker</Link>
              </li>
              <li>
                <Link to="#">CE-MS MT 2 Markers</Link>
              </li>
              <li>
                <Link to="#">CE-MS RMT 1 Marker</Link>
              </li>
              <li>
                <Link to="#">CE-MS RMT 2 Markers</Link>
              </li>
              <li>
                <Link to="#">Targeted CE-MS EXP RMT Search</Link>
              </li>
              <li>
                <Link to="#">Targeted CE-MS EFF MOB Search</Link>
              </li>
            </ul>
          </div>
        </div>

        <button className="button">Pathway Displayer</button>

        <div className="dropdown">
          <button className="button">Oxidation</button>
          <div className="dropdown-content">
            <ul>
              <li>
                <Link to="#">Oxidation in Long FA Chain</Link>
              </li>
              <li>
                <Link to="#">Oxidation in Short FA Chain</Link>
              </li>
            </ul>
          </div>
        </div>

        <button className="button">Spectral Quality</button>
        <button className="button">Manual</button>
      </nav>

      <button className="button contact-button">Contact Us</button>
    </header>
  );
};

export default Header;
