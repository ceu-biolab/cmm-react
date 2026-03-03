const isNil = (value) => value === null || value === undefined;

const toMaybeNumber = (value) => {
  if (isNil(value) || value === "") {
    return null;
  }
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const normalizeIdentifier = (value) => {
  if (isNil(value)) {
    return null;
  }
  const normalized = String(value).trim();
  if (!normalized) {
    return null;
  }
  const lower = normalized.toLowerCase();
  if (lower === "null" || lower === "undefined" || normalized === "0") {
    return null;
  }
  return normalized;
};

const firstMeaningfulValue = (source, keys) => {
  for (const key of keys) {
    if (Object.hasOwn(source, key) && !isNil(source[key])) {
      return source[key];
    }
  }
  return null;
};

const pickScoreValues = (scoreEntry = {}) => {
  const nestedScores =
    scoreEntry && typeof scoreEntry.scores === "object" ? scoreEntry.scores : {};

  const score = toMaybeNumber(
    firstMeaningfulValue(scoreEntry, [
      "score",
      "totalScore",
      "globalScore",
      "matchingScore",
      "cosineScore",
    ]) ?? firstMeaningfulValue(nestedScores, ["score", "total", "global"])
  );

  const rtScore = toMaybeNumber(
    firstMeaningfulValue(scoreEntry, ["rtScore"]) ??
      firstMeaningfulValue(nestedScores, ["rt", "retentionTime", "rtScore"])
  );

  const adductScore = toMaybeNumber(
    firstMeaningfulValue(scoreEntry, ["adductScore"]) ??
      firstMeaningfulValue(nestedScores, ["adduct", "adductScore"])
  );

  const ionizationScore = toMaybeNumber(
    firstMeaningfulValue(scoreEntry, ["ionizationScore"]) ??
      firstMeaningfulValue(nestedScores, ["ionization", "ionizationScore"])
  );

  return {
    score,
    rtScore,
    adductScore,
    ionizationScore,
  };
};

const mergeScores = (raw = {}) => {
  const directScore = toMaybeNumber(
    firstMeaningfulValue(raw, [
      "score",
      "cosineScore",
      "msmsCosineScore",
      "gcmsCosineScore",
    ])
  );

  const scoreEntries = Array.isArray(raw.scores) ? raw.scores : [];
  const fromEntries = scoreEntries
    .map((entry) => pickScoreValues(entry))
    .reduce(
      (acc, values) => ({
        score: acc.score ?? values.score,
        rtScore: acc.rtScore ?? values.rtScore,
        adductScore: acc.adductScore ?? values.adductScore,
        ionizationScore: acc.ionizationScore ?? values.ionizationScore,
      }),
      {
        score: null,
        rtScore: null,
        adductScore: null,
        ionizationScore: null,
      }
    );

  return {
    score: directScore ?? fromEntries.score,
    rtScore: fromEntries.rtScore,
    adductScore: fromEntries.adductScore,
    ionizationScore: fromEntries.ionizationScore,
  };
};

export const extractPathwayNames = (pathwaysValue) => {
  if (isNil(pathwaysValue) || pathwaysValue === "") {
    return [];
  }

  if (Array.isArray(pathwaysValue)) {
    return pathwaysValue
      .map((entry) => {
        if (typeof entry === "string") {
          return entry.trim();
        }
        if (entry && typeof entry === "object") {
          return (
            entry.pathwayName ||
            entry.name ||
            entry.pathway ||
            entry.label ||
            ""
          )
            .toString()
            .trim();
        }
        return "";
      })
      .filter(Boolean);
  }

  if (typeof pathwaysValue === "string") {
    return pathwaysValue
      .split(/[\n;]+/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
};

export const normalizeCompound = (rawCompound = {}) => {
  const pathways = extractPathwayNames(
    firstMeaningfulValue(rawCompound, ["pathways", "pathway", "pathwayNames"])
  );

  const {
    score,
    rtScore,
    adductScore,
    ionizationScore,
  } = mergeScores(rawCompound);

  return {
    ...rawCompound,
    compoundId: firstMeaningfulValue(rawCompound, ["compoundId", "id"]),
    compoundName: firstMeaningfulValue(rawCompound, [
      "compoundName",
      "name",
      "compound_name",
    ]),
    mass: toMaybeNumber(firstMeaningfulValue(rawCompound, ["mass"])),
    massErrorPpm: toMaybeNumber(
      firstMeaningfulValue(rawCompound, [
        "massErrorPpm",
        "ppmError",
        "ppmDifference",
        "errorPpm",
        "massPpmError",
        "massDifferencePpm",
        "deltaPPM",
        "deltaPpm",
        "error",
        "massError",
        "deltaMassPpm",
        "massErrorPpmPrecursorIon",
        "gcmsMassError",
        "deltaMass",
        "deltaPpmPrecursorIon",
      ])
    ),
    casID: normalizeIdentifier(
      firstMeaningfulValue(rawCompound, ["casID", "casId", "CAS"])
    ),
    keggID: normalizeIdentifier(
      firstMeaningfulValue(rawCompound, ["keggID", "keggId"])
    ),
    chebiID: normalizeIdentifier(
      firstMeaningfulValue(rawCompound, ["chebiID", "chebiId"])
    ),
    hmdbID: normalizeIdentifier(
      firstMeaningfulValue(rawCompound, ["hmdbID", "hmdbId"])
    ),
    lmID: normalizeIdentifier(firstMeaningfulValue(rawCompound, ["lmID", "lmId"])),
    pcID: normalizeIdentifier(firstMeaningfulValue(rawCompound, ["pcID", "pcId"])),
    knapsackID: normalizeIdentifier(
      firstMeaningfulValue(rawCompound, ["knapsackID", "knapsackId"])
    ),
    npatlasID: normalizeIdentifier(
      firstMeaningfulValue(rawCompound, ["npatlasID", "npatlasId"])
    ),
    pathways,
    pathway: pathways.join("; "),
    score,
    rtScore,
    adductScore,
    ionizationScore,
    gcmsCosineScore: toMaybeNumber(
      firstMeaningfulValue(rawCompound, ["gcmsCosineScore"])
    ),
    riError: toMaybeNumber(firstMeaningfulValue(rawCompound, ["deltaRI", "riError"])),
    experimentalRI: toMaybeNumber(
      firstMeaningfulValue(rawCompound, ["experimentalRI", "experimentalRi"])
    ),
    ccsError: toMaybeNumber(
      firstMeaningfulValue(rawCompound, ["ccsError", "deltaCcs", "ccsDifference"])
    ),
  };
};

export const normalizeAnnotation = (annotation = {}, fallbackId = null) => {
  const compoundLike = annotation.compound || annotation.gcmsCompound || annotation;

  const normalizedCompound = normalizeCompound(compoundLike);
  const normalizedAnnotation = normalizeCompound(annotation);

  return {
    ...normalizedCompound,
    compoundId: normalizedCompound.compoundId ?? fallbackId,
    massErrorPpm:
      normalizedAnnotation.massErrorPpm ?? normalizedCompound.massErrorPpm,
    score: normalizedAnnotation.score ?? normalizedCompound.score,
    rtScore: normalizedAnnotation.rtScore ?? normalizedCompound.rtScore,
    adductScore: normalizedAnnotation.adductScore ?? normalizedCompound.adductScore,
    ionizationScore:
      normalizedAnnotation.ionizationScore ?? normalizedCompound.ionizationScore,
    gcmsCosineScore:
      normalizedAnnotation.gcmsCosineScore ?? normalizedCompound.gcmsCosineScore,
    riError: normalizedAnnotation.riError ?? normalizedCompound.riError,
    experimentalRI:
      normalizedAnnotation.experimentalRI ?? normalizedCompound.experimentalRI,
    ccsError: normalizedAnnotation.ccsError ?? normalizedCompound.ccsError,
  };
};
