const DatabasesSelection = ({
  selectedDatabases,
  onChange,
  className = "",
  label = "Databases",
}) => {
  return (
    <div className={`databases-div ${className}`}>
      <label className="inner-column-label">{label}</label>
      <div className="checkboxes">
        {[
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
        ].map((db) => (
          <label key={db}>
            <input
              className="checkbox"
              type="checkbox"
              name="databases"
              value={db}
              checked={selectedDatabases.includes(db)}
              onChange={onChange}
            />
            {db}
          </label>
        ))}
      </div>
    </div>
  );
};

export default DatabasesSelection;
