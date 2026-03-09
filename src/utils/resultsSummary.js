export const groupsToResultMap = (
  groups = [],
  {
    labelKey = "adduct",
    compoundsKey = "compounds",
    fallbackLabel = "Group",
  } = {}
) =>
  (Array.isArray(groups) ? groups : []).reduce((acc, group, index) => {
    const label = group?.[labelKey] || `${fallbackLabel} ${index + 1}`;
    const compounds = Array.isArray(group?.[compoundsKey])
      ? group[compoundsKey]
      : [];

    if (!acc[label]) {
      acc[label] = [];
    }

    acc[label].push(...compounds);
    return acc;
  }, {});

export const singleGroupResultMap = (label = "Results", compounds = []) => ({
  [label]: Array.isArray(compounds) ? compounds : [],
});
