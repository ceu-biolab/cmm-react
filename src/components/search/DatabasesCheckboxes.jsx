import { DATABASE_OPTIONS } from "../../utils/databaseSelection";

const DatabasesSelection = ({
  selectedDatabases,
  onChange,
  className = "",
  label = "Databases",
}) => {
  const nonAllDatabases = DATABASE_OPTIONS.filter((db) => db !== "ALL");
  const allSelected = nonAllDatabases.every((db) =>
    selectedDatabases.includes(db)
  );

  return (
    <div className={`databases-div ${className}`}>
      <label className="inner-column-label">{label}</label>
      <div className="checkboxes">
        {DATABASE_OPTIONS.map((db) => (
          <label key={db}>
            <input
              className="checkbox"
              type="checkbox"
              name="databases"
              value={db}
              checked={db === "ALL" ? allSelected : selectedDatabases.includes(db)}
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
