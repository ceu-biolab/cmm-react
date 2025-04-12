import React, { useState } from "react";
import CompoundInfoCard from "./CompoundInfoCard";

const ResultsTable = ({ results }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredCompound, setHoveredCompound] = useState(null);

  const linkableFields = [
    "CAS",
    "KEGG",
    "CHEBI",
    "HMDB",
    "LipidMaps",
    "PubChem",
    "KNApSAcK",
    "NPAtlas",
  ];

  if (!results || results.length === 0) {
    return <p>No results available</p>;
  }

  // Table headers
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

  // Keys in data
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
    <div className="results-container">
      <table className="results-table" border="1">
        <thead>
          <tr>
            {displayHeaders.map((header, index) => (
              <th
                key={index}
                className={header === "Formula" ? "formula-column" : ""}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((item, index) => (
            <tr key={index}>
              {displayHeaders.map((header, idx) => {
                const dataKey = dataKeys[idx];
                let value = item[dataKey] ?? "—";

                if (header === "Mass" && value !== "—") {
                  value = parseFloat(value).toFixed(4);
                }

                const isLinkable = linkableFields.includes(header);
                const urlSafeHeader = header.toLowerCase().replace(/\s+/g, "");

                const isIdColumn = header === "ID";

                return (
                  <td
                    key={idx}
                    className={isIdColumn ? "id-column" : ""}
                    onMouseEnter={() => {
                      if (isIdColumn) {
                        setHoveredId(item.compoundId);
                        setHoveredCompound(item);
                      }
                    }}
                    onMouseLeave={() => {
                      if (isIdColumn) {
                        setHoveredId(null);
                        setHoveredCompound(null);
                      }
                    }}
                  >
                    {isIdColumn ? (
                      <a
                        href={`/compound/${item.compoundId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="id-link"
                      >
                        {item.compoundId}
                      </a>
                    ) : isLinkable && value !== "—" ? (
                      <a
                        href={`https://dummy-link.com/${urlSafeHeader}/${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display Compound Info Card when hovering over ID */}
      {hoveredCompound && (
        <div className="floating-square">
          <CompoundInfoCard compound={hoveredCompound} />
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
