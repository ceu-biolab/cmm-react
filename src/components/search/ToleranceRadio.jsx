const ToleranceRadio = ({
  label = "Tolerance",
  toleranceValue,
  toleranceMode,
  onChange,
  inputName = "tolerance",
  modeName = "toleranceMode",
  unitOptions = ["ppm", "mDa"],
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
            checked={toleranceMode === unit}
            onChange={onChange}
          />
          {unit}
        </label>
      ))}
    </div>
  );
};

export default ToleranceRadio;