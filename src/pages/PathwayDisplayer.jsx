import React from "react";
import pathwayIcon from "../assets/svgs/molecule-molecular-svgrepo-com.svg";

const PathwayDisplayer = () => {
  return (
    <div className="page">
      <header className="title-header">
        <img src={pathwayIcon} alt="Pathway Icon" className="icon" />
        <span className="title-text">Pathway Displayer</span>
      </header>

      <div className="page outer-container">
        <h2>File Upload</h2>
      </div>
    </div>
  );
};

export default PathwayDisplayer;
