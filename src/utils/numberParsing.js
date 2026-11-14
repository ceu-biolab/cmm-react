const DECIMAL_NUMBER_PATTERN = /^[-+]?(?:(?:\d+(?:[.,]\d*)?)|(?:[.,]\d+))(?:[eE][-+]?\d+)?$/;

export const normalizeDecimalString = (value) =>
  String(value ?? "").trim().replace(",", ".");

export const parseFlexibleNumber = (value) => {
  const normalized = normalizeDecimalString(value);

  if (!normalized || !DECIMAL_NUMBER_PATTERN.test(String(value ?? "").trim())) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

export const parseOptionalFlexibleNumber = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return null;
  }
  return parseFlexibleNumber(raw);
};

export const formatInputNumber = (value) => {
  const parsed = parseFlexibleNumber(value);
  return parsed === null ? "" : String(parsed);
};

export const splitMultiValueInput = (value) =>
  String(value ?? "")
    .split(/[;\r\n]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

export const parseNumberList = (value) => {
  const tokens = splitMultiValueInput(value);
  const values = [];
  const invalids = [];

  tokens.forEach((token) => {
    const parsed = parseFlexibleNumber(token);
    if (parsed === null) {
      invalids.push(token);
    } else {
      values.push(parsed);
    }
  });

  return { values, invalids };
};

export const parseRequiredNumberList = (value) => {
  const { values, invalids } = parseNumberList(value);
  return invalids.length ? [] : values;
};

const parsePeakToken = (token) => {
  const [mzRaw, intensityRaw, extra] = String(token).split(":");
  if (extra !== undefined) {
    return null;
  }

  const mz = parseFlexibleNumber(mzRaw);
  const intensity = parseFlexibleNumber(intensityRaw);

  if (mz === null || intensity === null) {
    return null;
  }

  return { mz, intensity };
};

export const splitSpectrumBlocks = (value) =>
  String(value ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

export const parsePeakList = (value) => {
  const tokens = splitMultiValueInput(value);
  const peaks = [];
  const invalids = [];

  tokens.forEach((token) => {
    const peak = parsePeakToken(token);
    if (!peak) {
      invalids.push(token);
    } else {
      peaks.push(peak);
    }
  });

  return { peaks, invalids };
};

export const parseCompositeSpectra = (value) => {
  const blocks = splitSpectrumBlocks(value);
  const spectra = [];
  const invalids = [];

  blocks.forEach((block, blockIndex) => {
    const { peaks, invalids: blockInvalids } = parsePeakList(block);
    if (blockInvalids.length) {
      invalids.push(
        ...blockInvalids.map((entry) => `Spectrum ${blockIndex + 1}: ${entry}`)
      );
      return;
    }

    const spectrum = peaks.reduce((acc, peak) => {
      acc[String(peak.mz)] = peak.intensity;
      return acc;
    }, {});

    spectra.push(spectrum);
  });

  return { spectra, invalids };
};

export const serializeNumberListForInput = (values = []) =>
  values.map(formatInputNumber).filter(Boolean).join("\n");

export const serializePeakListForInput = (peaks = []) =>
  peaks
    .map((peak) => {
      const mz = formatInputNumber(peak?.mz ?? peak?.mzValue);
      const intensity = formatInputNumber(peak?.intensity);
      return mz && intensity ? `${mz}:${intensity}` : null;
    })
    .filter(Boolean)
    .join("\n");

export const serializeCompositeSpectraForInput = (spectra = []) =>
  spectra
    .map((spectrum) =>
      Object.entries(spectrum || {})
        .map(([mz, intensity]) => `${formatInputNumber(mz)}:${formatInputNumber(intensity)}`)
        .filter((entry) => !entry.startsWith(":") && !entry.endsWith(":"))
        .join("\n")
    )
    .filter(Boolean)
    .join("\n\n");
