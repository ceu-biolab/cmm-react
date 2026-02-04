import { useState, useEffect } from "react";
import axios from "axios";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes.jsx";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup.jsx";
import TextBoxInput from "../../components/search/TextBoxInput.jsx";
import TextInput from "../../components/search/TextInput.jsx";
import GroupRadio from "../../components/search/GroupRadio.jsx";
import ToleranceRadio from "../../components/search/ToleranceRadio.jsx";

const ImMsSearch = () => {
  const [formState, setFormState] = useState({
    mzValues: "",
    ccsValues: "",
    mzTolerance: "",
    mzToleranceMode: "PPM",
    ccsTolerance: "",
    ccsToleranceMode: "PERCENTAGE",
    ionizationMode: "POSITIVE",
    bufferGas: "N2",
    adducts: [],
    formulaType: "CHNOPS",
  });

  const loadDemoData = () => {
    console.log("Loading demo data...");
    setFormState({
      mzValues: ["400.3432", "281.24765"].join(", "),
      ccsValues: ["202.881", "178.546"].join(", "),
      mzTolerance: "10",
      mzToleranceMode: "PPM",
      ccsTolerance: "2",
      ccsToleranceMode: "PERCENTAGE",
      formulaType: "CHNOPS",
      bufferGas: "N2",
      ionizationMode: "POSITIVE",
      adducts: ["[M+H]+"],
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      mzValues: "",
      ccsValues: "",
      mzTolerance: "",
      mzToleranceMode: "PPM",
      ccsTolerance: "",
      ccsToleranceMode: "PERCENTAGE",
      formulaType: "CHNOPS",
      bufferGas: "N2",
      ionizationMode: "POSITIVE",
      adducts: [],
    });
  };

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      return;
    } else {
      setFormState((prev) => ({ ...prev, [name]: value ?? "" }));
    }
  };

  const handleAdductsChange = (adducts) => {
    setFormState((prev) => ({ ...prev, adducts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedData = {
      mzValues: formState.mzValues.split(/[\s,;]+/).map(parseFloat),
      ccsValues: formState.ccsValues.split(/[\s,;]+/).map(parseFloat),
      mzTolerance: parseFloat(formState.mzTolerance),
      mzToleranceMode: formState.mzToleranceMode,
      ccsTolerance: parseFloat(formState.ccsTolerance),
      ccsToleranceMode: formState.ccsToleranceMode,
      formulaType: formState.formulaType,
      ionizationMode: formState.ionizationMode,
      bufferGas: formState.bufferGas,
      adducts: formState.adducts,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}ccs`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;
      console.log(rawResults);

      const groupedByAdduct = {};

      const features = rawResults.imFeatures || rawResults;

      features.forEach((featureObj) => {
        featureObj.annotationsByAdducts?.forEach((adductGroup) => {
          const { adduct, annotations } = adductGroup;
          if (!groupedByAdduct[adduct]) {
            groupedByAdduct[adduct] = [];
          }

          annotations?.forEach(({ compound }) => {
            if (compound) {
              groupedByAdduct[adduct].push(compound);
            }
          });
        });
      });

      setResults(groupedByAdduct);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting search:", error.response || error);
      alert("There was an error submitting your search");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}

      <header className="title-header">
        <span className="title-text">IM-MS Search</span>
      </header>

      <div
        className="page outer-container row"
        style={{ cursor: loading ? "wait" : "default" }}
      >
        <label className="required-label">
          Required <span className="red-asterisk">*</span>
        </label>
        <form onSubmit={handleSubmit}>
          <div className="grid-container-im-ms">
            <TextBoxInput
              label={
                <>
                  Experimental Masses <span style={{ color: "red" }}>*</span>
                </>
              }
              name="mzValues"
              value={formState.mzValues}
              onChange={handleChange}
              className="masses-text-im-ms"
            />

            <TextBoxInput
              label="CCS Values"
              name="ccsValues"
              value={formState.ccsValues}
              onChange={handleChange}
              className="ccs-values-im-ms"
              placeholder="Enter CCS values (comma separated)"
            />

            <ToleranceRadio
              label={
                <>
                  Tolerance <span style={{ color: "red" }}>*</span>
                </>
              }
              toleranceValue={formState.mzTolerance}
              mzToleranceMode={formState.mzToleranceMode}
              onChange={handleChange}
              inputName="mzTolerance"
              className="tolerance-im-ms"
            />

            <ToleranceRadio
              label={
                <>
                  CCS Tolerance <span style={{ color: "red" }}>*</span>
                </>
              }
              toleranceValue={formState.ccsTolerance}
              mzToleranceMode={formState.ccsToleranceMode}
              onChange={handleChange}
              unitOptions={["PERCENTAGE", "ABSOLUTE"]}
              inputName="ccsTolerance"
              modeName="ccsToleranceMode"
              className="ccs-tolerance-im-ms"
            />

            <GroupRadio
              label={
                <>
                  Formula Type <span style={{ color: "red" }}>*</span>
                </>
              }
              name="formulaType"
              value={formState.formulaType}
              options={["ALL", "CHNOPS", "CHNOPSD", "CHNOPSCL", "CHNOPSCLD"]}
              onChange={handleChange}
              className="chem-alph-im-ms"
            />

            <GroupRadio
              label={
                <>
                  Buffer Gas <span style={{ color: "red" }}>*</span>
                </>
              }
              name="bufferGas"
              value={formState.bufferGas}
              options={["N2", "He"]}
              onChange={handleChange}
              className="modifiers-im-ms"
            />

            <AdductsCheckboxes
              label={
                <>
                  Adducts <span style={{ color: "red" }}>*</span>
                </>
              }
              selectedAdducts={formState.adducts}
              onSelectionChange={handleAdductsChange}
              ionizationMode={formState.ionizationMode}
              name="adducts"
              className="adducts-im-ms"
            />

            <GroupRadio
              label={
                <>
                  Ionization Mode <span style={{ color: "red" }}>*</span>
                </>
              }
              name="ionizationMode"
              value={formState.ionizationMode}
              options={["POSITIVE", "NEGATIVE"]}
              onChange={handleChange}
              className="ionization-im-ms"
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

        <div className="results-div">
          {showResults &&
            Object.entries(results).map(([adduct, compounds]) => (
              <ResultsDropdownGroup
                key={adduct}
                adduct={adduct}
                compounds={compounds}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ImMsSearch;
