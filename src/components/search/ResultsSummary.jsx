import React from "react";
import ProgressRing from "./ProgressRing";
import FileDownload from "../effects/FileDownload";

const ResultsSummary = ({ results, matchedAdductCount, totalAdductCount }) => {
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

  const allCompounds = Object.values(results).flat();

  const totalCompounds = allCompounds.length;

  return (
    <div className="drop-down-results-summary">
      <div className="results-summary-col-1">
        <div className="results-count">{totalCompounds}</div>
        <div className="results-count-text">
          Compound{totalCompounds !== 1 ? "s" : ""} found
        </div>
      </div>

      <div className="results-summary-col-2">
        <ProgressRing matched={matchedAdductCount} total={totalAdductCount} />
        <div className="results-count-text">Adduct matches</div>
      </div>

      <div className="results-summary-col-3">
        <ul>
          {Object.entries(results).map(([adduct, compounds]) => (
            <li key={adduct}>
              {adduct}: {compounds.length} compound
              {compounds.length !== 1 ? "s" : ""}
            </li>
          ))}
        </ul>
      </div>

      <div className="results-summary-col-4">
        <FileDownload
          data={allCompounds}
          headers={displayHeaders}
          keys={dataKeys}
          filename={`compounds_export.csv`}
        />
      </div>
    </div>
  );
};

export default ResultsSummary;
