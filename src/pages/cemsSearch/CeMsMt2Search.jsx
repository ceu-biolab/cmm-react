import { useState, useEffect } from "react";
import axios from "axios";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes.jsx";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup.jsx";
import TextBoxInput from "../../components/search/TextBoxInput.jsx";
import TextInput from "../../components/search/TextInput.jsx";
import GroupRadio from "../../components/search/GroupRadio.jsx";
import ToleranceRadio from "../../components/search/ToleranceRadio.jsx";

const CeMsMt2Search = () => {
  const [formState, setFormState] = useState({
    masses: "",
    mt: "",
    tolerance: "",
    tolerance_mode: "PPM",
    mt_tolerance: "",
    mt_tolerance_mode: "percentage",
    buffer: "FORMIC_ACID_1M",
    temperature: "",
    polarity: "Direct",
    marker1: "",
    marker1_time: "",
    marker2: "",
    marker2_time: "",
    chemical_alphabet: "CHNOPS",
    ion_mode: "positive",
    adducts: [],
  });

  const loadDemoData = () => {
    setFormState({
      masses: ["291.1299", "298.098", "308.094", "316.2488", "55.055"].join(
        ", "
      ),
      tolerance: "10",
      tolerance_mode: "PPM",
      mt: ["11.56", "13.65", "15.62", "12.59", "6.99"].join(", "),
      mt_tolerance: "10",
      mt_tolerance_mode: "percentage",
      buffer: "FORMIC_ACID_1M",
      temperature: "20",
      polarity: "Direct",
      marker1: "L-Methionine sulfone",
      marker1_time: "14.24",
      marker2: "Hippuric acid",
      marker2_time: "25.29",
      chemical_alphabet: "CHNOPS",
      ion_mode: "positive",
      adducts: [
        "[M+H]+",
        "[M+2H]2+",
        "[M+Na]+",
        "[M+K]+",
        "[M+NH4]+",
        "[M+H-H2O]+",
      ],
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      masses: "",
      mt: "",
      tolerance: "",
      tolerance_mode: "PPM",
      mt_tolerance: "",
      mt_tolerance_mode: "percentage",
      buffer: "FORMIC_ACID_1M",
      temperature: "",
      polarity: "Direct",
      marker1: "",
      marker1_time: "",
      marker2: "",
      marker2_time: "",
      chemical_alphabet: "CHNOPS",
      ion_mode: "positive",
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
      if (name === "adducts") {
        setFormState((prev) => ({
          ...prev,
          adducts: checked
            ? [...prev.adducts, value]
            : prev.adducts.filter((adduct) => adduct !== value),
        }));
      }
    } else {
      setFormState((prev) => ({ ...prev, [name]: value ?? "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedData = {
      masses: formState.masses
        .split(/[\s,;]+/)
        .filter(Boolean)
        .map(parseFloat),
      mt: formState.mt
        .split(/[\s,;]+/)
        .filter(Boolean)
        .map(parseFloat),
      tolerance: parseFloat(formState.tolerance),
      tolerance_mode: formState.tolerance_mode,
      mt_tolerance: parseFloat(formState.mt_tolerance),
      mt_tolerance_mode: formState.mt_tolerance_mode,
      buffer: formState.buffer,
      temperature: formState.temperature
        ? parseFloat(formState.temperature)
        : null,
      polarity: formState.polarity,
      marker1: formState.marker1,
      marker1_time: formState.marker1_time
        ? parseFloat(formState.marker1_time)
        : null,
      marker2: formState.marker2,
      marker2_time: formState.marker2_time
        ? parseFloat(formState.marker2_time)
        : null,
      chemical_alphabet: formState.chemical_alphabet,
      ion_mode: formState.ion_mode,
      adducts: formState.adducts,
    };

    console.log("Sending to backend:", JSON.stringify(formattedData, null, 2));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}CEMS2Marker`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;
      console.log(rawResults);

      const rawFeatures = rawResults.ceFeatures || rawResults.imFeatures || [];

      const features = rawFeatures.map((item) => {
        const annotationsByAdducts =
          item.annotationsByAdducts?.map((adductGroup) => {
            const annotations =
              adductGroup.annotations
                ?.filter((a) => a.compound)
                ?.map((a) => ({
                  ...a,
                  ...a.compound,
                })) || [];

            return {
              adduct: adductGroup.adduct,
              annotations,
            };
          }) || [];

        const hasResults = annotationsByAdducts.some(
          (group) => group.annotations.length > 0
        );

        return {
          feature: item.feature,
          annotationsByAdducts,
          hasResults,
        };
      });

      setResults(features);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting search:", error.response || error);
      alert("There was an error submitting your search");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page cemspage">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}

      <header className="title-header">
        <span className="title-text">CE-MS MT 2 Marker Search</span>
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
              name="masses"
              value={formState.masses}
              onChange={handleChange}
              className="masses-text-im-ms"
              placeholder="Enter experimental masses (comma separated)"
            />

            <TextBoxInput
              label="Migration Times (MT)"
              name="mt"
              value={formState.mt}
              onChange={handleChange}
              className="ccs-values-im-ms"
              placeholder="Enter migration times (comma separated)"
            />

            <ToleranceRadio
              label={
                <>
                  Tolerance <span style={{ color: "red" }}>*</span>
                </>
              }
              toleranceValue={formState.tolerance}
              mzToleranceMode={formState.tolerance_mode}
              onChange={handleChange}
              unitOptions={["PPM", "DA"]}
              inputName="tolerance"
              modeName="tolerance_mode"
              className="tolerance-im-ms"
            />

            <ToleranceRadio
              label={
                <>
                  MT / CCS Tolerance <span style={{ color: "red" }}>*</span>
                </>
              }
              toleranceValue={formState.mt_tolerance}
              mzToleranceMode={formState.mt_tolerance_mode}
              onChange={handleChange}
              unitOptions={["percentage", "absolute"]}
              inputName="mt_tolerance"
              modeName="mt_tolerance_mode"
              className="ccs-tolerance-im-ms"
            />

            <GroupRadio
              label={
                <>
                  Formula Type <span style={{ color: "red" }}>*</span>
                </>
              }
              name="chemical_alphabet"
              value={formState.chemical_alphabet}
              options={["ALL", "CHNOPS", "CHNOPSD", "CHNOPSCL", "CHNOPSCLD"]}
              onChange={handleChange}
              className="chem-alph-im-ms"
            />

            <GroupRadio
              label={
                <>
                  Buffer <span style={{ color: "red" }}>*</span>
                </>
              }
              name="buffer"
              value={formState.buffer}
              options={["FORMIC_ACID_1M", "N2", "He"]}
              onChange={handleChange}
              className="buffer-group-im-ms"
            />

            <GroupRadio
              label={
                <>
                  Polarity <span style={{ color: "red" }}>*</span>
                </>
              }
              name="polarity"
              value={formState.polarity}
              options={["Direct", "Inverse"]}
              onChange={handleChange}
              className="polarity-group-im-ms"
            />

            <GroupRadio
              label={
                <>
                  Ionization Mode <span style={{ color: "red" }}>*</span>
                </>
              }
              name="ion_mode"
              value={formState.ion_mode}
              options={["positive", "negative"]}
              onChange={handleChange}
              className="ion-mode-group-im-ms"
            />

            <TextInput
              label="Temperature (°C)"
              name="temperature"
              type="number"
              value={formState.temperature}
              onChange={handleChange}
              placeholder="e.g. 20"
              className="temperature-input-im-ms"
            />

            <TextInput
              label="Marker 1 Compound"
              name="marker1"
              value={formState.marker1}
              onChange={handleChange}
              placeholder="e.g. L-Methionine sulfone"
            />

            <TextInput
              label="Marker 1 Time (min)"
              name="marker1_time"
              type="number"
              value={formState.marker1_time}
              onChange={handleChange}
              placeholder="e.g. 14.24"
            />

            <TextInput
              label="Marker 2 Compound"
              name="marker2"
              value={formState.marker2}
              onChange={handleChange}
              placeholder="e.g. Hippuric acid"
            />

            <TextInput
              label="Marker 2 Time (min)"
              name="marker2_time"
              type="number"
              value={formState.marker2_time}
              onChange={handleChange}
              placeholder="e.g. 25.29"
            />

            <AdductsCheckboxes
              label={
                <>
                  Adducts <span style={{ color: "red" }}>*</span>
                </>
              }
              selectedAdducts={formState.adducts}
              onChange={handleChange}
              name="adducts"
              className="adducts-im-ms"
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
            Array.isArray(results) &&
            results.map((featureObj, featureIndex) => (
              <div key={featureIndex} className="feature-group">
                <h3>
                  Feature {featureIndex + 1}: m/z{" "}
                  {featureObj.feature?.mzValue?.toFixed(4)} | Mobility:{" "}
                  {featureObj.feature?.effectiveMobility?.toFixed(2)}
                </h3>

                {featureObj.hasResults ? (
                  featureObj.annotationsByAdducts.map(
                    (adductGroup, adductIndex) => (
                      <ResultsDropdownGroup
                        key={`${featureIndex}-${adductIndex}`}
                        adduct={adductGroup.adduct}
                        compounds={adductGroup.annotations}
                      />
                    )
                  )
                ) : (
                  <p className="no-results">
                    No results found for this feature.
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CeMsMt2Search;
