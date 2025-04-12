// RadioGroup.jsx
const GroupRadio = ({
  label,
  name,
  value,
  options,
  onChange,
  className = "",
}) => (
  <div className={`radio-group-div ${className}`}>
    <label className="inner-column-label">{label}</label>
    <div>
      {options.map((option) => (
        <label key={option} className="box">
          <input
            className="radio"
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={onChange}
          />
          {option}
        </label>
      ))}
    </div>
  </div>
);

export default GroupRadio;
