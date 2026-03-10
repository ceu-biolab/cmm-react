// RadioGroup.jsx
const normalizeOption = (option) => {
  if (typeof option === "string" || typeof option === "number") {
    const normalizedValue = String(option);
    return {
      value: normalizedValue,
      label: normalizedValue,
    };
  }

  if (option && typeof option === "object") {
    const rawValue =
      option.value ?? option.code ?? option.bufferCode ?? option.name ?? "";
    const normalizedValue = String(rawValue);
    const rawLabel =
      option.label ?? option.description ?? option.displayName ?? rawValue;

    return {
      value: normalizedValue,
      label: String(rawLabel),
    };
  }

  return {
    value: "",
    label: "",
  };
};

const GroupRadio = ({
  label,
  name,
  value,
  options = [],
  onChange,
  className = "",
}) => (
  <div className={`radio-group-div ${className}`}>
    <label className="inner-column-label">{label}</label>
    <div>
      {options.map((option, index) => {
        const normalizedOption = normalizeOption(option);
        const selectedValue = String(value ?? "");

        return (
          <label
            key={`${normalizedOption.value}-${index}`}
            className="box"
          >
            <input
              className="radio"
              type="radio"
              name={name}
              value={normalizedOption.value}
              checked={selectedValue === normalizedOption.value}
              onChange={onChange}
            />
            {normalizedOption.label}
          </label>
        );
      })}
    </div>
  </div>
);

export default GroupRadio;
