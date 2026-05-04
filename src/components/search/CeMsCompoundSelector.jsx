import { useId, useMemo, useState } from "react";
import PropTypes from "prop-types";

const normalizeTextKey = (value) => String(value ?? "").trim().toLowerCase();

const uniqueOptions = (options) => {
  const seen = new Set();

  return (options || []).filter((option) => {
    const key = normalizeTextKey(option);

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const CeMsCompoundSelector = ({
  label,
  name,
  value,
  options = [],
  availableOptions = [],
  onChange,
  className = "",
  searchPlaceholder = "Search compounds",
}) => {
  const searchInputId = useId();
  const [searchTerm, setSearchTerm] = useState("");

  const allOptions = useMemo(() => uniqueOptions(options), [options]);

  const availableLookup = useMemo(
    () =>
      new Set(availableOptions.map((option) => normalizeTextKey(option))),
    [availableOptions]
  );

  const visibleOptions = useMemo(() => {
    const normalizedSearch = normalizeTextKey(searchTerm);
    const filteredOptions = allOptions.filter((option) =>
      !normalizedSearch || normalizeTextKey(option).includes(normalizedSearch)
    );
    const available = filteredOptions.filter((option) =>
      availableLookup.has(normalizeTextKey(option))
    );
    const unavailable = filteredOptions.filter(
      (option) => !availableLookup.has(normalizeTextKey(option))
    );

    return [...available, ...unavailable];
  }, [allOptions, availableLookup, searchTerm]);

  const handleSelection = (nextValue) => {
    if (!onChange) {
      return;
    }

    onChange({
      target: {
        name,
        value: nextValue,
        type: "text",
      },
    });
  };

  const availableCount = availableOptions.length;
  const selectedIsAvailable = !value || availableLookup.has(normalizeTextKey(value));
  const emptyMessage = searchTerm
    ? "No compounds match this search."
    : "No compounds available for the current selection.";

  return (
    <div className={className}>
      <label className="inner-column-label" htmlFor={searchInputId}>
        {label}
      </label>

      <div className="ce-ms-compound-selector">
        <input
          id={searchInputId}
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={`${label} search`}
        />

        <p className="ce-ms-compound-selector-meta">
          {availableCount} available / {allOptions.length} total
        </p>

        {value ? (
          <p
            className={`ce-ms-compound-selector-current ${
              selectedIsAvailable ? "" : "is-unavailable"
            }`}
          >
            Selected: {value}
          </p>
        ) : null}

        <div className="ce-ms-compound-selector-list scrollable-checkboxes">
          {visibleOptions.length ? (
            visibleOptions.map((option) => {
              const optionKey = normalizeTextKey(option);
              const isAvailable = availableLookup.has(optionKey);
              const isSelected = normalizeTextKey(value) === optionKey;

              return (
                <button
                  key={option}
                  type="button"
                  className={`ce-ms-compound-option ${
                    isSelected ? "is-selected" : ""
                  } ${isAvailable ? "" : "is-unavailable"}`}
                  onClick={() => handleSelection(option)}
                  disabled={!isAvailable}
                  aria-pressed={isSelected}
                >
                  <span>{option}</span>
                  {!isAvailable ? (
                    <span className="ce-ms-compound-option-status">
                      Unavailable
                    </span>
                  ) : null}
                </button>
              );
            })
          ) : (
            <p className="ce-ms-compound-selector-empty">{emptyMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

CeMsCompoundSelector.propTypes = {
  availableOptions: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  searchPlaceholder: PropTypes.string,
  value: PropTypes.string,
};

export default CeMsCompoundSelector;
