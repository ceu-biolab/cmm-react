const IonizationSelection = ({ ionizationMode, onChange }) => (
  <div className="ionization-div">
    <label className="inner-column-label">Ionization Mode</label>
    <div>
      {["Neutral", "Positive Mode", "Negative Mode"].map((option) => (
        <label key={option} className="box">
          <input
            className="radio"
            type="radio"
            name="ionizationMode"
            value={option}
            checked={ionizationMode === option}
            onChange={onChange}
          />
          {option}
        </label>
      ))}
    </div>
  </div>
);

export default IonizationSelection;