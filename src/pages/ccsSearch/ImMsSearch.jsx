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

const ImMsSearch = () => {
  const createInitialFormState = () => ({
    mzValues: "",
    ccsValues: "",
    mzTolerance: "",
    mzToleranceMode: "PPM",
    ccsTolerance: "",
    ccsToleranceMode: "PERCENTAGE",
    deuterium: false,
    ionizationMode: "POSITIVE",
    bufferGas: "",
    adducts: [],
    formulaType: "",
  });

  const [formState, setFormState] = useState(createInitialFormState);

  const loadDemoData = () => {
    console.log("Loading demo data...");
    setFormState({
      mzValues: ["400.3432", "281.24765"].join("\n"),
      ccsValues: ["202.881", "178.546"].join("\n"),
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
    console.log("Clearing input...");
    setFormState(createInitialFormState());
  };

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [adductOrder, setAdductOrder] = useState([]);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

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
      setFormState((prev) => ({ ...prev, [name]: value ?? "" }));
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

    if (!mzValues.length || !ccsValues.length) {
      alert("Masses and CCS values are required.");
      return;
    }

    if (mzValues.length !== ccsValues.length) {
      alert("Masses and CCS values must have the same length.");
      return;
    }

    setLoading(true);

    const formattedData = {
      mzValues,
      ccsValues,
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
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}ccs`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;
      console.log(rawResults);

      const features = Array.isArray(rawResults?.imFeatures)
        ? rawResults.imFeatures
        : Array.isArray(rawResults)
        ? rawResults
        : [];

      const normalizedFeatures = features.map((featureObj, featureIndex) => {
        const featureCcsValue = Number(featureObj.feature?.ccsValue);
        const adductEntries = (featureObj.annotationsByAdducts || []).map(
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
          feature: featureObj.feature,
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
        <span className="title-text">IM-MS Search</span>
      </header>

      <div
        className="page outer-container row"
        style={{ cursor: loading ? "wait" : "default" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid-container-im-ms">
            <TextBoxInput
              label="Experimental Masses"
              name="mzValues"
              value={formState.mzValues}
              onChange={handleChange}
              className="masses-text-im-ms"
              required
            />

            <TextBoxInput
              label="CCS Values"
              name="ccsValues"
              value={formState.ccsValues}
              onChange={handleChange}
              className="ccs-values-im-ms"
              required
            />

            <ToleranceRadio
              label="Tolerance"
              toleranceValue={formState.mzTolerance}
              mzToleranceMode={formState.mzToleranceMode}
              onChange={handleChange}
              inputName="mzTolerance"
              className="tolerance-im-ms"
            />

            <ToleranceRadio
              label="CCS Tolerance"
              toleranceValue={formState.ccsTolerance}
              mzToleranceMode={formState.ccsToleranceMode}
              onChange={handleChange}
              unitOptions={["PERCENTAGE", "ABSOLUTE"]}
              inputName="ccsTolerance"
              modeName="ccsToleranceMode"
              className="ccs-tolerance-im-ms"
            />

            <GroupRadio
              label="Chemical Alphabet"
              name="formulaType"
              value={formState.formulaType}
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
              label="Buffer Gas"
              name="bufferGas"
              value={formState.bufferGas}
              options={["N2", "He"]}
              onChange={handleChange}
              className="modifiers-im-ms"
            />

            <AdductsCheckboxes
              label="Adducts"
              selectedAdducts={formState.adducts}
              onSelectionChange={handleAdductsChange}
              ionizationMode={formState.ionizationMode}
              adductsEndpoint="get/ccs-adducts"
              name="adducts"
              className="adducts-im-ms"
            />

            <GroupRadio
              label="Ionization Mode"
              name="ionizationMode"
              value={formState.ionizationMode}
              options={["POSITIVE", "NEGATIVE"]}
              onChange={handleChange}
              className="ionization-im-ms"
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
                  filename="imms_all_features_export.csv"
                />

                <div className="feature-tabs" role="tablist">
                  {results.map((featureObj, featureIndex) => (
                    <button
                      key={`im-feature-tab-${featureIndex}`}
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
                    filename={`imms_feature_${activeFeatureIndex + 1}_export.csv`}
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
                        forceColumns: ["dbCcs", "ccsError"],
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

export default ImMsSearch;
