import React from "react";
import pathwayIcon from "../assets/svgs/spectra.svg";

const SpectralQuality = () => {
  return (
    <div className="page">
      <header className="title-header">
        <img src={pathwayIcon} alt="Pathway Icon" className="icon" />
        <span className="title-text">Spectral Quality</span>
      </header>

      <div className="page outer-container">
        <h2>Quality form</h2>
      </div>
    </div>
  );
};

export default SpectralQuality;
