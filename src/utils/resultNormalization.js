const isNil = (value) => value === null || value === undefined;
const KEGG_PATHWAY_ID_PATTERN = /(map\d{5})/i;

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
    firstMeaningfulValue(scoreEntry, ["adductScore", "adductRelationScore"]) ??
      firstMeaningfulValue(nestedScores, [
        "adduct",
        "adductScore",
        "adductRelationScore",
      ])
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
  return extractPathwayEntries(pathwaysValue).map((entry) => entry.name);
};

const extractKeggPathwayId = (value) => {
  if (isNil(value)) {
    return null;
  }

  const normalized = String(value).trim();
  if (!normalized) {
    return null;
  }

  const match = normalized.match(KEGG_PATHWAY_ID_PATTERN);
  if (!match) {
    return null;
  }

  return match[1].toLowerCase();
};

const normalizePathwayEntry = (entry) => {
  if (isNil(entry)) {
    return null;
  }

  if (typeof entry === "string") {
    const raw = entry.trim();
    if (!raw) {
      return null;
    }
    const keggPathwayId = extractKeggPathwayId(raw);
    const cleanName = keggPathwayId
      ? raw.replace(KEGG_PATHWAY_ID_PATTERN, "").replace(/^[-:]\s*/, "").trim()
      : raw;
    const name = cleanName || raw;

    return {
      name,
      pathwayMap: keggPathwayId,
      keggPathwayId,
      keggPathwayUrl: keggPathwayId
        ? `https://www.kegg.jp/kegg-bin/show_pathway?${keggPathwayId}`
        : null,
    };
  }

  if (typeof entry === "object") {
    const rawName = firstMeaningfulValue(entry, [
      "pathwayName",
      "name",
      "pathway",
      "label",
      "title",
    ]);
    const rawMap = firstMeaningfulValue(entry, [
      "pathwayMap",
      "pathwayCode",
      "map",
      "code",
      "id",
    ]);

    const name = !isNil(rawName) ? String(rawName).trim() : "";
    const mapCandidate = !isNil(rawMap) ? String(rawMap).trim() : "";
    const keggPathwayId =
      extractKeggPathwayId(mapCandidate) || extractKeggPathwayId(name);

    if (!name && !mapCandidate) {
      return null;
    }

    return {
      name: name || mapCandidate,
      pathwayMap: mapCandidate || keggPathwayId,
      keggPathwayId,
      keggPathwayUrl: keggPathwayId
        ? `https://www.kegg.jp/kegg-bin/show_pathway?${keggPathwayId}`
        : null,
    };
  }

  return null;
};

export const extractPathwayEntries = (pathwaysValue) => {
  if (isNil(pathwaysValue) || pathwaysValue === "") {
    return [];
  }

  const sourceEntries = Array.isArray(pathwaysValue)
    ? pathwaysValue
    : typeof pathwaysValue === "string"
    ? pathwaysValue.split(/[\n;]+/).map((entry) => entry.trim())
    : [pathwaysValue];

  const seen = new Set();
  const normalized = [];

  sourceEntries.forEach((entry) => {
    const normalizedEntry = normalizePathwayEntry(entry);
    if (!normalizedEntry) {
      return;
    }

    const dedupeKey = `${normalizedEntry.name}|${
      normalizedEntry.keggPathwayId || ""
    }`;
    if (seen.has(dedupeKey)) {
      return;
    }

    seen.add(dedupeKey);
    normalized.push(normalizedEntry);
  });

  return normalized;
};

export const normalizeCompound = (rawCompound = {}) => {
  const pathwayEntries = extractPathwayEntries(
    firstMeaningfulValue(rawCompound, ["pathways", "pathway", "pathwayNames"])
  );
  const pathways = pathwayEntries.map((entry) => entry.name);

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
    pathwayEntries,
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
    dbCcs: toMaybeNumber(
      firstMeaningfulValue(rawCompound, [
        "dbCcs",
        "dbCCS",
        "referenceCcs",
        "databaseCcs",
      ])
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
    dbCcs: normalizedAnnotation.dbCcs ?? normalizedCompound.dbCcs,
  };
};
