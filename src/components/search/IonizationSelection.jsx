const IonizationSelection = ({ ionizationMode, onChange }) => (
  <div className="ionization-div">
    <label className="inner-column-label">Ionization Mode</label>
    <div>
      {["ionization1", "ionization2", "ionization3"].map((option) => (
        <label key={option} className="box">
          <input
            className="radio"
            type="radio"
            name="ionizationMode"
            value={option}
            checked={ionizationMode === option}
            onChange={onChange}
          />
          {option === "ionization1"
            ? "Neutral"
            : option === "ionization2"
            ? "Positive Mode"
            : "Negative Mode"}
        </label>
      ))}
    </div>
  </div>
);

export default IonizationSelection;