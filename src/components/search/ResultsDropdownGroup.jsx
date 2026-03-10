import React, { useState } from "react";
import ResultsTable from "./ResultsTable";

const ResultsDropdownGroup = ({
  adduct,
  compounds,
  defaultOpen = false,
  tableProps = {},
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const normalizedCompounds = Array.isArray(compounds) ? compounds : [];
  if (normalizedCompounds.length === 0) {
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
          {title} ({normalizedCompounds.length} compounds) {isOpen ? "▲" : "▼"}
        </button>
      </div>
      {isOpen && <ResultsTable results={normalizedCompounds} {...tableProps} />}
    </div>
  );
};

export default ResultsDropdownGroup;
