const ensureArray = (value) => (Array.isArray(value) ? value : []);

const normalizeResultEntries = (results = {}) =>
  Object.entries(results).map(([label, compounds]) => [
    label,
    ensureArray(compounds),
  ]);

export const groupsToResultMap = (
  groups = [],
  {
    labelKey = "adduct",
    compoundsKey = "compounds",
    fallbackLabel = "Group",
  } = {}
) =>
  ensureArray(groups).reduce((acc, group, index) => {
    const label = group?.[labelKey] || `${fallbackLabel} ${index + 1}`;
    const compounds = ensureArray(group?.[compoundsKey]);

    if (!acc[label]) {
      acc[label] = [];
    }

    acc[label].push(...compounds);
    return acc;
  }, {});

export const withExpectedGroupLabels = (results = {}, expectedLabels = []) => {
  const normalizedResults = {};

  ensureArray(expectedLabels).forEach((label) => {
    if (!label || normalizedResults[label]) {
      return;
    }
    normalizedResults[label] = [];
  });

  normalizeResultEntries(results).forEach(([label, compounds]) => {
    if (!normalizedResults[label]) {
      normalizedResults[label] = [];
    }
    normalizedResults[label].push(...compounds);
  });

  return normalizedResults;
};

export const groupsToResultMapWithExpectedLabels = (
  groups = [],
  expectedLabels = [],
  options = {}
) => withExpectedGroupLabels(groupsToResultMap(groups, options), expectedLabels);

export const countMatchedGroups = (results = {}) =>
  normalizeResultEntries(results).filter(([, compounds]) => compounds.length > 0).length;

export const hasAnyCompounds = (results = {}) =>
  normalizeResultEntries(results).some(([, compounds]) => compounds.length > 0);

export const resultMapToGroups = (
  results = {},
  {
    labelKey = "adduct",
    compoundsKey = "compounds",
  } = {}
) =>
  normalizeResultEntries(results).map(([label, compounds]) => ({
    [labelKey]: label,
    [compoundsKey]: compounds,
  }));

export const buildGroupedResultsView = (
  groups = [],
  expectedLabels = [],
  {
    labelKey = "adduct",
    compoundsKey = "compounds",
    fallbackLabel = "Group",
    outputLabelKey = "adduct",
    outputCompoundsKey = "compounds",
  } = {}
) => {
  const summaryResults = groupsToResultMapWithExpectedLabels(
    groups,
    expectedLabels,
    {
      labelKey,
      compoundsKey,
      fallbackLabel,
    }
  );
  const populatedSummaryResults = normalizeResultEntries(summaryResults).reduce(
    (acc, [label, compounds]) => {
      if (compounds.length > 0) {
        acc[label] = compounds;
      }
      return acc;
    },
    {}
  );

  return {
    summaryResults,
    displayGroups: resultMapToGroups(populatedSummaryResults, {
      labelKey: outputLabelKey,
      compoundsKey: outputCompoundsKey,
    }),
    matchedGroupCount: countMatchedGroups(summaryResults),
    hasCompounds: hasAnyCompounds(summaryResults),
  };
};

export const singleGroupResultMap = (label = "Results", compounds = []) => ({
  [label]: ensureArray(compounds),
});
