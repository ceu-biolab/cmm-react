import React from "react";

const IonizationSelection = ({ onChange}) => {

  return (  
  <div className="ionization-div">
    <label className="inner-column-label">Ionization Mode</label>
    <div>
      {["ionization1", "ionization2", "ionization3"].map((mode) => (
        <label key={mode} className="box">
          <input
            className="radio"
            type="radio"
            name="ionizationMode"
            value={mode}
            defaultChecked={mode === "ionization1"}
            onChange={onChange}
          />
          {mode === "ionization1"
            ? "Neutral"
            : mode === "ionization2"
            ? "Positive Mode"
            : "Negative Mode"}
        </label>
      ))}
    </div>
  </div>);
};

export default IonizationSelection;
