import { useState, useEffect } from "react";
import axios from "axios";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes.jsx";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup.jsx";
import ResultsSummary from "../../components/search/ResultsSummary.jsx";
import TextBoxInput from "../../components/search/TextBoxInput.jsx";
import TextInput from "../../components/search/TextInput.jsx";
import GroupRadio from "../../components/search/GroupRadio.jsx";
import ToleranceRadio from "../../components/search/ToleranceRadio.jsx";
import { formatApiError } from "../../utils/apiError";
import { defaultCeMsBuffers, getCeMsBuffers } from "../../utils/cemsBuffers";
import { normalizeAnnotation } from "../../utils/resultNormalization";
import {
  buildGroupedResultsView,
} from "../../utils/resultsSummary";

const toDeuteriumAwareAlphabet = (chemicalAlphabet, deuteriumEnabled) => {
  if (!deuteriumEnabled || chemicalAlphabet === "ALL") {
    return chemicalAlphabet;
  }

  if (chemicalAlphabet === "CHNOPS") {
    return "CHNOPSD";
  }

  if (chemicalAlphabet === "CHNOPSCL") {
    return "CHNOPSCLD";
  }

  return chemicalAlphabet;
};

const toApiPolarity = (polarity) => {
  if (polarity === "Inverse") {
    return "Reverse";
  }

  return polarity;
};

const formatFeatureNumber = (value, digits = 4) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(digits) : "N/A";
};

const CeMsMt2Search = () => {
  const [formState, setFormState] = useState({
    masses: "",
    mt: "",
    tolerance: "",
    tolerance_mode: "",
    mt_tolerance: "",
    mt_tolerance_mode: "",
    buffer: "",
    temperature: "",
    polarity: "",
    marker1: "",
    marker1_time: "",
    marker2: "",
    marker2_time: "",
    chemical_alphabet: "",
    deuterium: false,
    ion_mode: "",
    adducts: [],
  });

  const loadDemoData = () => {
    setFormState({
      masses: ["291.1299", "298.098", "308.094", "316.2488", "55.055"].join(
        "\n"
      ),
      tolerance: "10",
      tolerance_mode: "PPM",
      mt: ["11.56", "13.65", "15.62", "12.59", "6.99"].join("\n"),
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
      deuterium: false,
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
      tolerance_mode: "",
      mt_tolerance: "",
      mt_tolerance_mode: "",
      buffer: "",
      temperature: "",
      polarity: "",
      marker1: "",
      marker1_time: "",
      marker2: "",
      marker2_time: "",
      chemical_alphabet: "",
      deuterium: false,
      ion_mode: "",
      adducts: [],
    });
  };

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [bufferOptions, setBufferOptions] = useState(defaultCeMsBuffers);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  useEffect(() => {
    let mounted = true;
    getCeMsBuffers().then((buffers) => {
      if (!mounted) return;
      setBufferOptions(buffers && buffers.length ? buffers : defaultCeMsBuffers);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormState((prev) => ({ ...prev, [name]: checked }));
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
      polarity: toApiPolarity(formState.polarity),
      marker1: formState.marker1,
      marker1_time: formState.marker1_time
        ? parseFloat(formState.marker1_time)
        : null,
      marker2: formState.marker2,
      marker2_time: formState.marker2_time
        ? parseFloat(formState.marker2_time)
        : null,
      chemical_alphabet: toDeuteriumAwareAlphabet(
        formState.chemical_alphabet,
        formState.deuterium
      ),
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

      const features = rawFeatures.map((item, featureIndex) => {
        const annotationsByAdducts =
          item.annotationsByAdducts?.map((adductGroup, adductIndex) => {
            const annotations =
              adductGroup.annotations?.map((annotation, annotationIndex) =>
                normalizeAnnotation(
                  annotation,
                  `${featureIndex}-${adductIndex}-${annotationIndex}`
                )
              ) || [];

            return {
              adduct: adductGroup.adduct,
              annotations,
            };
          }) || [];

        return {
          feature: item.feature,
          annotationsByAdducts,
        };
      });

      setResults(features);
      setActiveFeatureIndex(0);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting search:", error.response || error);
      alert(formatApiError(error, { action: "submit your search" }));
    } finally {
      setLoading(false);
    }
  };

  const activeFeatureView = buildGroupedResultsView(
    results[activeFeatureIndex]?.annotationsByAdducts,
    formState.adducts,
    {
      labelKey: "adduct",
      compoundsKey: "annotations",
      fallbackLabel: "Adduct",
    }
  );

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
          <div className="grid-container-ce-ms-markers">
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
                  Chemical Alphabet <span style={{ color: "red" }}>*</span>
                </>
              }
              name="chemical_alphabet"
              value={formState.chemical_alphabet}
              options={["ALL", "CHNOPS", "CHNOPSCL"]}
              onChange={handleChange}
              className="chem-alph-im-ms"
            >
              <label className="box group-radio-deuterium">
                <input
                  type="checkbox"
                  name="deuterium"
                  checked={formState.deuterium}
                  onChange={handleChange}
                />
                Deuterium
              </label>
            </GroupRadio>

            <GroupRadio
              label={
                <>
                  Buffer <span style={{ color: "red" }}>*</span>
                </>
              }
              name="buffer"
              value={formState.buffer}
              options={bufferOptions}
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
              onSelectionChange={handleAdductsChange}
              ionizationMode={formState.ion_mode}
              name="adducts"
              className="adducts-im-ms"
            />
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

        {showResults && (
          <div className="results-div">
            {Array.isArray(results) && results.length > 0 ? (
              <>
                <div className="feature-tabs" role="tablist">
                  {results.map((featureObj, featureIndex) => (
                    <button
                      key={`cems-mt2-feature-tab-${featureIndex}`}
                      type="button"
                      className={`feature-tab ${
                        featureIndex === activeFeatureIndex ? "active" : ""
                      }`}
                      onClick={() => setActiveFeatureIndex(featureIndex)}
                    >
                      Feature {featureIndex + 1} | m/z{" "}
                      {formatFeatureNumber(featureObj.feature?.mzValue, 4)} |
                      Mobility{" "}
                      {formatFeatureNumber(featureObj.feature?.effectiveMobility, 2)}
                    </button>
                  ))}
                </div>

                <div className="feature-tab-panel">
                  <ResultsSummary
                    results={activeFeatureView.summaryResults}
                    matchedAdductCount={activeFeatureView.matchedGroupCount}
                    totalAdductCount={formState.adducts.length}
                    filename={`cems_mt2_feature_${activeFeatureIndex + 1}_export.csv`}
                  />

                  {!activeFeatureView.hasCompounds && (
                    <p className="no-results">
                      No results found for this feature.
                    </p>
                  )}

                  {activeFeatureView.displayGroups.map((group) => (
                    <ResultsDropdownGroup
                      key={`${activeFeatureIndex}-${group.adduct}`}
                      adduct={group.adduct}
                      compounds={group.compounds}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="no-results">No features returned.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CeMsMt2Search;
