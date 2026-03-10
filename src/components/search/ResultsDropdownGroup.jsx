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
      {isOpen &&
        (normalizedCompounds.length > 0 ? (
          <ResultsTable results={normalizedCompounds} {...tableProps} />
        ) : (
          <p className="no-results">No results found for this adduct.</p>
        ))}
    </div>
  );
};

export default ResultsDropdownGroup;
