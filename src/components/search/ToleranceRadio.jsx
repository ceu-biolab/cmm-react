import { parseFlexibleNumber } from "../../utils/numberParsing";

const ToleranceRadio = ({
  label = "Tolerance",
  toleranceValue,
  mzToleranceMode,
  onChange,
  inputName = "tolerance",
  modeName = "mzToleranceMode",
  unitOptions = ["PPM", "MDA"],
  className = "",
}) => {
  const resolveMaxTolerance = (mode) => {
    const normalizedMode = String(mode || "").trim().toLowerCase();

    if (normalizedMode === "ppm") {
      return 100;
    }

    if (normalizedMode === "mda") {
      return 100;
    }

    if (normalizedMode === "da") {
      return 0.1;
    }

    return null;
  };

  const emitValueChange = (name, value) => {
    onChange({
      target: {
        name,
        value,
      },
    });
  };

  const clampToleranceValue = (rawValue, mode) => {
    const maxTolerance = resolveMaxTolerance(mode);
    if (maxTolerance === null || rawValue === "") {
      return rawValue;
    }

    const numeric = parseFlexibleNumber(rawValue);
    if (numeric === null) {
      return rawValue;
    }

    return numeric > maxTolerance ? String(maxTolerance) : rawValue;
  };

  const handleToleranceChange = (event) => {
    const nextValue = clampToleranceValue(event.target.value, mzToleranceMode);
    if (nextValue !== event.target.value) {
      emitValueChange(inputName, nextValue);
      return;
    }
    onChange(event);
  };

  const handleModeChange = (event) => {
    onChange(event);

    const limitedValue = clampToleranceValue(toleranceValue, event.target.value);
    if (limitedValue !== toleranceValue) {
      emitValueChange(inputName, limitedValue);
    }
  };

  return (
    <div className={`tolerance-div ${className}`}>
      <label className="inner-column-label">{label}</label>
      <input
        type="text"
        name={inputName}
        value={toleranceValue}
        onChange={handleToleranceChange}
      />
      {unitOptions.map((unit) => (
        <label key={unit}>
          <input
            className="radio"
            type="radio"
            name={modeName}
            value={unit}
            checked={mzToleranceMode === unit}
            onChange={handleModeChange}
          />
          {unit}
        </label>
      ))}
    </div>
  );
};

export default ToleranceRadio;
