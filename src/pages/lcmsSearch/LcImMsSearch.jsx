import { useState, useEffect } from "react";
import axios from "axios";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes.jsx";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup.jsx";
import ResultsSummary from "../../components/search/ResultsSummary.jsx";
import TextBoxInput from "../../components/search/TextBoxInput.jsx";
import GroupRadio from "../../components/search/GroupRadio.jsx";
import ToleranceRadio from "../../components/search/ToleranceRadio.jsx";
import { formatApiError } from "../../utils/apiError";
import { normalizeAnnotation } from "../../utils/resultNormalization";
import { getCcsAdductOrder, sortAdductEntries } from "../../utils/ccsAdducts";
import {
  buildGroupedResultsView,
  buildFeatureSummaryResults,
  countMatchedGroups,
  flattenGroupCompounds,
} from "../../utils/resultsSummary";

const toDeuteriumAwareFormula = (formulaType, deuteriumEnabled) => {
  if (!deuteriumEnabled || formulaType === "ALL") {
    return formulaType;
  }

  if (formulaType === "CHNOPS") {
    return "CHNOPSD";
  }

  if (formulaType === "CHNOPSCL") {
    return "CHNOPSCLD";
  }

  return formulaType;
};

const formatFeatureNumber = (value, digits = 4) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(digits) : "N/A";
};

const LcImMsSearch = () => {
  const createInitialFormState = () => ({
    mzValues: "",
    ccsValues: "",
    rtValues: "",
    mzTolerance: "",
    mzToleranceMode: "PPM",
    ccsTolerance: "",
    ccsToleranceMode: "PERCENTAGE",
    formulaType: "",
    deuterium: false,
    bufferGas: "",
    ionizationMode: "POSITIVE",
    adducts: [],
  });

  const [formState, setFormState] = useState(createInitialFormState);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [adductOrder, setAdductOrder] = useState([]);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const loadDemoData = () => {
    setFormState({
      mzValues: ["790.63203", "812.61397", "782.56943", "804.55137"].join(
        "\n"
      ),
      ccsValues: ["291.175", "299.553", "294.385", "300.53"].join("\n"),
      rtValues: ["6.0", "6.0", "5.0", "5.0"].join("\n"),
      mzTolerance: "5",
      mzToleranceMode: "PPM",
      ccsTolerance: "1.5",
      ccsToleranceMode: "PERCENTAGE",
      formulaType: "CHNOPS",
      deuterium: false,
      bufferGas: "N2",
      ionizationMode: "POSITIVE",
      adducts: ["[M+H]+", "[M+Na]+"],
    });
  };

  const clearInput = () => {
    setFormState(createInitialFormState());
  };

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  useEffect(() => {
    let mounted = true;
    getCcsAdductOrder(formState.ionizationMode).then((order) => {
      if (!mounted) return;
      setAdductOrder(order);
    });

    return () => {
      mounted = false;
    };
  }, [formState.ionizationMode]);

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
      formulaType: toDeuteriumAwareFormula(
        formState.formulaType,
        formState.deuterium
      ),
      ionizationMode: formState.ionizationMode,
      bufferGas: formState.bufferGas,
      adducts: formState.adducts,
      deuterium: formState.deuterium,
      experimentParameters: {
        ionMode: formState.ionizationMode,
        modifierType: "NONE",
      },
    };

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}lcimms-search`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;
      const features = Array.isArray(rawResults?.imFeatures)
        ? rawResults.imFeatures
        : Array.isArray(rawResults)
        ? rawResults
        : [];

      const normalizedFeatures = features.map((feature, featureIndex) => {
        const featureCcsValue = Number(feature?.feature?.ccsValue);

        const adductEntries = (feature.annotationsByAdducts || []).map(
          (adductGroup, adductIndex) => {
            const compounds = (adductGroup.annotations || []).map(
              (annotation, annotationIndex) => {
                const dbCcs = Number(annotation.compound?.dbCcs);
                const ccsError =
                  Number.isFinite(featureCcsValue) && Number.isFinite(dbCcs)
                    ? dbCcs - featureCcsValue
                    : null;

                return {
                  ...normalizeAnnotation(
                    annotation,
                    `${featureIndex}-${adductIndex}-${annotationIndex}`
                  ),
                  ccsError,
                };
              }
            );

            return [adductGroup.adduct, compounds];
          }
        );

        const sortedGroups = sortAdductEntries(adductEntries, adductOrder).map(
          ([adduct, compounds]) => ({ adduct, compounds })
        );

        return {
          feature: feature.feature,
          adductGroups: sortedGroups,
        };
      });

      setResults(normalizedFeatures);
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
    results[activeFeatureIndex]?.adductGroups,
    formState.adducts,
    {
      labelKey: "adduct",
      compoundsKey: "compounds",
      fallbackLabel: "Adduct",
    }
  );
  const allFeaturesSummaryResults = buildFeatureSummaryResults(results, {
    getFeatureLabel: (_, featureIndex) => `Feature ${featureIndex + 1}`,
    getFeatureCompounds: (feature) =>
      flattenGroupCompounds(feature.adductGroups, "compounds"),
  });
  const matchedFeatureCount = countMatchedGroups(allFeaturesSummaryResults);

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
        <form onSubmit={handleSubmit}>
          <div className="grid-container-lc-im-ms">
            <TextBoxInput
              label="Experimental Masses"
              name="mzValues"
              value={formState.mzValues}
              onChange={handleChange}
              className="masses-text-lc-im-ms"
              required
            />

            <TextBoxInput
              label="CCS Values"
              name="ccsValues"
              value={formState.ccsValues}
              onChange={handleChange}
              className="ccs-values-lc-im-ms"
              required
            />

            <TextBoxInput
              label="RT Values"
              name="rtValues"
              value={formState.rtValues}
              onChange={handleChange}
              className="rt-values-lc-im-ms"
              required
            />

            <ToleranceRadio
              label="Tolerance"
              toleranceValue={formState.mzTolerance}
              mzToleranceMode={formState.mzToleranceMode}
              onChange={handleChange}
              inputName="mzTolerance"
              modeName="mzToleranceMode"
              className="tolerance-lc-im-ms"
            />

            <ToleranceRadio
              label="CCS Tolerance"
              toleranceValue={formState.ccsTolerance}
              mzToleranceMode={formState.ccsToleranceMode}
              onChange={handleChange}
              unitOptions={["PERCENTAGE", "ABSOLUTE"]}
              inputName="ccsTolerance"
              modeName="ccsToleranceMode"
              className="ccs-tolerance-lc-im-ms"
            />

            <GroupRadio
              label="Chemical Alphabet"
              name="formulaType"
              value={formState.formulaType}
              options={["ALL", "CHNOPS", "CHNOPSCL"]}
              onChange={handleChange}
              className="chem-alph-lc-im-ms"
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
              label="Modifiers"
              name="bufferGas"
              value={formState.bufferGas}
              options={["N2", "He"]}
              onChange={handleChange}
              className="modifiers-lc-im-ms"
            />

            <GroupRadio
              label="Ionization Mode"
              name="ionizationMode"
              value={formState.ionizationMode}
              options={["POSITIVE", "NEGATIVE"]}
              onChange={handleChange}
              className="ionization-lc-im-ms"
            />

            <AdductsCheckboxes
              label="Adducts"
              selectedAdducts={formState.adducts}
              onSelectionChange={handleAdductsChange}
              ionizationMode={formState.ionizationMode}
              adductsEndpoint="get/ccs-adducts"
              className="adducts-lc-im-ms"
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
                  filename="lcimms_all_features_export.csv"
                />

                <div className="feature-tabs" role="tablist">
                  {results.map((featureObj, featureIndex) => (
                    <button
                      key={`lcim-feature-tab-${featureIndex}`}
                      type="button"
                      className={`feature-tab ${
                        featureIndex === activeFeatureIndex ? "active" : ""
                      }`}
                      onClick={() => setActiveFeatureIndex(featureIndex)}
                    >
                      Feature {featureIndex + 1} | m/z{" "}
                      {formatFeatureNumber(featureObj.feature?.mzValue, 4)} |
                      CCS {formatFeatureNumber(featureObj.feature?.ccsValue, 2)}
                    </button>
                  ))}
                </div>

                <div className="feature-tab-panel">
                  <ResultsSummary
                    results={activeFeatureView.summaryResults}
                    matchedAdductCount={activeFeatureView.matchedGroupCount}
                    totalAdductCount={formState.adducts.length}
                    filename={`lcimms_feature_${activeFeatureIndex + 1}_export.csv`}
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
                        forceColumns: [
                          "rtScore",
                          "adductScore",
                          "ionizationScore",
                          "dbCcs",
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

export default LcImMsSearch;
