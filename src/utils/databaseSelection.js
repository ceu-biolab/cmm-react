export const DATABASE_OPTIONS = [
  "ALL",
  "HMDB",
  "LIPIDMAPS",
  "CHEBI",
  "KEGG",
  "INHOUSE",
  "ASPERGILLUS",
  "FAHFA",
  "NPATLAS",
  "PUBCHEM",
];

export const DEFAULT_DATABASES = [
  "HMDB",
  "LIPIDMAPS",
  "KEGG",
  "INHOUSE",
  "FAHFA",
];

const NON_ALL_DATABASES = DATABASE_OPTIONS.filter((entry) => entry !== "ALL");

export const normalizeDatabasesSelection = (selectedDatabases = []) => {
  const uniqueSelected = Array.from(
    new Set(selectedDatabases.filter((entry) => DATABASE_OPTIONS.includes(entry)))
  );

  const selectedWithoutAll = uniqueSelected.filter((entry) => entry !== "ALL");
  const hasEveryDatabase = NON_ALL_DATABASES.every((entry) =>
    selectedWithoutAll.includes(entry)
  );

  const nextSelection = hasEveryDatabase
    ? ["ALL", ...selectedWithoutAll]
    : selectedWithoutAll;

  return DATABASE_OPTIONS.filter((entry) => nextSelection.includes(entry));
};

export const toggleDatabaseSelection = (
  selectedDatabases = [],
  value,
  checked
) => {
  if (!DATABASE_OPTIONS.includes(value)) {
    return normalizeDatabasesSelection(selectedDatabases);
  }

  if (value === "ALL") {
    return checked ? [...DATABASE_OPTIONS] : [];
  }

  const currentWithoutAll = new Set(
    selectedDatabases.filter(
      (entry) => entry !== "ALL" && DATABASE_OPTIONS.includes(entry)
    )
  );

  if (checked) {
    currentWithoutAll.add(value);
  } else {
    currentWithoutAll.delete(value);
  }

  return normalizeDatabasesSelection(Array.from(currentWithoutAll));
};
