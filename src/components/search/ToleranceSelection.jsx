const ToleranceSelection = ({ searchData, onChange }) => {
  return (
    <div className="tolerance-div">
      <label className="inner-column-label">Tolerance</label>
      <input
        type="text"
        name="tolerance"
        value={searchData.tolerance}
        onChange={onChange}
      />
      <label>
        <input
          className="radio"
          type="radio"
          name="toleranceType"
          value="ppm"
          checked={searchData.toleranceType === "ppm"}
          onChange={onChange}
        />
        ppm
      </label>
      <label>
        <input
          className="radio"
          type="radio"
          name="toleranceType"
          value="mDa"
          checked={searchData.toleranceType === "mDa"}
          onChange={onChange}
        />
        mDa
      </label>
    </div>
  );
};

export default ToleranceSelection;
