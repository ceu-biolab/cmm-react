import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo-gray.png";

const Header = () => {
  const navigate = useNavigate();

  const goToMainWeb = () => {
    navigate("/");
  };

  return (
    <header>
      <section className="university-title-header">
        <a
          href="https://cembio.uspceu.es"
          target="_blank"
          rel="noopener noreferrer"
        >
          Center for Metabolomics and Bioanalysis{" "}
        </a>{" "}
        <span>|</span>{" "}
        <a
          href="https://www.uspceu.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Universidad CEU San Pablo
        </a>
      </section>
      <section className="header">
        {/* Logo with Link to home (MainWeb) */}
        <Link to="/" className="logo" onClick={goToMainWeb}>
          <img src={logo} alt="CMM Logo" />
        </Link>

        {/* Navigation Buttons */}
        <nav className="button-container">
          <div className="dropdown">
            <button className="button">MS Search</button>
            <div className="dropdown-content">
              <ul>
                <li>
                  <Link to="/simple-search">Simple Search</Link>
                </li>
                <li>
                  <Link to="/batch-search">Batch Search</Link>
                </li>
                <li>
                  <Link to="/browse-search">Browse Search</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="dropdown">
            <button className="button">LC-MS Search</button>
            <div className="dropdown-content">
              <ul>
                <li>
                  <Link to="/batch-advanced-search">Batch Advanced Search</Link>
                </li>
                <li>
                  <Link to="/lc-im-ms-search">LC-IM-MS Search</Link>
                </li>
                <li>
                  <Link to="/ms-ms-search">MS/MS Search</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="dropdown">
            <Link to="/gc-ms-search">
              <button className="button">GC-MS Search</button>
            </Link>
          </div>

          <div className="dropdown">
            <button className="button">CCS Search</button>
            <div className="dropdown-content">
              <ul>
                <li>
                  <Link to="/im-ms-search">IM-MS Search</Link>
                </li>
                <li>
                  <Link to="/lc-im-ms-search">LC-IM-MS Search</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="dropdown">
            <button className="button">CE-MS Search</button>
            <div className="dropdown-content">
              <ul>
                <li>
                  <Link to="/ce-ms-eff-mob-search">CE-MS EFF MOB Search</Link>
                </li>
                <li>
                  <Link to="/ce-ms-mt-1-marker">CE-MS MT 1 Marker</Link>
                </li>
                <li>
                  <Link to="/ce-ms-mt-2-markers">CE-MS MT 2 Markers</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 
          <Link to="/pathway-displayer" className="button">
            Pathway Displayer
          </Link>

          <Link to="/spectral-quality" className="button">
            Spectral Quality
          </Link>
          */}

          <Link to="/manual" className="button">
            Manual
          </Link>
        </nav>

        <button className="button contact-button">Contact Us</button>
      </section>
    </header>
  );
};

export default Header;
