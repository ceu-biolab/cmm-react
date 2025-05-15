import React, { useState } from "react";
import ResultsTable from "./ResultsTable";
import FileDownload from "../effects/FileDownload";

const ResultsDropdownGroup = ({ adduct, compounds }) => {
  const [isOpen, setIsOpen] = useState(false);

  const displayHeaders = [
    "ID",
    "Name",
    "Formula",
    "Mass",
    "Error",
    "CAS",
    "KEGG",
    "CHEBI",
    "HMDB",
    "LipidMaps",
    "PubChem",
    "KNApSAcK",
    "NP Atlas",
    "Pathways",
  ];

  const dataKeys = [
    "compoundId",
    "compoundName",
    "formula",
    "mass",
    "error",
    "casID",
    "keggID",
    "chebiID",
    "hmdbID",
    "lmID",
    "pcID",
    "knapsackID",
    "npatlasID",
    "pathway",
  ];

  return (
    <div className="dropdown-container">
      <div className="dropdown-group">
        <button
          className="dropdown-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {adduct} ({compounds.length} compounds) {isOpen ? "▲" : "▼"}
        </button>
        <FileDownload
          data={compounds}
          headers={displayHeaders}
          keys={dataKeys}
          filename={`${adduct}_compounds.csv`}
        />
      </div>
      {isOpen && <ResultsTable results={compounds} />}
    </div>
  );
};

export default ResultsDropdownGroup;
