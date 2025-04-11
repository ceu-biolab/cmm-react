import React from "react";
import CompoundViewer from "./CompoundViewer";

const CompoundInfoCard = ({ compound }) => {
  if (!compound) return null;

  return (
    <div className="compound-info-card">
      <div className="left-column">
        <div className="outer-molecule-container">
          <CompoundViewer />
        </div>
      </div>
      <div className="right-column">
        <h3>{compound.compoundName}</h3>
        <h4>Formula: {compound.formula}</h4>
        <h4>Mass: {parseFloat(compound.mass).toFixed(4)}</h4>{" "}
        <h4>Charge Type: {compound.chargeType}</h4>
        <h4>Charge Number: {compound.chargeNumber}</h4>
      </div>
      {/*<div>
        <strong>Database IDs:</strong>
        <ul>
          {compound.lipidMapsID && <li>LipidMaps: {compound.lipidMapsID}</li>}
          {compound.hmdbID && <li>HMDB: {compound.hmdbID}</li>}
        </ul>
      </div>*/}
    </div>
  );
};

export default CompoundInfoCard;
