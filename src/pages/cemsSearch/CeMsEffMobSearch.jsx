import { useState, useEffect } from "react";
import axios from "axios";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes.jsx";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup.jsx";
import ResultsSummary from "../../components/search/ResultsSummary.jsx";
import TextInput from "../../components/search/TextInput.jsx";
import TextBoxInput from "../../components/search/TextBoxInput.jsx";
import GroupRadio from "../../components/search/GroupRadio.jsx";
import ToleranceRadio from "../../components/search/ToleranceRadio.jsx";
import { formatApiError } from "../../utils/apiError";
import { defaultCeMsBuffers, getCeMsBuffers } from "../../utils/cemsBuffers";
import { normalizeAnnotation } from "../../utils/resultNormalization";
import {
  buildGroupedResultsView,
  buildFeatureSummaryResults,
  countMatchedGroups,
  flattenGroupCompounds,
} from "../../utils/resultsSummary";
import { parseFlexibleNumber, parseRequiredNumberList } from "../../utils/numberParsing";

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

const CeMsEffMobSearch = () => {
  const createInitialFormState = () => ({
    mz_values: "",
    effective_mobilities: "",
    mz_tolerance: "",
    mz_tolerance_mode: "PPM",
    eff_mob_tolerance: "",
    eff_mob_tolerance_mode: "percentage",
    buffer_code: "",
    temperature: "",
    polarity: "",
    chemical_alphabet: "",
    deuterium: false,
    ionization_mode: "Positive",
    adducts: [],
  });

  const [formState, setFormState] = useState(createInitialFormState);

  const loadDemoData = () => {
    setFormState({
      mz_values: ["291.1299", "298.098", "308.094", "316.2488", "55.055"].join(
        "\n"
      ),
      effective_mobilities: ["1174", "1060", "646", "931", "3192"].join("\n"),
      mz_tolerance: "10",
      mz_tolerance_mode: "mDa",
      eff_mob_tolerance: "10",
      eff_mob_tolerance_mode: "percentage",
      buffer_code: "FORMIC_ACID_1M",
      temperature: "20",
      polarity: "Direct",
      chemical_alphabet: "CHNOPS",
      deuterium: false,
      ionization_mode: "Positive",
      adducts: ["[M+H]+", "[M+2H]2+", "[M+Na]+", "[M+K]+", "[M+NH4]+"],
    });
  };

  const clearInput = () => {
    setFormState(createInitialFormState());
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
      mz_values: parseRequiredNumberList(formState.mz_values),
      effective_mobilities: parseRequiredNumberList(
        formState.effective_mobilities
      ),
      mz_tolerance: parseFlexibleNumber(formState.mz_tolerance),
      mz_tolerance_mode: formState.mz_tolerance_mode,
      eff_mob_tolerance: parseFlexibleNumber(formState.eff_mob_tolerance),
      eff_mob_tolerance_mode: formState.eff_mob_tolerance_mode,
      buffer_code: formState.buffer_code,
      temperature: formState.temperature
        ? parseFlexibleNumber(formState.temperature)
        : null,
      polarity: toApiPolarity(formState.polarity),
      chemical_alphabet: toDeuteriumAwareAlphabet(
        formState.chemical_alphabet,
        formState.deuterium
      ),
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
            mzValue: item.feature?.mzValue,
            effectiveMobility: item.feature?.effectiveMobility,
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
        <span className="title-text">CE-MS Effective Mobility Search</span>
      </header>

      <div
        className="page outer-container row"
        style={{ cursor: loading ? "wait" : "default" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid-container-ce-ms-search">
            <TextBoxInput
              label="m/z Values"
              name="mz_values"
              value={formState.mz_values}
              onChange={handleChange}
            />

            <ToleranceRadio
              label="m/z Tolerance"
              toleranceValue={formState.mz_tolerance}
              mzToleranceMode={formState.mz_tolerance_mode}
              onChange={handleChange}
              unitOptions={["mDa", "PPM"]}
              inputName="mz_tolerance"
              modeName="mz_tolerance_mode"
              className="mz-tolerance-radio-cems"
            />

            <TextBoxInput
              label="Effective Mobilities"
              name="effective_mobilities"
              value={formState.effective_mobilities}
              onChange={handleChange}
            />

            <GroupRadio
              label="Chemical Alphabet"
              name="chemical_alphabet"
              value={formState.chemical_alphabet}
              options={["ALL", "CHNOPS", "CHNOPSCL"]}
              onChange={handleChange}
              className="formula-type-radio-cems"
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
              name="buffer_code"
              value={formState.buffer_code}
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
            />

            <GroupRadio
              label="Ionization Mode"
              name="ionization_mode"
              value={formState.ionization_mode}
              options={["Positive", "Negative"]}
              onChange={handleChange}
              className="ionization-mode-cems"
            />

            <AdductsCheckboxes
              label="Adducts"
              selectedAdducts={formState.adducts}
              onSelectionChange={handleAdductsChange}
              ionizationMode={formState.ionization_mode}
              name="adducts"
              className="adducts-checkboxes-cems"
            />

            <TextInput
              label="Temperature (°C)"
              name="temperature"
              type="number"
              value={formState.temperature}
              onChange={handleChange}
              placeholder="e.g. 20"
            />

            <ToleranceRadio
              label="Effective Mobility Tolerance"
              toleranceValue={formState.eff_mob_tolerance}
              mzToleranceMode={formState.eff_mob_tolerance_mode}
              onChange={handleChange}
              unitOptions={["percentage", "absolute"]}
              inputName="eff_mob_tolerance"
              modeName="eff_mob_tolerance_mode"
              className="tolerance-radio-cems"
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
            {results.length > 0 ? (
              <>
                <ResultsSummary
                  results={allFeaturesSummaryResults}
                  matchedAdductCount={matchedFeatureCount}
                  totalAdductCount={results.length}
                  progressLabel="Features with matches"
                  filename="cems_effmob_all_features_export.csv"
                />

                <div className="feature-tabs" role="tablist">
                  {results.map((featureObj, featureIndex) => (
                    <button
                      key={`cems-eff-feature-tab-${featureIndex}`}
                      type="button"
                      className={`feature-tab ${
                        featureIndex === activeFeatureIndex ? "active" : ""
                      }`}
                      onClick={() => setActiveFeatureIndex(featureIndex)}
                    >
                      Feature {featureIndex + 1} | m/z{" "}
                      {formatFeatureNumber(featureObj.mzValue, 4)} | Eff.
                      Mobility {formatFeatureNumber(featureObj.effectiveMobility, 2)}
                    </button>
                  ))}
                </div>

                <div className="feature-tab-panel">
                  <ResultsSummary
                    results={activeFeatureView.summaryResults}
                    matchedAdductCount={activeFeatureView.matchedGroupCount}
                    totalAdductCount={formState.adducts.length}
                    filename={`cems_effmob_feature_${
                      activeFeatureIndex + 1
                    }_export.csv`}
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
                            header: "Mobility Error (%)",
                            key: "mobilityErrorPct",
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

export default CeMsEffMobSearch;
