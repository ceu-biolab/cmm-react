import axios from "axios";

const EMPTY_CE_MS_OPTIONS = {
  conditions: [],
  markerCompounds: [],
  rmtReferenceCompounds: [],
};

const COMPOUND_FIELDS = ["markerCompounds", "rmtReferenceCompounds"];

let cachedCeMsOptions = null;
let ceMsOptionsPromise = null;

const firstNonEmpty = (...values) =>
  values.find((value) => typeof value === "string" && value.trim() !== "") || null;

const normalizeTextKey = (value) => String(value ?? "").trim().toLowerCase();

const uniqueNames = (values) => {
  const seen = new Set();

  return values.filter((value) => {
    const key = normalizeTextKey(value);

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const normalizeCompoundName = (value) => {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized || null;
  }

  if (value && typeof value === "object") {
    const compoundName = firstNonEmpty(
      value.name,
      value.compoundName,
      value.label,
      value.displayName
    );

    return compoundName?.trim() || null;
  }

  return null;
};

const normalizeCompoundList = (value) =>
  Array.isArray(value)
    ? uniqueNames(value.map(normalizeCompoundName).filter(Boolean))
    : [];

const normalizeTemperature = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeCondition = (value) => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const bufferCode = firstNonEmpty(
    value.buffer?.code,
    value.bufferCode,
    value.buffer?.value,
    value.buffer,
    value.bge?.code,
    value.bgeCode
  );

  return {
    key: firstNonEmpty(value.key) || null,
    bufferCode: bufferCode?.trim() || null,
    temperature: normalizeTemperature(value.temperature),
    polarity: firstNonEmpty(value.polarity),
    ionizationMode: firstNonEmpty(
      value.ionizationMode,
      value.ion_mode,
      value.ionMode
    ),
    markerCompounds: normalizeCompoundList(value.markerCompounds),
    rmtReferenceCompounds: normalizeCompoundList(value.rmtReferenceCompounds),
  };
};

const normalizeCeMsOptions = (data) => {
  const conditions = Array.isArray(data?.conditions)
    ? data.conditions.map(normalizeCondition).filter(Boolean)
    : [];

  return {
    conditions,
    markerCompounds: uniqueNames(
      conditions.flatMap((condition) => condition.markerCompounds)
    ),
    rmtReferenceCompounds: uniqueNames(
      conditions.flatMap((condition) => condition.rmtReferenceCompounds)
    ),
  };
};

const matchesTextFilter = (candidate, selected) => {
  if (!selected) {
    return true;
  }

  return normalizeTextKey(candidate) === normalizeTextKey(selected);
};

const matchesTemperatureFilter = (candidate, selected) => {
  if (selected === null || selected === undefined || selected === "") {
    return true;
  }

  const normalizedSelection = normalizeTemperature(selected);
  if (normalizedSelection === null) {
    return true;
  }

  return candidate === normalizedSelection;
};

export const toCeMsApiPolarity = (polarity) => {
  const normalizedPolarity = normalizeTextKey(polarity);

  if (normalizedPolarity === "inverse") {
    return "Reverse";
  }

  if (normalizedPolarity === "direct") {
    return "Direct";
  }

  if (normalizedPolarity === "reverse") {
    return "Reverse";
  }

  return polarity || "";
};

export const toCeMsMetadataIonizationMode = (ionizationMode) => {
  const normalizedMode = normalizeTextKey(ionizationMode);

  if (normalizedMode === "positive") {
    return "Positive";
  }

  if (normalizedMode === "negative") {
    return "Negative";
  }

  return ionizationMode || "";
};

export const getCeMsOptions = async () => {
  if (cachedCeMsOptions) {
    return cachedCeMsOptions;
  }

  if (!ceMsOptionsPromise) {
    ceMsOptionsPromise = axios
      .get(`${import.meta.env.VITE_API_URL}metadata/ce-ms-options`)
      .then((response) => {
        cachedCeMsOptions = normalizeCeMsOptions(response.data);
        return cachedCeMsOptions;
      })
      .finally(() => {
        ceMsOptionsPromise = null;
      });
  }

  return ceMsOptionsPromise;
};

export const getCeMsAllCompoundNames = (
  ceMsOptions = EMPTY_CE_MS_OPTIONS,
  compoundField
) => {
  if (!COMPOUND_FIELDS.includes(compoundField)) {
    return [];
  }

  const normalizedOptions =
    ceMsOptions && typeof ceMsOptions === "object"
      ? ceMsOptions
      : EMPTY_CE_MS_OPTIONS;

  return normalizedOptions[compoundField] || [];
};

export const getCeMsAvailableCompoundNames = (
  ceMsOptions = EMPTY_CE_MS_OPTIONS,
  compoundField,
  filters = {}
) => {
  if (!COMPOUND_FIELDS.includes(compoundField)) {
    return [];
  }

  const normalizedOptions =
    ceMsOptions && typeof ceMsOptions === "object"
      ? ceMsOptions
      : EMPTY_CE_MS_OPTIONS;

  return uniqueNames(
    (normalizedOptions.conditions || [])
      .filter((condition) =>
        matchesTextFilter(condition.bufferCode, filters.bufferCode)
      )
      .filter((condition) =>
        matchesTemperatureFilter(condition.temperature, filters.temperature)
      )
      .filter((condition) =>
        matchesTextFilter(condition.polarity, filters.polarity)
      )
      .filter((condition) =>
        matchesTextFilter(condition.ionizationMode, filters.ionizationMode)
      )
      .flatMap((condition) => condition[compoundField] || [])
  );
};

export const createEmptyCeMsOptions = () => EMPTY_CE_MS_OPTIONS;

export const __resetCeMsOptionsCache = () => {
  cachedCeMsOptions = null;
  ceMsOptionsPromise = null;
};
