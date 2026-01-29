import { useState, useRef } from "react";

const TextBoxInput = ({
  value,
  onChange,
  name = "mz",
  label = "Experimental Masses",
  className: customClassName = "",
  placeholder: customPlaceholder = "",
  required = false,
  validationMode = "numbers",
}) => {
  const [error, setError] = useState("");
  const typingTimeout = useRef(null);

  const validateInput = (val) => {
    const trimmed = val.trim();
    if (!trimmed) {
      if (required) setError("This field is required");
      else setError("");
      return;
    }

    // Split by commas, spaces, semicolons, or newlines
    const parts = trimmed.split(/[\s,;]+/).filter(Boolean);
    const invalids = parts.filter((part) => {
      if (validationMode === "mzIntensityPairs") {
        if (part.includes(":")) {
          const [mzStr, intensityStr] = part.split(":");
          return (
            mzStr === undefined ||
            intensityStr === undefined ||
            isNaN(Number(mzStr)) ||
            isNaN(Number(intensityStr))
          );
        }
        return isNaN(Number(part));
      }

      return isNaN(Number(part));
    });

    if (invalids.length > 0) {
      setError(`Invalid entries: ${invalids.join(", ")}`);
    } else {
      setError("");
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(e); // Always let React state update first

    // Cancel previous validation while typing fast
    clearTimeout(typingTimeout.current);

    // Wait 500ms before validating — debounce behavior
    typingTimeout.current = setTimeout(() => validateInput(val), 500);
  };

  const handleBlur = (e) => {
    // Force validation once user leaves the textarea
    validateInput(e.target.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const masses = text
          .split(/[\s,;]+/)
          .map((s) => s.trim())
          .filter((s) => /^[-+]?(?:\d+\.?\d*|\.\d+)$/.test(s))
          .map(parseFloat);

        if (!masses.length) {
          setError("No valid numeric values found in file");
          return;
        }

        onChange({
          target: {
            name,
            value: masses.join(", "),
          },
        });
        setError("");
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`inner-column ${customClassName}`}>
      <label className="inner-column-label">
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </label>

      <textarea
        name={name}
        className="experimental-masses"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={
          customPlaceholder ||
          "Enter mass values separated by commas, spaces, or semicolons"
        }
        rows="6"
        required={required}
        style={error ? { borderColor: "red" } : {}}
      />

      {error && (
        <div style={{ color: "red", fontSize: "0.9em", marginTop: "4px" }}>
          {error}
        </div>
      )}

      <label htmlFor={`file-upload-${name}`} className="custom-file-upload">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="bi bi-file-earmark-arrow-up-fill"
          viewBox="0 0 16 16"
        >
          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z" />
        </svg>
      </label>

      <input
        type="file"
        id={`file-upload-${name}`}
        accept=".txt,.csv,.xls,.xlsx,.json"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default TextBoxInput;
