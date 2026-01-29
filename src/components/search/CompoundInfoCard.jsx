import React from "react";
import searchIcon from "../../assets/svgs/search-svg.svg";
import clickIcon from "../../assets/svgs/click-drag.svg";
import databaseIcon from "../../assets/svgs/database.svg";
import CompoundViewer3D from "./CompoundViewer3D";
import CompoundViewer2D from "./CompoundViewer2D";
import { useLocation } from "react-router-dom";

const CompoundInfoCard = ({ compound }) => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const getParam = (paramName, defaultValue = "N/A") => {
    return queryParams.get(paramName) || defaultValue;
  };

  const compoundName =
    compound?.compoundName ?? compound?.compound_name ?? getParam("compound_name");
  console.log("Compound Name:", compoundName);

  const compoundFormula = compound?.formula ?? getParam("formula");
  const mass = parseFloat(compound?.mass ?? getParam("mass", "0"));
  const chargeType = compound?.chargeType ?? getParam("chargeType");
  const chargeNumber = compound?.chargeNumber ?? getParam("chargeNumber");
  const numCarbons = compound?.numCarbons ?? getParam("numCarbons");
  const doubleBonds = compound?.doubleBonds ?? getParam("doubleBonds");
  const numChains = compound?.numChains ?? getParam("numChains");

  const inchi = compound?.inchi ?? getParam("inchi");
  const inchiKey = compound?.inchiKey ?? getParam("inchiKey");
  const smiles = compound?.smiles ?? getParam("smiles");

  const casID = compound?.casID ?? getParam("casID");
  const keggID = compound?.keggID ?? getParam("keggID");
  const chebiID = compound?.chebiID ?? getParam("chebiID");
  const hmdbID = compound?.hmdbID ?? getParam("hmdbID");
  const lmID = compound?.lmID ?? getParam("lmID");
  const pcID = compound?.pcID ?? getParam("pcID");
  const knapsackID = compound?.knapsackID ?? getParam("knapsackID");

  const mol2 = compound?.mol2 ?? queryParams.get("mol2");
  const sdf = compound?.sdf ?? queryParams.get("sdf");

  console.log("Smiles: " + smiles);

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
          <div className="compound-name-info-card">{compoundName}</div>
          <ul>
            <li>
              <strong>Formula: </strong>
              {compoundFormula}
            </li>
            <li>
              <strong>Mass: </strong> {mass ? mass.toFixed(4) : "N/A"}
            </li>
            <li>
              <strong>Charge Type: </strong> {chargeType}
            </li>
            <li>
              <strong>Charge Number: </strong> {chargeNumber}
            </li>
            <li>
              <strong>Number of Carbons: </strong> {numCarbons}
            </li>
            <li>
              <strong>Double Bonds: </strong> {doubleBonds}
            </li>
            <li>
              <strong>Number of Chains: </strong> {numChains}
            </li>
          </ul>
          <div className="identifiers-box">
            <strong>Identifiers</strong>
            <ul>
              <li>
                <i>InChI</i>
                <div>{inchi}</div>
              </li>
              <li>
                <i>InChIKey</i>
                <div>{inchiKey}</div>
              </li>
              <li>
                <i>SMILES</i>
                <div>{smiles}</div>
              </li>
            </ul>
          </div>
        </div>
        <div className="compound-info-col-3">
          <div className="compounds-page-search-icon">
            <img
              src={databaseIcon}
              alt="Database Icon"
              className="compounds-search-icon"
            />
          </div>
          <strong>Database References</strong>
          <ul>
            {[
              {
                label: "CAS",
                value: casID,
                url: `https://commonchemistry.cas.org/detail?cas_rn=${casID}`,
              },
              {
                label: "KEGG",
                value: keggID,
                url: `https://www.kegg.jp/dbget-bin/www_bget?cpd:${keggID}`,
              },
              {
                label: "CHEBI",
                value: chebiID,
                url: `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${chebiID}`,
              },
              {
                label: "HMDB",
                value: hmdbID,
                url: `https://hmdb.ca/metabolites/${hmdbID}`,
              },
              {
                label: "Lipid Maps",
                value: lmID,
                url: `https://www.lipidmaps.org/data/LMSDRecord.php?LMID=${lmID}`,
              },
              {
                label: "PubChem",
                value: pcID,
                url: `https://pubchem.ncbi.nlm.nih.gov/compound/${pcID}`,
              },
              {
                label: "Knapsack",
                value: knapsackID,
                url: `https://www.knapsackfamily.com/knapsack_core/information.php?word=${knapsackID}`,
              },
            ]
              .filter(
                (item) =>
                  item.value &&
                  item.value !== "0" &&
                  item.value !== "null" &&
                  item.value !== "undefined"
              )
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
        {(mol2 && mol2 !== "undefined" && mol2 !== "null") ||
        (sdf && sdf !== "undefined" && sdf !== "null") ? (
          <div className="compound-info-col-1">
            <CompoundViewer3D
              mol2Data={mol2}
              sdfData={sdf}
              className="custom-molecule-viewer"
            />
            <div className="click-and-drag">
              <img
                src={clickIcon}
                alt="Click and Drag Icon"
                className="click-icon"
              />
              Click and drag to move
            </div>
          </div>
        ) : null}
        <div className="compound-info-col-4">
          <CompoundViewer2D smiles={smiles} />
        </div>
      </div>
    </div>
  );
};

export default CompoundInfoCard;
