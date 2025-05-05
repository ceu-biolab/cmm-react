import React from "react";
import manualIcon from "../assets/svgs/manual.svg";
import ManualPDF from "../components/manual/ManualPDF";

const Manual = () => {
  return (
    <div className="page">
      <header className="title-header">
        <img src={manualIcon} alt="Pathway Icon" className="icon" />
        <span className="title-text">Manual</span>
      </header>

      <div className="page outer-container">
        <h2>Manual</h2>
        <ManualPDF />
      </div>
    </div>
  );
};

export default Manual;
