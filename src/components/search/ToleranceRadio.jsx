const ToleranceRadio = ({
  label = "Tolerance",
  toleranceValue,
  mzToleranceMode,
  onChange,
  inputName = "tolerance",
  modeName = "mzToleranceMode",
  unitOptions = ["PPM", "mDa"],
  className = "",
}) => {
  return (
    <div className={`tolerance-div ${className}`}>
      <label className="inner-column-label">{label}</label>
      <input
        type="text"
        name={inputName}
        value={toleranceValue}
        onChange={onChange}
      />
      {unitOptions.map((unit) => (
        <label key={unit}>
          <input
            className="radio"
            type="radio"
            name={modeName}
            value={unit}
            checked={mzToleranceMode === unit}
            onChange={onChange}
          />
          {unit}
        </label>
      ))}
    </div>
  );
};

export default ToleranceRadio;