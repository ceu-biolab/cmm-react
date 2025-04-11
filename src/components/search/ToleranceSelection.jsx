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
          name="toleranceMode"
          value="ppm"
          checked={searchData.toleranceMode === "ppm"}
          onChange={onChange}
        />
        ppm
      </label>
      <label>
        <input
          className="radio"
          type="radio"
          name="toleranceMode"
          value="mDa"
          checked={searchData.toleranceMode === "mDa"}
          onChange={onChange}
        />
        mDa
      </label>
    </div>
  );
};

export default ToleranceSelection;
