const ExperimentalMassTextBox = ({ experimentalMasses, onChange }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        console.log("File content:", text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="inner-column">
      <label className="inner-column-label">Experimental Masses</label>
      <textarea
        name="experimentalMasses"
        className="experimentalMasses"
        value={experimentalMasses}
        onChange={onChange}
        placeholder="Enter mass values (comma separated)"
        rows="6"
        cols="34"
      />
      {/* File Upload Button with SVG Icon */}
      <label htmlFor="file-upload" className="custom-file-upload">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-file-earmark-arrow-up-fill"
          viewBox="0 0 16 16"
        >
          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z" />
        </svg>
      </label>
      <input
        type="file"
        id="file-upload"
        accept=".txt,.csv"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default ExperimentalMassTextBox;
