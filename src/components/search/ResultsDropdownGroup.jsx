import React, { useState } from "react";
import ResultsTable from "./ResultsTable";

const ResultsDropdownGroup = ({ adduct, compounds }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown-group">
      <button
        className="dropdown-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {adduct} ({compounds.length} compounds) {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && <ResultsTable results={compounds} />}
    </div>
  );
};

export default ResultsDropdownGroup;
