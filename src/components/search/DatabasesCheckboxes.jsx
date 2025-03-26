const DatabasesSelection = () => {
  // Static selection for checked databases
  const selectedDatabases = [
    "HMDB",
    "LipidMaps",
    "Kegg", // Add any databases you want to show as selected
  ];

  return (
    <div className="databases-div">
      <label>Databases</label>
      <div className="checkboxes">
        {[
          "All (Including In Silico Compounds)",
          "HMDB",
          "LipidMaps",
          "Kegg",
          "In-house",
          "Aspergillus",
          "FAHFA Lipids",
        ].map((db) => (
          <label key={db}>
            <input
              className="checkbox"
              type="checkbox"
              name="databases"
              value={db}
              checked={selectedDatabases.includes(db)} // Static check
              disabled // Disabled to make it read-only for now
            />
            {db}
          </label>
        ))}
      </div>
    </div>
  );
};

export default DatabasesSelection;