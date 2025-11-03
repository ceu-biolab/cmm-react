import React from "react";

const AdductsCheckboxes = ({
  selectedAdducts,
  onChange,
  className = "",
  label = "Adducts",
  name = "adductsString",
}) => {
  const adductsString = [
    "Select All",
    "[M+H]+",
    "[M+2H]2+",
    "[M+Na]+",
    "[M+K]+",
    "[M+NH4]+",
    "[M+H-H2O]+",
    "[M+H+NH4]2+",
    "[2M+H]+",
    "[2M+Na]+",
    "[M+H+HCOONa]+",
    "[2M+H-H2O]+",
    "[M+3H]3+",
    "[M+2H+Na]3+",
    "[M+H+2K]3+",
    "[M+H+2Na]3+",
    "[M+3Na]3+",
    "[M+H+Na]2+",
    "[M+H+K]2+",
    "[M+ACN+2H]2+",
    "[M+2Na]2+",
    "[M+2ACN+2H]2+",
    "[M+CH3OH+H]+",
    "[M+ACN+H]+",
    "[M+2Na-H]+",
    "[M+IsoProp+H]+",
    "[M+ACN+Na]+",
    "[M+2K-H]+",
    "[M+DMSO+H]+",
    "[M+2ACN+H]+",
    "[M+IsoProp+Na+H]2+",
    "[2M+NH4]+",
    "[2M+K]+",
    "[2M+ACN+H]+",
    "[2M+ACN+Na]+",
    "[3M+H]+",
    "[3M+Na]+",
    "[M+H-2H2O]+",
    "[M+NH4-H2O]+",
    "[M+Li]+",
    "[2M+2H+3H2O]2+",
    "[M+H+CH3COOH]+",
    "[M+H+CH3COONa]+",
    "[M+F+H]+",
  ];

  return (
    <div className={`adducts-div ${className}`}>
      {label && <label className="inner-column-label">{label}</label>}{" "}
      <div className="scrollable-checkboxes">
        {adductsString.map((adduct) => (
          <label key={adduct}>
            <input
              className="checkbox"
              type="checkbox"
              name={name}
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
