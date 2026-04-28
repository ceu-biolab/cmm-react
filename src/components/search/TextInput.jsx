import { useState } from "react";
import { parseFlexibleNumber } from "../../utils/numberParsing";

const TextInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  className,
  required = false,
  type,
}) => {
  const [error, setError] = useState("");
  const isNumericField =
    type === "number" || ["mz", "tolerance", "mass"].includes(name);

  const handleInputChange = (e) => {
    const val = e.target.value;

    if (!val && !required) {
      setError("");
      onChange(e);
      return;
    }

    if (isNumericField && val && parseFlexibleNumber(val) === null) {
      setError("Please enter a valid number");
    } else {
      setError("");
      onChange(e);
    }
  };

  return (
    <div className={className}>
      <label className="inner-column-label">{label}</label>
      <input
        type="text"
        inputMode={isNumericField ? "decimal" : undefined}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleInputChange}
        required={required}
      />
      {error && <p style={{ color: "red", fontSize: "0.8rem" }}>{error}</p>}
    </div>
  );
};

export default TextInput;
