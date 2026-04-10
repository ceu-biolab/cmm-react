import React from "react";
import ProgressRing from "./ProgressRing";
import FileDownload from "../effects/FileDownload";
import { normalizeCompound } from "../../utils/resultNormalization";

const hasValue = (value) =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  value !== "null" &&
  value !== "undefined";

const toFiniteNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const DEFAULT_EXPORT_COLUMNS = [
  { header: "ID", key: "compoundId" },
  { header: "Name", key: "compoundName" },
  { header: "Formula", key: "formula" },
  { header: "Mass", key: "mass" },
  { header: "m/z Error (ppm)", key: "massErrorPpm" },
  { header: "Score", key: "score" },
  { header: "RT Score", key: "rtScore" },
  { header: "Adduct Score", key: "adductScore" },
  { header: "Ionization Score", key: "ionizationScore" },
  { header: "Cosine Score", key: "gcmsCosineScore" },
  { header: "RI Error", key: "riError" },
  { header: "Mobility Error (%)", key: "mobilityErrorPct" },
  { header: "RMT Error (%)", key: "rmtErrorPct" },
  { header: "Relative MT", key: "relativeMt" },
  { header: "Absolute MT", key: "absoluteMt" },
  { header: "CCS Error", key: "ccsError" },
  { header: "DB CCS", key: "dbCcs" },
  { header: "MS/MS Cosine Score", key: "msmsCosineScore" },
  { header: "Collision Energy", key: "collisionEnergy" },
  { header: "CAS", key: "casID" },
  { header: "KEGG", key: "keggID" },
  { header: "CHEBI", key: "chebiID" },
  { header: "HMDB", key: "hmdbID" },
  { header: "LipidMaps", key: "lmID" },
  { header: "PubChem", key: "pcID" },
  { header: "KNApSAcK", key: "knapsackID" },
  { header: "NP Atlas", key: "npatlasID" },
  { header: "Agilent", key: "agilentID" },
  { header: "InHouse", key: "inHouseID" },
  { header: "Aspergillus", key: "aspergillusID" },
  { header: "FAHFA", key: "fahfaID" },
  { header: "OH Position", key: "ohPositionID" },
  { header: "Pathways", key: "pathway" },
];

const ResultsSummary = ({
  results = {},
  matchedAdductCount,
  totalAdductCount,
  progressLabel = "Adduct matches",
  filename = "compounds_export.csv",
  extraExportColumns = [],
  hiddenExportKeys = [],
}) => {
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
  const hiddenExportKeySet = new Set(hiddenExportKeys);
  const exportColumns = [
    ...DEFAULT_EXPORT_COLUMNS.filter(
      (column) => !hiddenExportKeySet.has(column.key)
    ),
    ...extraExportColumns.filter(
      (column) =>
        column?.key &&
        !hiddenExportKeySet.has(column.key) &&
        (column?.always || allCompounds.some((compound) => hasValue(compound[column.key])))
    ),
  ];

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
          headers={exportColumns.map((column) => column.header)}
          keys={exportColumns.map((column) => column.key)}
          filename={filename}
        />
      </div>
    </div>
  );
};

export default ResultsSummary;
