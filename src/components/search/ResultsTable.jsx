import React, { useMemo } from "react";
import { Link, createSearchParams } from "react-router-dom";
import { normalizeCompound } from "../../utils/resultNormalization";

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
  if (!Array.isArray(pathways) || pathways.length === 0) {
    return EMPTY_VALUE;
  }

  const visiblePathways = pathways.slice(0, 2);
  const hiddenCount = pathways.length - visiblePathways.length;
  const hiddenTitle = hiddenCount > 0 ? pathways.slice(2).join(", ") : "";

  return (
    <div className="pathway-cell">
      {visiblePathways.map((pathway) => (
        <span key={pathway} className="pathway-pill" title={pathway}>
          {pathway}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="pathway-pill pathway-pill-more" title={hiddenTitle}>
          +{hiddenCount} more
        </span>
      )}
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

const getColumns = (normalizedResults) => {
  const hasAny = (key) => normalizedResults.some((row) => hasValue(row[key]));

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
    ...(hasAny("ccsError")
      ? [{ header: "CCS Error", key: "ccsError", type: "number", digits: 3 }]
      : []),
    { header: "CAS", key: "casID", external: true },
    { header: "KEGG", key: "keggID", external: true },
    { header: "CHEBI", key: "chebiID", external: true },
    { header: "HMDB", key: "hmdbID", external: true },
    { header: "LipidMaps", key: "lmID", external: true },
    { header: "PubChem", key: "pcID", external: true },
    { header: "KNApSAcK", key: "knapsackID", external: true },
    { header: "NP Atlas", key: "npatlasID", external: true },
    { header: "Pathways", key: "pathways", type: "pathways" },
  ];
};

const ResultsTable = ({ results }) => {
  const normalizedResults = useMemo(
    () => (Array.isArray(results) ? results.map(normalizeCompound) : []),
    [results]
  );

  const columns = useMemo(
    () => getColumns(normalizedResults),
    [normalizedResults]
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
              return (
                <tr key={`${compoundId}-${index}`}>
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
                              }).toString(),
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => storeCompound(item)}
                          >
                            {compoundId}
                          </Link>
                        </td>
                      );
                    }

                    if (column.type === "pathways") {
                      return (
                        <td key={column.header} className={cellClassName}>
                          <PathwaysCell pathways={item.pathways} />
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
