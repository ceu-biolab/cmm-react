import React, { useState } from "react";
import ResultsTable from "./ResultsTable";
import FileDownload from "../effects/FileDownload";

const ResultsDropdownGroup = ({ adduct, compounds }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!compounds || compounds.length === 0) {
    return null;
  }

  return (
    <div className="dropdown-container">
      <div className="dropdown-group">
        <button
          className="dropdown-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {adduct} ({compounds.length} compounds) {isOpen ? "▲" : "▼"}
        </button>
      </div>
      {isOpen && <ResultsTable results={compounds} />}
    </div>
  );
};

export default ResultsDropdownGroup;
