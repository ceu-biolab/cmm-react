import React, { useState } from "react";
import { Link } from "react-router-dom";
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
                      <Link
                        to={{
                          pathname: `/compound/${item.compoundId}`,
                        }}
                        state={{ compound: item }}
                        className="id-link"
                      >
                        {item.compoundId}
                      </Link>
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
    </div>
  );
};

export default ResultsTable;
