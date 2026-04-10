import { useState } from "react";

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
  const inputType =
    type ?? (["mz", "tolerance", "mass"].includes(name) ? "number" : "text");

  const handleInputChange = (e) => {
    const val = e.target.value;

    if (!val && !required) {
      setError("");
      onChange(e);
      return;
    }

    const isNumericField = inputType === "number";

    if (isNumericField && !/^[-+]?\d*\.?\d*$/.test(val)) {
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
        type={inputType}
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
