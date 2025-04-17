import React from "react";
import MoleculeViewer from "./CompoundViewer";
import searchIcon from "../../assets/svgs/search-svg.svg";
import clickIcon from "../../assets/svgs/click-drag.svg";
import databaseIcon from "../../assets/svgs/database.svg";

const CompoundInfoCard = ({ compound }) => {
  if (!compound) return null;

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
          <strong>{compound.compoundName}</strong>{" "}
          <ul>
            <li>Formula: {compound.formula}</li>
            <li>Mass: {parseFloat(compound.mass).toFixed(4)}</li>
            <li>Charge Type: {compound.chargeType}</li>
            <li>Charge Number: {compound.chargeNumber}</li>
          </ul>
        </div>
        <div className="compound-info-col-3">
          <div className="compounds-page-search-icon">
            <img
              src={databaseIcon}
              alt="Search Icon"
              className="compounds-search-icon"
            />
          </div>
          <strong>Database IDs</strong>
          <ul>
            <li>CAS: {compound.casID ? compound.casID : "N/A"}</li>
            <li>KEGG: {compound.keggID || "N/A"}</li>
            <li>CHEBI: {compound.chebiID || "N/A"}</li>
            <li>HMDB: {compound.hmdbID || "N/A"}</li>
            <li>Lipid Maps: {compound.lmID || "N/A"}</li>
            <li>PubChem: {compound.pcID || "N/A"}</li>
            <li>Knapsack: {compound.knapsackID || "N/A"}</li>
            <li>NP Atlas: {compound.npatlasID || "N/A"}</li>
          </ul>
        </div>
        <div className="compound-info-col-1">
          <MoleculeViewer className="custom-molecule-viewer" />
          <div className="click-and-drag">
            <img src={clickIcon} alt="Search Icon" className="click-icon" />
            Click and drag to move
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompoundInfoCard;
