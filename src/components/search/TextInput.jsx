import { useState } from 'react';

const TextInput = ({ label, name, value, onChange, placeholder, className, required = false }) => {
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const val = e.target.value;

    if (!val && !required) {
      setError('');
      onChange(e);
      return;
    }

    if (!/^[-+]?\d*\.?\d*$/.test(val)) {
      setError('Please enter a valid number');
    } else {
      setError('');
      onChange(e);
    }
  };

  return (
    <div className={className}>
      <label className="inner-column-label">
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleInputChange}
        required={required}
        inputMode="decimal"
      />
      {error && <p style={{ color: 'red', fontSize: '0.8rem' }}>{error}</p>}
    </div>
  );
};

export default TextInput;