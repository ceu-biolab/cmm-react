const ToleranceSelection = ({ onChange }) => {
  return (
    <div className="tolerance-div">
      <label className="inner-column-label">Tolerance</label>
      <input type="text" name="tolerance" defaultValue="10" />
      <label>
        <input
          className="radio"
          type="radio"
          name="toleranceType"
          value="ppm"
          defaultChecked
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
          onChange={onChange}
        />
        mDa
      </label>
    </div>
  );
};

export default ToleranceSelection;
