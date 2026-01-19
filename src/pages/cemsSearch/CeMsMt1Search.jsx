import { useState, useEffect } from "react";
import axios from "axios";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes.jsx";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup.jsx";
import TextBoxInput from "../../components/search/TextBoxInput.jsx";
import TextInput from "../../components/search/TextInput.jsx";
import GroupRadio from "../../components/search/GroupRadio.jsx";
import ToleranceRadio from "../../components/search/ToleranceRadio.jsx";

const CeMsMt1Search = () => {
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
    marker: "",
    marker_time: "",
    capillary_length: "",
    capillary_voltage: "",
    chemical_alphabet: "CHNOPS",
    ion_mode: "positive",
    adducts: [],
  });

  const loadDemoData = () => {
    console.log("Loading demo data...");
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
      marker: "L-Methionine sulfone",
      marker_time: "14.24",
      capillary_length: "1000",
      capillary_voltage: "30",
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
      marker: "",
      marker_time: "",
      capillary_length: "",
      capillary_voltage: "",
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
      marker: formState.marker,
      marker_time: formState.marker_time
        ? parseFloat(formState.marker_time)
        : null,
      capillary_length: formState.capillary_length
        ? parseFloat(formState.capillary_length)
        : null,
      capillary_voltage: formState.capillary_voltage
        ? parseFloat(formState.capillary_voltage)
        : null,
      chemical_alphabet: formState.chemical_alphabet,
      ion_mode: formState.ion_mode,
      adducts: formState.adducts,
    };

    console.log("Sending to backend:", JSON.stringify(formattedData, null, 2));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}CEMS1Marker`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;
      console.log(rawResults);

      const features = rawResults.ceFeatures || rawResults.imFeatures || [];

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
      <header className="title-header">
        <span className="title-text">CE-MS MT 1 Marker Search</span>
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
              label="Marker Compound"
              name="marker"
              value={formState.marker}
              onChange={handleChange}
              placeholder="e.g. L-Methionine sulfone"
              className="marker-input-im-ms"
            />

            <TextInput
              label="Marker Time (min)"
              name="marker_time"
              type="number"
              value={formState.marker_time}
              onChange={handleChange}
              placeholder="e.g. 14.24"
              className="marker-time-input-im-ms"
            />

            <TextInput
              label="Capillary Length (mm)"
              name="capillary_length"
              type="number"
              value={formState.capillary_length}
              onChange={handleChange}
              placeholder="e.g. 1000"
              className="capillary-length-input-im-ms"
            />

            <TextInput
              label="Capillary Voltage (kV)"
              name="capillary_voltage"
              type="number"
              value={formState.capillary_voltage}
              onChange={handleChange}
              placeholder="e.g. 30"
              className="capillary-voltage-input-im-ms"
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

                {featureObj.annotationsByAdducts?.map(
                  (adductGroup, adductIndex) => (
                    <ResultsDropdownGroup
                      key={`${featureIndex}-${adductIndex}`}
                      adduct={adductGroup.adduct}
                      compounds={
                        adductGroup.annotations
                          ?.filter((a) => a.compound)
                          ?.map((a) => ({
                            ...a,
                            ...a.compound,
                          })) || []
                      }
                    />
                  )
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CeMsMt1Search;
