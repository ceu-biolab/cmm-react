import { useState, useRef } from "react";

const DEFAULT_PLACEHOLDERS = {
  mz: "e.g. 400.3432\n422.3234\n316.2495",
  mzValues: "e.g. 400.3432\n422.3234\n316.2495",
  masses: "e.g. 291.1299\n298.0980\n308.0940",
  mz_values: "e.g. 291.1299\n298.0980\n308.0940",
  retentionTimes: "e.g. 18.8425\n18.8425\n8.1449",
  rtValues: "e.g. 8.50\n6.20\n17.40",
  mt: "e.g. 11.56\n13.65\n15.62",
  ccsValues: "e.g. 202.881\n178.546\n190.314",
  effective_mobilities: "e.g. 1174\n1060\n646",
  rmt: "e.g. 0.85\n0.86\n1.07",
  spectrum: "e.g. 115.0376:100\n55.0177:40.3126\n59.0128:18.1033",
  "fragmentsMZsIntensities.peaks":
    "e.g. 55.301:12.753\n67.237:14.611\n69.204:39.189",
  compositeSpectrum:
    'e.g. [\n  { "400.3432": 307034.88 },\n  { "422.32336": 1562.73 }\n]',
};

const getDefaultPlaceholder = (name, label, validationMode) => {
  if (DEFAULT_PLACEHOLDERS[name]) {
    return DEFAULT_PLACEHOLDERS[name];
  }

  if (validationMode === "json") {
    return DEFAULT_PLACEHOLDERS.compositeSpectrum;
  }

  if (validationMode === "mzIntensityPairs") {
    return DEFAULT_PLACEHOLDERS["fragmentsMZsIntensities.peaks"];
  }

  const normalizedLabel = String(label || "").toLowerCase();

  if (normalizedLabel.includes("spectrum")) {
    return DEFAULT_PLACEHOLDERS.spectrum;
  }

  if (normalizedLabel.includes("retention")) {
    return DEFAULT_PLACEHOLDERS.retentionTimes;
  }

  if (normalizedLabel.includes("migration")) {
    return DEFAULT_PLACEHOLDERS.mt;
  }

  if (normalizedLabel.includes("ccs")) {
    return DEFAULT_PLACEHOLDERS.ccsValues;
  }

  if (normalizedLabel.includes("mobility")) {
    return DEFAULT_PLACEHOLDERS.effective_mobilities;
  }

  return "e.g. 400.3432\n422.3234\n316.2495";
};

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

    if (validationMode === "json") {
      try {
        JSON.parse(trimmed);
        setError("");
      } catch {
        setError("Invalid JSON");
      }
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
        if (validationMode === "json") {
          onChange({
            target: {
              name,
              value: text,
            },
          });
          validateInput(text);
          return;
        }

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
      <label className="inner-column-label">{label}</label>

      <textarea
        name={name}
        className="experimental-masses"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={
          customPlaceholder ||
          getDefaultPlaceholder(name, label, validationMode)
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
