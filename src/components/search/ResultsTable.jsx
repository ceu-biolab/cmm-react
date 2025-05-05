import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createSearchParams } from "react-router-dom";
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
                          search: createSearchParams({
                            compound_name: item.compoundName,
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
                            mol2: item.mol2,
                            sdf: item.sdf,
                          }).toString(),
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.compoundId}
                      </Link>
                    ) : isLinkable && value && value !== 0 && value !== "—" ? (
                      <a
                        href={
                          header === "CAS"
                            ? `https://commonchemistry.cas.org/detail?cas_rn=${value}`
                            : header === "KEGG"
                            ? `https://www.kegg.jp/dbget-bin/www_bget?cpd:${value}`
                            : header === "CHEBI"
                            ? `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${value}`
                            : header === "HMDB"
                            ? `https://hmdb.ca/metabolites/${value}`
                            : header === "LipidMaps"
                            ? `https://www.lipidmaps.org/data/LMSDRecord.php?LMID=${value}`
                            : header === "PubChem"
                            ? `https://pubchem.ncbi.nlm.nih.gov/compound/${value}`
                            : header === "KNAPSACK"
                            ? `https://www.knapsackfamily.com/knapsack_core/information.php?word=${value}`
                            : `https://dummy-link.com/${urlSafeHeader}/${value}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {value}
                      </a>
                    ) : value === 0 ? (
                      "—"
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
