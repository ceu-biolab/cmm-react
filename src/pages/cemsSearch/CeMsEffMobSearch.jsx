import { useState, useEffect } from "react";
import axios from "axios";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes.jsx";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup.jsx";
import TextInput from "../../components/search/TextInput.jsx";
import GroupRadio from "../../components/search/GroupRadio.jsx";
import ToleranceRadio from "../../components/search/ToleranceRadio.jsx";

const CeMsEffMobSearch = () => {
  const [formState, setFormState] = useState({
    mz_values: "",
    effective_mobilities: "",
    mz_tolerance: "",
    mz_tolerance_mode: "mDa",
    eff_mob_tolerance: "",
    eff_mob_tolerance_mode: "percentage",
    buffer_code: "FORMIC_ACID_1M",
    temperature: "",
    polarity: "Direct",
    chemical_alphabet: "CHNOPS",
    ionization_mode: "Positive",
    adducts: [],
  });

  const loadDemoData = () => {
    setFormState({
      mz_values: ["291.1299", "298.098", "308.094", "316.2488", "55.055"].join(
        ", "
      ),
      effective_mobilities: ["1174", "1060", "646", "931", "3192"].join(", "),
      mz_tolerance: "10",
      mz_tolerance_mode: "mDa",
      eff_mob_tolerance: "10",
      eff_mob_tolerance_mode: "percentage",
      buffer_code: "FORMIC_ACID_1M",
      temperature: "20",
      polarity: "Direct",
      chemical_alphabet: "CHNOPS",
      ionization_mode: "Positive",
      adducts: ["[M+H]+", "[M+2H]2+", "[M+Na]+", "[M+K]+", "[M+NH4]+"],
    });
  };

  const clearInput = () => {
    setFormState({
      mz_values: "",
      effective_mobilities: "",
      mz_tolerance: "",
      mz_tolerance_mode: "mDa",
      eff_mob_tolerance: "",
      eff_mob_tolerance_mode: "percentage",
      buffer_code: "FORMIC_ACID_1M",
      temperature: "",
      polarity: "Direct",
      chemical_alphabet: "CHNOPS",
      ionization_mode: "Positive",
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

    if (type === "checkbox" && name === "adducts") {
      setFormState((prev) => ({
        ...prev,
        adducts: checked
          ? [...prev.adducts, value]
          : prev.adducts.filter((adduct) => adduct !== value),
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value ?? "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedData = {
      mz_values: formState.mz_values
        .split(/[\s,;]+/)
        .filter(Boolean)
        .map(parseFloat),
      effective_mobilities: formState.effective_mobilities
        .split(/[\s,;]+/)
        .filter(Boolean)
        .map(parseFloat),
      mz_tolerance: parseFloat(formState.mz_tolerance),
      mz_tolerance_mode: formState.mz_tolerance_mode,
      eff_mob_tolerance: parseFloat(formState.eff_mob_tolerance),
      eff_mob_tolerance_mode: formState.eff_mob_tolerance_mode,
      buffer_code: formState.buffer_code,
      temperature: formState.temperature
        ? parseFloat(formState.temperature)
        : null,
      polarity: formState.polarity,
      chemical_alphabet: formState.chemical_alphabet,
      ionization_mode: formState.ionization_mode,
      adducts: formState.adducts,
    };

    console.log("Sending to backend:", JSON.stringify(formattedData, null, 2));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}CEMSSearch`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;
      console.log(rawResults);

      const features =
        rawResults.ceFeatures?.map((item) => ({
          mzValue: item.feature?.mzValue,
          effectiveMobility: item.feature?.effectiveMobility,
          annotationsByAdducts:
            item.annotationsByAdducts?.map((adductGroup) => ({
              adduct: adductGroup.adduct,
              annotations:
                adductGroup.annotations?.map((ann) => ann.compound) || [],
            })) || [],
        })) || [];

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
        <span className="title-text">CE-MS Effective Mobility Search</span>
      </header>
      <div
        className="page outer-container row"
        style={{ cursor: loading ? "wait" : "default" }}
      >
        <label className="required-label">
          Required <span className="red-asterisk">*</span>
        </label>
        <form onSubmit={handleSubmit}>
          <div className="grid-container-ce-ms-search">
            <TextInput
              label={
                <>
                  m/z Values <span style={{ color: "red" }}>*</span>
                </>
              }
              name="mz_values"
              value={formState.mz_values}
              onChange={handleChange}
              placeholder="Enter m/z values (comma separated)"
            />

            <ToleranceRadio
              label={
                <>
                  m/z Tolerance <span style={{ color: "red" }}>*</span>
                </>
              }
              toleranceValue={formState.mz_tolerance}
              mzToleranceMode={formState.mz_tolerance_mode}
              onChange={handleChange}
              unitOptions={["mDa", "PPM"]}
              inputName="mz_tolerance"
              modeName="mz_tolerance_mode"
              className="mz-tolerance-radio-cems"
            />

            <ToleranceRadio
              label={
                <>
                  Effective Mobility Tolerance{" "}
                  <span style={{ color: "red" }}>*</span>
                </>
              }
              toleranceValue={formState.eff_mob_tolerance}
              mzToleranceMode={formState.eff_mob_tolerance_mode}
              onChange={handleChange}
              unitOptions={["percentage", "absolute"]}
              inputName="eff_mob_tolerance"
              modeName="eff_mob_tolerance_mode"
              className="tolerance-radio-cems"
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
              className="formula-type-radio-cems"
            />

            <GroupRadio
              label={
                <>
                  Buffer <span style={{ color: "red" }}>*</span>
                </>
              }
              name="buffer_code"
              value={formState.buffer_code}
              options={["FORMIC_ACID_1M", "N2", "He"]}
              onChange={handleChange}
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
            />

            <GroupRadio
              label={
                <>
                  Ionization Mode <span style={{ color: "red" }}>*</span>
                </>
              }
              name="ionization_mode"
              value={formState.ionization_mode}
              options={["Positive", "Negative"]}
              onChange={handleChange}
            />

            <TextInput
              label="Temperature (°C)"
              name="temperature"
              type="number"
              value={formState.temperature}
              onChange={handleChange}
              placeholder="e.g. 20"
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
              className="adducts-checkboxes-cems"
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
                  {featureObj.mzValue.toFixed(4)} | Effective Mobility:{" "}
                  {featureObj.effectiveMobility.toFixed(2)}
                </h3>

                {featureObj.annotationsByAdducts?.map(
                  (adductGroup, adductIndex) => (
                    <ResultsDropdownGroup
                      key={`${featureIndex}-${adductIndex}`}
                      adduct={adductGroup.adduct}
                      compounds={adductGroup.annotations || []}
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

export default CeMsEffMobSearch;
