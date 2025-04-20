import React from "react";
import searchIcon from "../../assets/svgs/search-svg.svg";
import clickIcon from "../../assets/svgs/click-drag.svg";
import databaseIcon from "../../assets/svgs/database.svg";
import CompoundViewer3D from "./CompoundViewer3D";
import CompoundViewer2D from "./CompoundViewer2D";

const CompoundInfoCard = ({ compound }) => {
  if (!compound) return null;
  console.log(compound);

  const { mol2 } = compound;
  const { sdf } = compound;
  const { smiles } = compound;
  console.log(smiles);

  return (
    <div className="page">
      <div className="compound-info-grid-container page">
        <div className="compound-info-col-2">
          <div className="compounds-page-search-icon">
            <img
              src={searchIcon}
              alt="Search Icon"
              className="compounds-search-icon"
            />
          </div>
          <div className="compound-name-info-card">{compound.compoundName}</div>
          <ul>
            <li>
              <strong>Formula: </strong>
              {compound.formula}
            </li>
            <li>
              <strong>Mass: </strong> {parseFloat(compound.mass).toFixed(4)}
            </li>
            <li>
              <strong>Charge Type: </strong> {compound.chargeType}
            </li>
            <li>
              <strong>Charge Number: </strong> {compound.chargeNumber}
            </li>
            <li>
              <strong>Number of Carbons: </strong> {compound.numCarbons}
            </li>
            <li>
              <strong>Double Bonds: </strong> {compound.doubleBonds}
            </li>
            <li>
              <strong>Number of Chains: </strong> {compound.numChains}
            </li>
          </ul>
          <div className="identifiers-box">
            <strong>Identifiers</strong>
            <ul>
              <li>
                <i>InChI</i>
                <div>{compound.inchi || "N/A"}</div>
              </li>
              <li>
                <i>InChIKey</i>
                <div>{compound.inchiKey || "N/A"}</div>
              </li>
              <li>
                <i>SMILES</i>
                <div>{compound.smiles || "N/A"}</div>
              </li>
            </ul>
          </div>
        </div>
        <div className="compound-info-col-3">
          <div className="compounds-page-search-icon">
            <img
              src={databaseIcon}
              alt="Search Icon"
              className="compounds-search-icon"
            />
          </div>
          <strong>Database References</strong>
          <ul>
            {[
              {
                label: "CAS",
                value: compound.casID,
                url: `https://commonchemistry.cas.org/detail?cas_rn=${compound.casID}`,
              },
              {
                label: "KEGG",
                value: compound.keggID,
                url: `https://www.kegg.jp/dbget-bin/www_bget?cpd:${compound.keggID}`,
              },
              {
                label: "CHEBI",
                value: compound.chebiID,
                url: `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${compound.chebiID}`,
              },
              {
                label: "HMDB",
                value: compound.hmdbID,
                url: `https://hmdb.ca/metabolites/${compound.hmdbID}`,
              },
              {
                label: "Lipid Maps",
                value: compound.lmID,
                url: `https://www.lipidmaps.org/data/LMSDRecord.php?LMID=${compound.lmID}`,
              },
              {
                label: "PubChem",
                value: compound.pcID,
                url: `https://pubchem.ncbi.nlm.nih.gov/compound/${compound.pcID}`,
              },
              {
                label: "Knapsack",
                value: compound.knapsackID,
                url: `https://www.knapsackfamily.com/knapsack_core/information.php?word=${compound.knapsackID}`,
              },
            ]
              .filter((item) => item.value && item.value !== 0)
              .map((item) => (
                <li key={item.label}>
                  {item.label}:{" "}
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.value}
                  </a>
                </li>
              ))}
          </ul>
        </div>
        <div className="compound-info-col-1">
          <CompoundViewer3D
            mol2Data={mol2}
            sdfData={sdf}
            className="custom-molecule-viewer"
          />
          <div className="click-and-drag">
            <img src={clickIcon} alt="Search Icon" className="click-icon" />
            Click and drag to move
          </div>
        </div>
        <div className="compound-info-col-4">
          <CompoundViewer2D smiles={smiles} />
        </div>
      </div>
    </div>
  );
};

export default CompoundInfoCard;
