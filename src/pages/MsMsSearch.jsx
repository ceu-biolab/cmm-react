import { useState, useEffect } from "react";
import axios from "axios";
import TextInput from "../components/search/TextInput.jsx";
import TextBoxInput from "../components/search/TextBoxInput.jsx";
import ToleranceRadio from "../components/search/ToleranceRadio.jsx";
import ResultsDropdownGroup from "../components/search/ResultsDropdownGroup";
import searchIcon from "../assets/svgs/search-svg.svg";

const MsMsSearch = () => {
  const [formState, setFormState] = useState({
    mz: "",
    msmsPeaks: [],
    precursorTolerance: "",
    precursorToleranceMode: "Da",
    mzTolerance: "",
    mzToleranceMode: "Da",
    ionizationMode: "Positive",
    ionizationVoltage: "Low (10V)",
    spectraType: "Experimental",
  });

  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const loadDemoData = () => {
    console.log("Loading demo data...");
    setFormState({
      mz: "147.0000",
      msmsPeaks: [
        "40.948",
        "0.174",
        "56.022",
        "0.424",
        "84.37",
        "53.488",
        "101.50",
        "8.285",
        "102.401",
        "0.775",
        "129.670",
        "100.000",
        "146.966",
        "20.070",
      ],
      precursorTolerance: "0.1",
      precursorToleranceMode: "Da",
      mzTolerance: "0.5",
      mzToleranceMode: "Da",
      ionizationMode: "Positive",
      ionizationVoltage: "Low (10V)",
      spectraType: "Experimental",
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      mz: "",
      msmsPeaks: [],
      precursorTolerance: "0.1",
      precursorToleranceMode: "Da",
      mzTolerance: "0.5",
      mzToleranceMode: "Da",
      ionizationMode: "Positive",
      ionizationVoltage: "Low (10V)",
      spectraType: "Experimental",
    });
  };

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      mz: parseFloat(formState.mz),
      msmsPeaks: parseFloat(formState.tolerance),
      precursorTolerance: parseFloat(formState.precursorTolerance),
      precursorToleranceMode: formState.precursorToleranceMode,
      mzTolerance: parseFloat(formState.mzTolerance),
      mzToleranceMode: formState.mzToleranceMode,
      ionizationMode: formState.ionizationMode,
      ionizationVoltage: formState.ionizationVoltage,
      spectraType: formState.spectraType,
    };

    console.log("Sending to backend:", JSON.stringify(formattedData, null, 2));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}compounds/msms-search`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;

      console.log("Raw results:", rawResults);

      setResults(rawResults);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting search:", error.response || error);
      alert("There was an error submitting your search");
    }
  };

  return (
    <div className="page">
      <header className="title-header">
        <img src={searchIcon} alt="Search Icon" className="icon" />
        <span className="title-text">MS/MS Search</span>
      </header>

      <div className="page outer-container row">
        <form onSubmit={handleSubmit}>
          <div className="grid-container">
            <TextInput
              label="Precursor Ion Mass"
              name="mz"
              value={formState.mz}
              onChange={handleChange}
              placeholder="Enter m/z value"
              className="experimental-mass-div"
            />

            <TextBoxInput
              label="MS/MS Peak List"
              name="msmsPeakList"
              value={formState.msmsPeakList}
              onChange={handleChange}
            />

            <ToleranceRadio
              label="Precursor Ion Tolerance"
              inputName="precursorTolerance"
              modeName="precursorToleranceMode"
              toleranceValue={formState.precursorTolerance}
              toleranceMode={formState.precursorToleranceMode}
              unitOptions={["ppm", "Da"]}
              onChange={handleChange}
            />

            <ToleranceRadio
              label="M/Z Tolerance"
              inputName="mzTolerance"
              modeName="mzToleranceMode"
              toleranceValue={formState.mzTolerance}
              toleranceMode={formState.mzToleranceMode}
              unitOptions={["ppm", "Da"]}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons-container center-button">
            <button type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </form>

        <div className="align-buttons-container">
          <div className="other-buttons">
            <div className="form-buttons-container">
              <button type="button" onClick={loadDemoData}>
                Load Demo Data
              </button>
            </div>
            <div className="form-buttons-container">
              <button type="button" onClick={clearInput}>
                Clear Input
              </button>
            </div>
          </div>
        </div>

        {showResults && (
          <div className="results-div">
            <div className="search-compounds-found-div">
              <div className="results-count">{totalCompounds}</div>
              <div className="results-count-text">
                Compound{totalCompounds !== 1 ? "s" : ""} found
              </div>
            </div>

            {Object.entries(results).map(([adduct, compounds]) => (
              <ResultsDropdownGroup
                key={adduct}
                adduct={adduct}
                compounds={compounds}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MsMsSearch;
