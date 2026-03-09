import React from "react";
import ProgressRing from "./ProgressRing";
import FileDownload from "../effects/FileDownload";
import { normalizeCompound } from "../../utils/resultNormalization";

const toFiniteNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const ResultsSummary = ({
  results = {},
  matchedAdductCount,
  totalAdductCount,
  progressLabel = "Adduct matches",
  filename = "compounds_export.csv",
}) => {
  const displayHeaders = [
    "ID",
    "Name",
    "Formula",
    "Mass",
    "Error",
    "Score",
    "RT Score",
    "Adduct Score",
    "Ionization Score",
    "Cosine",
    "RI Error",
    "CCS Error",
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
    "massErrorPpm",
    "score",
    "rtScore",
    "adductScore",
    "ionizationScore",
    "gcmsCosineScore",
    "riError",
    "ccsError",
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

  const groupedResults = Object.entries(results).map(([label, compounds]) => ({
    label,
    compounds: Array.isArray(compounds) ? compounds : [],
  }));

  const allCompounds = groupedResults
    .flatMap((group) => group.compounds)
    .map(normalizeCompound);

  const matchedGroups = groupedResults.filter(
    (group) => group.compounds.length > 0
  ).length;
  const resolvedMatchedCount =
    toFiniteNumber(matchedAdductCount) ?? matchedGroups;
  const resolvedTotalCount =
    toFiniteNumber(totalAdductCount) ?? groupedResults.length;

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
        <ProgressRing
          matched={resolvedMatchedCount}
          total={resolvedTotalCount}
        />
        <div className="results-count-text">{progressLabel}</div>
      </div>

      <div className="results-summary-col-3">
        <ul>
          {groupedResults.map((group) => (
            <li key={group.label}>
              {group.label}: {group.compounds.length} compound
              {group.compounds.length !== 1 ? "s" : ""}
            </li>
          ))}
        </ul>
      </div>

      <div className="results-summary-col-4">
        <FileDownload
          data={allCompounds}
          headers={displayHeaders}
          keys={dataKeys}
          filename={filename}
        />
      </div>
    </div>
  );
};

export default ResultsSummary;
