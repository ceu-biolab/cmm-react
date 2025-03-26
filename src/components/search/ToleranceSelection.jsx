const ToleranceSelection = () => (
  <div className="tolerance-div">
    <label className="inner-column-label">Tolerance</label>
    {/* Static value for the input field */}
    <input
      type="text"
      name="tolerance"
      defaultValue="10" // Set a default value here, like "10"
    />
    <label>
      {/* Static radio buttons without state */}
      <input
        className="radio"
        type="radio"
        name="toleranceType"
        value="ppm"
        defaultChecked // Set the default checked value
      />
      ppm
    </label>
    <label>
      <input className="radio" type="radio" name="toleranceType" value="mDa" />
      mDa
    </label>
  </div>
);

export default ToleranceSelection;
