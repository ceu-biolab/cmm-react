const ExperimentalMassInput = ({ experimentalMass, onChange }) => {
  return (
    <div className="experimental-mass-div">
      <label className="inner-column-label">Experimental Mass</label>
      <input
        type="text"
        name="experimentalMass"
        value={experimentalMass}
        placeholder="Enter mass value"
        onChange={onChange}
      />
    </div>
  );
};

export default ExperimentalMassInput;
