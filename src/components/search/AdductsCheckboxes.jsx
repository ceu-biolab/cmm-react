import React from "react";

const AdductsCheckboxes = ({ selectedAdducts, onChange }) => {
  const adducts = [
    "Select All",
    "M+H",
    "M+2H",
    "M+Na",
    "M+K",
    "M+NH4",
    "M+H-H2O",
    "M+H+NH4",
    "2M+H",
    "2M+Na",
    "M+H+HCOONa",
    "2M+H-H2O",
    "M+3H",
    "M+2H+Na",
    "M+H+2K",
    "M+H+2Na",
    "M+3Na",
    "M+H+Na",
    "M+H+K",
    "M+ACN+2H",
    "M+2Na",
    "M+2ACN+2H",
    "M+CH3OH+H",
    "M+ACN+H",
    "M+2Na-H",
    "M+IsoProp+H",
    "M+ACN+Na",
    "M+2K-H",
    "M+DMSO+H",
    "M+2ACN+H",
    "M+IsoProp+Na+H",
    "2M+NH4",
    "2M+K",
    "2M+ACN+H",
    "2M+ACN+Na",
    "3M+H",
    "3M+Na",
    "M+H-2H2O",
    "M+NH4-H2O",
    "M+Li",
    "2M+2H+3H2O",
    "M+H+CH3COOH",
    "M+H+CH3COONa",
    "M+F+H",
  ];

  return (
    <div className="adducts-div">
      <label className="inner-column-label">Adducts</label>
      <div className="scrollable-checkboxes">
        {adducts.map((adduct) => (
          <label key={adduct}>
            <input
              className="checkbox"
              type="checkbox"
              name="adducts"
              value={adduct}
              checked={selectedAdducts.includes(adduct)}
              onChange={onChange}
            />
            {adduct}
          </label>
        ))}
      </div>
    </div>
  );
};

export default AdductsCheckboxes;
