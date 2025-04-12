const TextInput = ({ label, name, value, onChange, placeholder, className }) => {
  return (
    <div className={className}>
      <label className="inner-column-label">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default TextInput;