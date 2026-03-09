import React, { useState } from "react";
import ResultsTable from "./ResultsTable";

const ResultsDropdownGroup = ({
  adduct,
  compounds,
  defaultOpen = false,
  tableProps = {},
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!compounds || compounds.length === 0) {
    return null;
  }

  const title = adduct || "Results";

  return (
    <div className="dropdown-container">
      <div className="dropdown-group">
        <button
          className="dropdown-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {title} ({compounds.length} compounds) {isOpen ? "▲" : "▼"}
        </button>
      </div>
      {isOpen && <ResultsTable results={compounds} {...tableProps} />}
    </div>
  );
};

export default ResultsDropdownGroup;
