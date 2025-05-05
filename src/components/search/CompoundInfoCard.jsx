import React from "react";
import searchIcon from "../../assets/svgs/search-svg.svg";
import clickIcon from "../../assets/svgs/click-drag.svg";
import databaseIcon from "../../assets/svgs/database.svg";
import CompoundViewer3D from "./CompoundViewer3D";
import CompoundViewer2D from "./CompoundViewer2D";
import { useLocation } from "react-router-dom";

const CompoundInfoCard = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const getParam = (paramName, defaultValue = "N/A") => {
    return queryParams.get(paramName) || defaultValue;
  };

  const compound_name = queryParams.get("compound_name");
  console.log("Compound Name:", compound_name);

  const compoundFormula = getParam("formula");
  const mass = parseFloat(getParam("mass", "0"));
  const chargeType = getParam("chargeType");
  const chargeNumber = getParam("chargeNumber");
  const numCarbons = getParam("numCarbons");
  const doubleBonds = getParam("doubleBonds");
  const numChains = getParam("numChains");

  const inchi = getParam("inchi");
  const inchiKey = getParam("inchiKey");
  const smiles = getParam("smiles");

  const casID = getParam("casID");
  const keggID = getParam("keggID");
  const chebiID = getParam("chebiID");
  const hmdbID = getParam("hmdbID");
  const lmID = getParam("lmID");
  const pcID = getParam("pcID");
  const knapsackID = getParam("knapsackID");

  const mol2 = getParam("mol2");
  const sdf = getParam("sdf");

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
          <div className="compound-name-info-card">{compound_name}</div>
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
