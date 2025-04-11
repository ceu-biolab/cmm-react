const MetabolitesSelection = ({ searchData, onChange }) => (
  <div className="metabolites-div">
    <label className="inner-column-label">Metabolites</label>
    <div>
      {["All except peptides", "ONLYLIPIDS", "All including peptides"].map(
        (option) => (
          <label key={option} className="box">
            <input
              className="radio"
              type="radio"
              name="metaboliteType"
              value={option}
              checked={searchData.metaboliteType === option}
              onChange={onChange}
            />
            {option}
          </label>
        )
      )}
    </div>
  </div>
);

export default MetabolitesSelection;
