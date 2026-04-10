import { useEffect, useState } from "react";
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
  buildFeatureSummaryResults,
  buildGroupedResultsView,
  countMatchedGroups,
  flattenGroupCompounds,
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

const parseNumericList = (rawValue) =>
  (rawValue || "")
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map((entry) => Number(entry))
    .filter((entry) => Number.isFinite(entry));

const CeMsRmtSearch = () => {
  const [formState, setFormState] = useState({
    masses: "",
    rmt: "",
    tolerance: "",
    tolerance_mode: "",
    rmt_tolerance: "",
    rmt_tolerance_mode: "",
    buffer: "",
    temperature: "",
    polarity: "",
    rmt_reference: "",
    chemical_alphabet: "",
    deuterium: false,
    ion_mode: "",
    adducts: [],
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [bufferOptions, setBufferOptions] = useState(defaultCeMsBuffers);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const loadDemoData = () => {
    setFormState({
      masses: ["291.1299", "298.098", "308.094", "316.2488", "55.055"].join(
        "\n"
      ),
      rmt: ["0.85", "0.86", "1.07", "0.93", "0.42"].join("\n"),
      tolerance: "10",
      tolerance_mode: "PPM",
      rmt_tolerance: "10",
      rmt_tolerance_mode: "percentage",
      buffer: "FORMIC_ACID_1M",
      temperature: "20",
      polarity: "Direct",
      rmt_reference: "L-Methionine sulfone",
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
    setFormState({
      masses: "",
      rmt: "",
      tolerance: "",
      tolerance_mode: "",
      rmt_tolerance: "",
      rmt_tolerance_mode: "",
      buffer: "",
      temperature: "",
      polarity: "",
      rmt_reference: "",
      chemical_alphabet: "",
      deuterium: false,
      ion_mode: "",
      adducts: [],
    });
  };

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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      setFormState((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormState((prev) => ({ ...prev, [name]: value ?? "" }));
  };

  const handleAdductsChange = (adducts) => {
    setFormState((prev) => ({ ...prev, adducts }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const masses = parseNumericList(formState.masses);
    const rmtValues = parseNumericList(formState.rmt);

    if (!masses.length || !rmtValues.length) {
      alert("Experimental masses and RMT values are required.");
      return;
    }

    if (masses.length !== rmtValues.length) {
      alert("Experimental masses and RMT values must have the same length.");
      return;
    }

    setLoading(true);

    const formattedData = {
      masses,
      tolerance: parseFloat(formState.tolerance),
      tolerance_mode: formState.tolerance_mode,
      rmt: rmtValues,
      rmt_tolerance: parseFloat(formState.rmt_tolerance),
      rmt_tolerance_mode: formState.rmt_tolerance_mode,
      buffer: formState.buffer,
      temperature: formState.temperature
        ? parseFloat(formState.temperature)
        : null,
      polarity: toApiPolarity(formState.polarity),
      rmt_reference: formState.rmt_reference,
      chemical_alphabet: toDeuteriumAwareAlphabet(
        formState.chemical_alphabet,
        formState.deuterium
      ),
      ion_mode: formState.ion_mode,
      adducts: formState.adducts,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}cems-rmt-search`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;
      const features =
        rawResults.ceFeatures?.map((item, featureIndex) => {
          const annotationsByAdducts =
            item.annotationsByAdducts?.map((adductGroup, adductIndex) => ({
              adduct: adductGroup.adduct,
              annotations:
                adductGroup.annotations?.map((annotation, annotationIndex) =>
                  normalizeAnnotation(
                    annotation,
                    `${featureIndex}-${adductIndex}-${annotationIndex}`
                  )
                ) || [],
            })) || [];

          return {
            feature: item.feature,
            submittedRmt: rmtValues[featureIndex] ?? null,
            annotationsByAdducts,
          };
        }) || [];

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
  const allFeaturesSummaryResults = buildFeatureSummaryResults(results, {
    getFeatureLabel: (_, featureIndex) => `Feature ${featureIndex + 1}`,
    getFeatureCompounds: (feature) =>
      flattenGroupCompounds(feature.annotationsByAdducts, "annotations"),
  });
  const matchedFeatureCount = countMatchedGroups(allFeaturesSummaryResults);

  return (
    <div className="page cemspage">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}

      <header className="title-header">
        <span className="title-text">CE-MS RMT Search</span>
      </header>

      <div
        className="page outer-container row"
        style={{ cursor: loading ? "wait" : "default" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid-container-ce-ms-markers">
            <TextBoxInput
              label="Experimental Masses"
              name="masses"
              value={formState.masses}
              onChange={handleChange}
              className="masses-text-im-ms"
            />

            <TextBoxInput
              label="Relative Migration Times"
              name="rmt"
              value={formState.rmt}
              onChange={handleChange}
              className="ccs-values-im-ms"
            />

            <ToleranceRadio
              label="Tolerance"
              toleranceValue={formState.tolerance}
              mzToleranceMode={formState.tolerance_mode}
              onChange={handleChange}
              unitOptions={["PPM", "DA"]}
              inputName="tolerance"
              modeName="tolerance_mode"
              className="tolerance-im-ms"
            />

            <ToleranceRadio
              label="RMT Tolerance"
              toleranceValue={formState.rmt_tolerance}
              mzToleranceMode={formState.rmt_tolerance_mode}
              onChange={handleChange}
              unitOptions={["percentage", "absolute"]}
              inputName="rmt_tolerance"
              modeName="rmt_tolerance_mode"
              className="ccs-tolerance-im-ms"
            />

            <GroupRadio
              label="Chemical Alphabet"
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
              label="Buffer"
              name="buffer"
              value={formState.buffer}
              options={bufferOptions}
              onChange={handleChange}
              className="buffer-group-cems"
            />

            <GroupRadio
              label="Polarity"
              name="polarity"
              value={formState.polarity}
              options={["Direct", "Inverse"]}
              onChange={handleChange}
              className="polarity-group-im-ms"
            />

            <GroupRadio
              label="Ionization Mode"
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
              label="RMT Reference Compound"
              name="rmt_reference"
              value={formState.rmt_reference}
              onChange={handleChange}
              placeholder="e.g. L-Methionine sulfone"
            />

            <AdductsCheckboxes
              label="Adducts"
              selectedAdducts={formState.adducts}
              onSelectionChange={handleAdductsChange}
              ionizationMode={formState.ion_mode}
              name="adducts"
              className="adducts-im-ms"
            />
          </div>

          <div className="form-buttons-container center-button">
            <button type="submit">Submit</button>
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
            {results.length > 0 ? (
              <>
                <ResultsSummary
                  results={allFeaturesSummaryResults}
                  matchedAdductCount={matchedFeatureCount}
                  totalAdductCount={results.length}
                  progressLabel="Features with matches"
                  filename="cems_rmt_all_features_export.csv"
                />

                <div className="feature-tabs" role="tablist">
                  {results.map((featureObj, featureIndex) => (
                    <button
                      key={`cems-rmt-feature-tab-${featureIndex}`}
                      type="button"
                      className={`feature-tab ${
                        featureIndex === activeFeatureIndex ? "active" : ""
                      }`}
                      onClick={() => setActiveFeatureIndex(featureIndex)}
                    >
                      Feature {featureIndex + 1} | m/z{" "}
                      {formatFeatureNumber(featureObj.feature?.mzValue, 4)} | RMT{" "}
                      {formatFeatureNumber(featureObj.submittedRmt, 3)}
                    </button>
                  ))}
                </div>

                <div className="feature-tab-panel">
                  <ResultsSummary
                    results={activeFeatureView.summaryResults}
                    matchedAdductCount={activeFeatureView.matchedGroupCount}
                    totalAdductCount={formState.adducts.length}
                    filename={`cems_rmt_feature_${activeFeatureIndex + 1}_export.csv`}
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
                      tableProps={{
                        extraColumns: [
                          {
                            header: "Relative MT",
                            key: "relativeMt",
                            type: "number",
                            digits: 4,
                          },
                          {
                            header: "Absolute MT",
                            key: "absoluteMt",
                            type: "number",
                            digits: 4,
                          },
                          {
                            header: "RMT Error (%)",
                            key: "rmtErrorPct",
                            type: "number",
                            digits: 4,
                          },
                        ],
                      }}
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

export default CeMsRmtSearch;
