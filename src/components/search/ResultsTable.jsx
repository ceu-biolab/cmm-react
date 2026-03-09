import React, { useMemo } from "react";
import { Link, createSearchParams } from "react-router-dom";
import {
  extractPathwayEntries,
  normalizeCompound,
} from "../../utils/resultNormalization";

const EMPTY_VALUE = "—";

const formatNumber = (value, digits = 4) => {
  if (value === null || value === undefined || value === "") {
    return EMPTY_VALUE;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return EMPTY_VALUE;
  }

  return parsed.toFixed(digits);
};

const hasValue = (value) =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  value !== "null" &&
  value !== "undefined";

const PathwaysCell = ({ pathways = [] }) => {
  const normalizedPathways = extractPathwayEntries(pathways);

  if (!normalizedPathways.length) {
    return EMPTY_VALUE;
  }

  return (
    <div className="pathway-cell">
      {normalizedPathways.map((pathwayEntry, index) => (
        <span
          key={`${pathwayEntry.name}-${pathwayEntry.keggPathwayId || index}`}
          className="pathway-pill"
          title={pathwayEntry.name}
        >
          {pathwayEntry.keggPathwayUrl ? (
            <a
              href={pathwayEntry.keggPathwayUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {pathwayEntry.name}
            </a>
          ) : (
            pathwayEntry.name
          )}
        </span>
      ))}
    </div>
  );
};

const identifierConfig = [
  {
    label: "CAS",
    key: "casID",
    linkBuilder: (value) =>
      `https://commonchemistry.cas.org/detail?cas_rn=${value}`,
  },
  {
    label: "KEGG",
    key: "keggID",
    linkBuilder: (value) => `https://www.kegg.jp/dbget-bin/www_bget?cpd:${value}`,
  },
  {
    label: "CHEBI",
    key: "chebiID",
    linkBuilder: (value) =>
      `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${value}`,
  },
  {
    label: "HMDB",
    key: "hmdbID",
    linkBuilder: (value) => `https://hmdb.ca/metabolites/${value}`,
  },
  {
    label: "LipidMaps",
    key: "lmID",
    linkBuilder: (value) =>
      `https://www.lipidmaps.org/data/LMSDRecord.php?LMID=${value}`,
  },
  {
    label: "PubChem",
    key: "pcID",
    linkBuilder: (value) => `https://pubchem.ncbi.nlm.nih.gov/compound/${value}`,
  },
  {
    label: "KNApSAcK",
    key: "knapsackID",
    linkBuilder: (value) =>
      `https://www.knapsackfamily.com/knapsack_core/information.php?word=${value}`,
  },
  {
    label: "NP Atlas",
    key: "npatlasID",
    linkBuilder: (value) => `https://www.npatlas.org/explore/compounds/${value}`,
  },
];

const IdentifiersCell = ({ row }) => {
  const values = identifierConfig
    .map(({ label, key, linkBuilder }) => {
      const value = row?.[key];
      if (!hasValue(value)) {
        return null;
      }

      return {
        label,
        value,
        href: linkBuilder ? linkBuilder(value) : null,
      };
    })
    .filter(Boolean);

  if (!values.length) {
    return EMPTY_VALUE;
  }

  return (
    <div className="identifiers-cell">
      {values.map((item) => (
        <span key={`${item.label}-${item.value}`} className="identifier-pill">
          <strong>{item.label}</strong>:{" "}
          {item.href ? (
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              {item.value}
            </a>
          ) : (
            item.value
          )}
        </span>
      ))}
    </div>
  );
};

const externalLinkMap = {
  CAS: (value) => `https://commonchemistry.cas.org/detail?cas_rn=${value}`,
  KEGG: (value) => `https://www.kegg.jp/dbget-bin/www_bget?cpd:${value}`,
  CHEBI: (value) =>
    `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${value}`,
  HMDB: (value) => `https://hmdb.ca/metabolites/${value}`,
  LipidMaps: (value) =>
    `https://www.lipidmaps.org/data/LMSDRecord.php?LMID=${value}`,
  PubChem: (value) => `https://pubchem.ncbi.nlm.nih.gov/compound/${value}`,
  KNApSAcK: (value) =>
    `https://www.knapsackfamily.com/knapsack_core/information.php?word=${value}`,
  "NP Atlas": (value) =>
    `https://www.npatlas.org/explore/compounds/${value}`,
};

const getColumns = (normalizedResults, options = {}) => {
  const { extraColumns = [], forceColumns = [] } = options;
  const forcedColumns = new Set(forceColumns);
  const hasAny = (key) =>
    forcedColumns.has(key) ||
    normalizedResults.some((row) => hasValue(row[key]));

  const visibleExtraColumns = extraColumns.filter(
    (column) => column?.always || hasAny(column.key)
  );

  return [
    { header: "ID", key: "compoundId", type: "id" },
    { header: "Name", key: "compoundName" },
    { header: "Formula", key: "formula", className: "formula-column" },
    { header: "Mass", key: "mass", type: "number", digits: 4 },
    { header: "Error", key: "massErrorPpm", type: "number", digits: 4 },
    ...(hasAny("score")
      ? [{ header: "Score", key: "score", type: "number", digits: 4 }]
      : []),
    ...(hasAny("rtScore")
      ? [{ header: "RT Score", key: "rtScore", type: "number", digits: 4 }]
      : []),
    ...(hasAny("adductScore")
      ? [{ header: "Adduct Score", key: "adductScore", type: "number", digits: 4 }]
      : []),
    ...(hasAny("ionizationScore")
      ? [
          {
            header: "Ionization Score",
            key: "ionizationScore",
            type: "number",
            digits: 4,
          },
        ]
      : []),
    ...(hasAny("gcmsCosineScore")
      ? [
          {
            header: "Cosine",
            key: "gcmsCosineScore",
            type: "number",
            digits: 4,
          },
        ]
      : []),
    ...(hasAny("riError")
      ? [{ header: "RI Error", key: "riError", type: "number", digits: 2 }]
      : []),
    ...(hasAny("dbCcs")
      ? [{ header: "DB CCS", key: "dbCcs", type: "number", digits: 3 }]
      : []),
    ...(hasAny("ccsError")
      ? [{ header: "CCS Error", key: "ccsError", type: "number", digits: 3 }]
      : []),
    ...visibleExtraColumns,
    { header: "External IDs", key: "externalIds", type: "identifiers" },
    { header: "Pathways", key: "pathways", type: "pathways" },
  ];
};

const ResultsTable = ({
  results,
  extraColumns = [],
  forceColumns = [],
  onRowClick,
  selectedRowId = null,
  getRowId,
  isRowSelectable,
}) => {
  const normalizedResults = useMemo(
    () => (Array.isArray(results) ? results.map(normalizeCompound) : []),
    [results]
  );

  const columns = useMemo(
    () => getColumns(normalizedResults, { extraColumns, forceColumns }),
    [normalizedResults, extraColumns, forceColumns]
  );

  const storeCompound = (compound) => {
    const compoundId = compound?.compoundId ?? compound?.id;
    if (!compoundId) return;
    try {
      localStorage.setItem(`compound:${compoundId}`, JSON.stringify(compound));
    } catch {
      // ignore storage errors
    }
  };

  if (!normalizedResults.length) {
    return <p>No results available</p>;
  }

  return (
    <div className="results-container">
      <div className="results-table-scroll">
        <table className="results-table" border="1">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.header} className={column.className || ""}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {normalizedResults.map((item, index) => {
              const compoundId = item.compoundId ?? `${index + 1}`;
              const rowId =
                typeof getRowId === "function"
                  ? getRowId(item, index)
                  : item.compoundId ?? item.id ?? `${index + 1}`;
              const rowSelectable =
                typeof onRowClick === "function" &&
                (typeof isRowSelectable === "function"
                  ? isRowSelectable(item, index, rowId)
                  : true);
              const rowSelected =
                selectedRowId !== null &&
                selectedRowId !== undefined &&
                rowId === selectedRowId;

              return (
                <tr
                  key={`${compoundId}-${index}`}
                  className={rowSelected ? "selected-result-row" : ""}
                  onClick={rowSelectable ? () => onRowClick(item, rowId) : undefined}
                  style={{ cursor: rowSelectable ? "pointer" : "default" }}
                >
                  {columns.map((column) => {
                    const value = item[column.key];
                    const cellClassName = column.className || "";

                    if (column.type === "id") {
                      return (
                        <td
                          key={column.header}
                          className={`id-column ${cellClassName}`.trim()}
                        >
                          <Link
                            to={{
                              pathname: `/compound/${compoundId}`,
                              search: createSearchParams({
                                compound_name: item.compoundName || item.name,
                                formula: item.formula,
                                mass: item.mass,
                                chargeType: item.chargeType,
                                chargeNumber: item.chargeNumber,
                                numCarbons: item.numCarbons,
                                doubleBonds: item.doubleBonds,
                                numChains: item.numChains,
                                inchi: item.inchi,
                                inchiKey: item.inchiKey,
                                smiles: item.smiles,
                                casID: item.casID,
                                keggID: item.keggID,
                                chebiID: item.chebiID,
                                hmdbID: item.hmdbID,
                                lmID: item.lmID,
                                pcID: item.pcID,
                                knapsackID: item.knapsackID,
                                npatlasID: item.npatlasID,
                                pathway: item.pathway,
                              }).toString(),
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) => {
                              event.stopPropagation();
                              storeCompound(item);
                            }}
                          >
                            {compoundId}
                          </Link>
                        </td>
                      );
                    }

                    if (column.type === "pathways") {
                      return (
                        <td key={column.header} className={cellClassName}>
                          <PathwaysCell
                            pathways={item.pathwayEntries || item.pathways}
                          />
                        </td>
                      );
                    }

                    if (column.type === "identifiers") {
                      return (
                        <td key={column.header} className={cellClassName}>
                          <IdentifiersCell row={item} />
                        </td>
                      );
                    }

                    if (column.external) {
                      const cleanValue = hasValue(value) ? value : null;
                      const buildLink = externalLinkMap[column.header];
                      return (
                        <td key={column.header} className={cellClassName}>
                          {cleanValue && buildLink ? (
                            <a
                              href={buildLink(cleanValue)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {cleanValue}
                            </a>
                          ) : (
                            EMPTY_VALUE
                          )}
                        </td>
                      );
                    }

                    if (column.type === "number") {
                      return (
                        <td key={column.header} className={cellClassName}>
                          {formatNumber(value, column.digits)}
                        </td>
                      );
                    }

                    return (
                      <td key={column.header} className={cellClassName}>
                        {hasValue(value) ? value : EMPTY_VALUE}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
