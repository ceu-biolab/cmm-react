const MetabolitesSelection = ({ onChange }) => (
  <div className="metabolites-div">
    <label className="inner-column-label">Metabolites</label>
    <div>
      {["all-except-peptides", "only-lipids", "all-including-peptides"].map(
        (option) => (
          <label key={option} className="box">
            <input
              className="radio"
              type="radio"
              name="metabolites"
              value={option}
              defaultChecked={option === "all-except-peptides"}
              onChange={onChange}
            />
            {option === "all-except-peptides"
              ? "All except peptides"
              : option === "only-lipids"
              ? "Only lipids"
              : "All including peptides"}
          </label>
        )
      )}
    </div>
  </div>
);

export default MetabolitesSelection;
