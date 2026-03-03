import { useState, useEffect } from "react";
import axios from "axios";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes.jsx";
import DatabasesCheckboxes from "../../components/search/DatabasesCheckboxes.jsx";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup.jsx";
import TextBoxInput from "../../components/search/TextBoxInput.jsx";
import GroupRadio from "../../components/search/GroupRadio.jsx";
import ToleranceRadio from "../../components/search/ToleranceRadio.jsx";
import { formatApiError } from "../../utils/apiError";
import { normalizeAnnotation } from "../../utils/resultNormalization";

const formatNumber = (value, digits = 4) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(digits) : "N/A";
};

const BatchSearch = () => {
  const [formState, setFormState] = useState({
    mzValues: "",
    tolerance: "",
    mzToleranceMode: "PPM",
    ionizationMode: "POSITIVE",
    metaboliteType: "ALL",
    adductsString: [],
    databases: [],
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const loadDemoData = () => {
    setFormState({
      mzValues: [
        "400.3432",
        "422.32336",
        "316.24945",
        "338.2299",
        "281.24765",
        "288.2174",
        "496.3427",
        "518.3226",
        "548.37054",
        "572.3718",
        "570.3551",
        "568.3401",
        "590.3210",
        "482.324",
        "478.29312",
        "500.27457",
      ].join(", "),
      tolerance: "10",
      mzToleranceMode: "PPM",
      metaboliteType: "ONLYLIPIDS",
      ionizationMode: "POSITIVE",
      adductsString: [
        "[M+H]+",
        "[M+2H]2+",
        "[M+Na]+",
        "[M+K]+",
        "[M+NH4]+",
        "[M+H-H2O]+",
      ],
      databases: ["HMDB"],
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      mzValues: "",
      tolerance: "10",
      mzToleranceMode: "PPM",
      metaboliteType: "ALL",
      ionizationMode: "POSITIVE",
      adductsString: [],
      databases: [],
    });
  };

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "mzValues") {
      setFormState((prev) => ({ ...prev, [name]: value }));
      return;
    }

    if (type === "checkbox") {
      if (name === "databases") {
        setFormState((prev) => ({
          ...prev,
          databases: checked
            ? [...prev.databases, value]
            : prev.databases.filter((db) => db !== value),
        }));
      }
    } else {
      setFormState((prev) => ({ ...prev, [name]: value || null }));
    }
  };

  const handleAdductsChange = (adducts) => {
    setFormState((prev) => ({ ...prev, adductsString: adducts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const mzValues = (formState.mzValues || "")
      .split(/[\s,;]+/)
      .filter(Boolean)
      .map((mass) => parseFloat(mass));

    const formattedData = {
      mzValues,
      tolerance: parseFloat(formState.tolerance),
      mzToleranceMode: formState.mzToleranceMode,
      ionizationMode: formState.ionizationMode,
      metaboliteType: formState.metaboliteType,
      adductsString: formState.adductsString,
      databases: formState.databases,
    };

    console.log("Sending to backend:", JSON.stringify(formattedData, null, 2));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}compounds/batch-search`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;

      const features = rawResults.msfeatures || [];
      const normalizedFeatures = features.map((featureObj, featureIndex) => {
        const adductGroups = (featureObj.annotationsByAdducts || [])
          .map((adductGroup, adductIndex) => ({
            adduct: adductGroup.adduct,
            compounds: (adductGroup.annotations || [])
              .map((annotation, annotationIndex) =>
                normalizeAnnotation(
                  annotation,
                  `${featureIndex}-${adductIndex}-${annotationIndex}`
                )
              ),
          }))
          .filter((group) => group.compounds.length > 0);

        return {
          feature: featureObj.feature,
          adductGroups,
        };
      });

      console.log("Raw results:", rawResults);

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

  return (
    <div className="page">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}
      
      <header className="title-header">
        <span className="title-text">Batch Search</span>
      </header>
      <div
        className="page outer-container row"
        style={{ cursor: loading ? "wait" : "default" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid-container">
            <TextBoxInput
              label="Experimental Masses"
              name="mzValues"
              value={formState.mzValues}
              onChange={handleChange}
            />

            <GroupRadio
              label="Ionization Mode"
              name="ionizationMode"
              value={formState.ionizationMode}
              options={["POSITIVE", "NEGATIVE"]}
              onChange={handleChange}
              className="ionization-div"
            />

            <AdductsCheckboxes
              selectedAdducts={formState.adductsString}
              onSelectionChange={handleAdductsChange}
              ionizationMode={formState.ionizationMode}
            />

            <DatabasesCheckboxes
              selectedDatabases={formState.databases}
              onChange={handleChange}
            />

            <ToleranceRadio
              label="Tolerance"
              toleranceValue={formState.tolerance}
              mzToleranceMode={formState.mzToleranceMode}
              modeName="mzToleranceMode"
              onChange={handleChange}
            />

            <GroupRadio
              label="Metabolites"
              name="metaboliteType"
              value={formState.metaboliteType}
              options={["ALL", "ONLYLIPIDS"]}
              onChange={handleChange}
              className="metabolites-div"
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
                <div className="feature-tabs" role="tablist">
                  {results.map((featureObj, featureIndex) => (
                    <button
                      key={`feature-tab-${featureIndex}`}
                      type="button"
                      className={`feature-tab ${
                        featureIndex === activeFeatureIndex ? "active" : ""
                      }`}
                      onClick={() => setActiveFeatureIndex(featureIndex)}
                    >
                      Feature {featureIndex + 1} | m/z{" "}
                      {formatNumber(featureObj.feature?.mzValue, 4)}
                    </button>
                  ))}
                </div>

                <div className="feature-tab-panel">
                  {results[activeFeatureIndex]?.adductGroups?.length > 0 ? (
                    results[activeFeatureIndex].adductGroups.map((group) => (
                      <ResultsDropdownGroup
                        key={`${activeFeatureIndex}-${group.adduct}`}
                        adduct={group.adduct}
                        compounds={group.compounds}
                      />
                    ))
                  ) : (
                    <p className="no-results">
                      No results found for this feature.
                    </p>
                  )}
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

export default BatchSearch;
