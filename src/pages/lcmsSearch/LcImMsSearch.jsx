import { useState, useEffect } from "react";
import axios from "axios";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes.jsx";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup.jsx";
import TextBoxInput from "../../components/search/TextBoxInput.jsx";
import GroupRadio from "../../components/search/GroupRadio.jsx";
import ToleranceRadio from "../../components/search/ToleranceRadio.jsx";
import { formatApiError } from "../../utils/apiError";
import { normalizeAnnotation } from "../../utils/resultNormalization";

const LcImMsSearch = () => {
  const [formState, setFormState] = useState({
    mzValues: "",
    ccsValues: "",
    rtValues: "",
    mzTolerance: "",
    mzToleranceMode: "PPM",
    ccsTolerance: "",
    ccsToleranceMode: "PERCENTAGE",
    formulaType: "CHNOPS",
    deuterium: false,
    bufferGas: "N2",
    ionizationMode: "POSITIVE",
    adducts: [],
  });

  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const loadDemoData = () => {
    setFormState({
      mzValues: ["400.3432", "281.24765"].join(", "),
      ccsValues: ["202.881", "178.546"].join(", "),
      rtValues: ["8.5", "6.2"].join(", "),
      mzTolerance: "10",
      mzToleranceMode: "PPM",
      ccsTolerance: "2",
      ccsToleranceMode: "PERCENTAGE",
      formulaType: "CHNOPS",
      deuterium: false,
      bufferGas: "N2",
      ionizationMode: "POSITIVE",
      adducts: ["[M+H]+"],
    });
  };

  const clearInput = () => {
    setFormState({
      mzValues: "",
      ccsValues: "",
      rtValues: "",
      mzTolerance: "",
      mzToleranceMode: "PPM",
      ccsTolerance: "",
      ccsToleranceMode: "PERCENTAGE",
      formulaType: "CHNOPS",
      deuterium: false,
      bufferGas: "N2",
      ionizationMode: "POSITIVE",
      adducts: [],
    });
  };

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormState((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value || "" }));
    }
  };

  const handleAdductsChange = (adducts) => {
    setFormState((prev) => ({ ...prev, adducts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parseNumericValues = (rawValue) =>
      (rawValue || "")
        .split(/[\s,;]+/)
        .filter(Boolean)
        .map((entry) => Number(entry))
        .filter((entry) => Number.isFinite(entry));

    const mzValues = parseNumericValues(formState.mzValues);
    const ccsValues = parseNumericValues(formState.ccsValues);
    const rtValues = parseNumericValues(formState.rtValues);

    if (!mzValues.length || !ccsValues.length || !rtValues.length) {
      alert("Masses, CCS values, and RT values are all required.");
      return;
    }

    if (
      mzValues.length !== ccsValues.length ||
      mzValues.length !== rtValues.length
    ) {
      alert("Masses, CCS values, and RT values must have the same length.");
      return;
    }

    const formattedData = {
      mzValues,
      ccsValues,
      rtValues,
      mzTolerance: parseFloat(formState.mzTolerance),
      mzToleranceMode: formState.mzToleranceMode,
      ccsTolerance: parseFloat(formState.ccsTolerance),
      ccsToleranceMode: formState.ccsToleranceMode,
      formulaType: formState.formulaType,
      ionizationMode: formState.ionizationMode,
      bufferGas: formState.bufferGas,
      adducts: formState.adducts,
      deuterium: formState.deuterium,
    };

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}ccs`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;
      const groupedByAdduct = {};
      const features = rawResults.imFeatures || rawResults;

      features.forEach((feature, featureIndex) => {
        feature.annotationsByAdducts?.forEach((adductGroup) => {
          const { adduct, annotations } = adductGroup;
          if (!groupedByAdduct[adduct]) {
            groupedByAdduct[adduct] = [];
          }

          annotations?.forEach((annotation, annotationIndex) => {
            groupedByAdduct[adduct].push(
              normalizeAnnotation(
                annotation,
                `${adduct}-${featureIndex}-${annotationIndex}`
              )
            );
          });
        });
      });

      setResults(groupedByAdduct);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting search:", error.response || error);
      alert(formatApiError(error, { action: "submit your search" }));
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
        <span className="title-text">LC-IM-MS Search</span>
      </header>

      <div
        className="page outer-container row"
        style={{ cursor: loading ? "wait" : "default" }}
      >
        <label className="required-label">
          Required <span className="red-asterisk">*</span>
        </label>
        <form onSubmit={handleSubmit}>
          <div className="grid-container-lc-im-ms">
            <TextBoxInput
              label={
                <>
                  Experimental Masses <span style={{ color: "red" }}>*</span>
                </>
              }
              name="mzValues"
              value={formState.mzValues}
              onChange={handleChange}
              className="masses-text-lc-im-ms"
              required
            />

            <TextBoxInput
              label={
                <>
                  CCS Values <span style={{ color: "red" }}>*</span>
                </>
              }
              name="ccsValues"
              value={formState.ccsValues}
              onChange={handleChange}
              className="ccs-values-lc-im-ms"
              placeholder="Enter CCS values (comma separated)"
              required
            />

            <TextBoxInput
              label={
                <>
                  RT Values <span style={{ color: "red" }}>*</span>
                </>
              }
              name="rtValues"
              value={formState.rtValues}
              onChange={handleChange}
              className="rt-values-lc-im-ms"
              placeholder="Enter RT values (comma separated)"
              required
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
              modeName="mzToleranceMode"
              className="tolerance-lc-im-ms"
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
              className="ccs-tolerance-lc-im-ms"
            />

            <GroupRadio
              label={
                <>
                  Chemical Alphabet <span style={{ color: "red" }}>*</span>
                </>
              }
              name="formulaType"
              value={formState.formulaType}
              options={["ALL", "CHNOPS", "CHNOPSD", "CHNOPSCL", "CHNOPSCLD"]}
              onChange={handleChange}
              className="chem-alph-lc-im-ms"
            />

            <GroupRadio
              label={
                <>
                  Modifiers <span style={{ color: "red" }}>*</span>
                </>
              }
              name="bufferGas"
              value={formState.bufferGas}
              options={["N2", "He"]}
              onChange={handleChange}
              className="modifiers-lc-im-ms"
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
              className="adducts-lc-im-ms"
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
              className="ionization-lc-im-ms"
            />

            <div className="deuterium-lc-im-ms">
              <label>
                <input
                  type="checkbox"
                  name="deuterium"
                  checked={formState.deuterium}
                  onChange={handleChange}
                />
                Deuterium
              </label>
            </div>
          </div>

          <div className="form-buttons-container center-button">
            <button type="submit">
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

export default LcImMsSearch;
