import React from "react";

const Header = () => {
  return (
    <header className="header">
      {/* Logo */}
      <a href="/main-web" className="logo">
        <img src="src/assets/images/CMM-Logo-Teal.png" alt="CMM Logo" />
      </a>

      {/* Navigation Buttons */}
      <nav className="button-container">
        <div className="dropdown">
          <button className="button">Search</button>
          <div className="dropdown-content">
            <ul>
              <li><a href="/simple-search">Simple Search</a></li>
              <li><a href="/batch-search">Batch Search</a></li>
              <li><a href="#">Batch Advanced Search</a></li>
              <li><a href="#">RT Pred Search</a></li>
              <li><a href="#">Aspergillus Search</a></li>
              <li><a href="#">IM-MS Search</a></li>
              <li><a href="#">LC-IM-MS Advanced Search</a></li>
              <li><a href="#">Browse Search</a></li>
              <li><a href="#">MS/MS Search</a></li>
            </ul>
          </div>
        </div>

        <div className="dropdown">
          <button className="button">CE-MS Search</button>
          <div className="dropdown-content">
            <ul>
              <li><a href="#">CE-MS EXP RMT Search</a></li>
              <li><a href="#">CE-MS EFF MOB Search</a></li>
              <li><a href="#">CE-MS MT 1 Marker</a></li>
              <li><a href="#">CE-MS MT 2 Markers</a></li>
              <li><a href="#">CE-MS RMT 1 Marker</a></li>
              <li><a href="#">CE-MS RMT 2 Markers</a></li>
              <li><a href="#">Targeted CE-MS EXP RMT Search</a></li>
              <li><a href="#">Targeted CE-MS EFF MOB Search</a></li>
            </ul>
          </div>
        </div>

        <button className="button">Pathway Displayer</button>

        <div className="dropdown">
          <button className="button">Oxidation</button>
          <div className="dropdown-content">
            <ul>
              <li><a href="#">Oxidation in Long FA Chain</a></li>
              <li><a href="#">Oxidation in Short FA Chain</a></li>
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