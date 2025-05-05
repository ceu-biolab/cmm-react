import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/CMM-Logo-Teal.png";

const Header = () => {
  const navigate = useNavigate();

  const goToMainWeb = () => {
    navigate("/");
  };

  return (
    <header className="header">
      {/* Logo with Link to home (MainWeb) */}
      <Link to="/" className="logo" onClick={goToMainWeb}>
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
                <Link to="/batch-advanced-search">Batch Advanced Search</Link>
              </li>
              <li>
                <Link to="/rt-pred-search">RT Pred Search</Link>
              </li>
              <li>
                <Link to="/aspergillus-search">Aspergillus Search</Link>
              </li>
              <li>
                <Link to="/im-ms-search">IM-MS Search</Link>
              </li>
              <li>
                <Link to="/lc-im-ms-search">
                  LC-IM-MS Search
                </Link>
              </li>
              <li>
                <Link to="/browse-search">Browse Search</Link>
              </li>
              <li>
                <Link to="/ms-ms-search">MS/MS Search</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="dropdown">
          <button className="button">CE-MS Search</button>
          <div className="dropdown-content">
            <ul>
              <li>
                <Link to="/ce-ms-exp-rmt-search">CE-MS EXP RMT Search</Link>
              </li>
              <li>
                <Link to="/ce-ms-eff-mob-search">CE-MS EFF MOB Search</Link>
              </li>
              <li>
                <Link to="/ce-ms-mt-1-marker">CE-MS MT 1 Marker</Link>
              </li>
              <li>
                <Link to="/ce-ms-mt-2-markers">CE-MS MT 2 Markers</Link>
              </li>
              <li>
                <Link to="/ce-ms-rmt-1-marker">CE-MS RMT 1 Marker</Link>
              </li>
              <li>
                <Link to="/ce-ms-rmt-2-markers">CE-MS RMT 2 Markers</Link>
              </li>
              <li>
                <Link to="/targeted-ce-ms-exp-rmt-search">
                  Targeted CE-MS EXP RMT Search
                </Link>
              </li>
              <li>
                <Link to="/targeted-ce-ms-eff-mob-search">
                  Targeted CE-MS EFF MOB Search
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Link to="/pathway-displayer" className="button">
          Pathway Displayer
        </Link>

        {/* 
        <Link to="/spectral-quality" className="button">
          Spectral Quality
        </Link>
        */}

        <Link to="/manual" className="button">
          Manual
        </Link>
      </nav>

      <button className="button contact-button">Contact Us</button>
    </header>
  );
};

export default Header;
