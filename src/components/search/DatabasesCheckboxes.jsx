const DatabasesSelection = ({ selectedDatabases, onChange }) => {
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
              defaultChecked={selectedDatabases.includes(db)}
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
