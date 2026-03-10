import { useState, useEffect } from "react";
import axios from "axios";
import TextInput from "../../components/search/TextInput";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes";
import DatabasesCheckboxes from "../../components/search/DatabasesCheckboxes";
import GroupRadio from "../../components/search/GroupRadio";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup";
import ToleranceRadio from "../../components/search/ToleranceRadio";
import { ToastContainer, toast } from "react-toastify";
import { formatApiError } from "../../utils/apiError";
import ResultsSummary from "../../components/search/ResultsSummary";
import { normalizeAnnotation } from "../../utils/resultNormalization";
import {
  buildGroupedResultsView,
  resultMapToGroups,
} from "../../utils/resultsSummary";
import {
  DEFAULT_DATABASES,
  toggleDatabaseSelection,
} from "../../utils/databaseSelection";

const SimpleSearch = () => {
  const [formState, setFormState] = useState({
    mz: "",
    mzToleranceMode: "",
    tolerance: "",
    ionizationMode: "",
    adductsString: [],
    databases: [],
    metaboliteType: "",
  });

  const [results, setResults] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [matchedAdductCount, setMatchedAdductCount] = useState(0);
  const [totalAdductCount, setTotalAdductCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadDemoData = () => {
    console.log("Loading demo data...");
    setFormState({
      mz: "757.5667",
      mzToleranceMode: "PPM",
      tolerance: "10",
      ionizationMode: "POSITIVE",
      adductsString: [
        "[M+H]+",
        "[M+2H]2+",
        "[M+Na]+",
        "[M+K]+",
        "[M+NH4]+",
        "[M+H-H2O]+",
      ],
      databases: DEFAULT_DATABASES,
      metaboliteType: "ALL",
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      mz: "",
      tolerance: "",
      mzToleranceMode: "",
      metaboliteType: "",
      ionizationMode: "",
      adductsString: [],
      databases: [],
    });
  };

  const countDuplicates = (compounds) => {
    const compoundCount = {};
    let duplicates = 0;

    compounds.forEach((compound) => {
      const compoundId = compound.compoundId;
      compoundCount[compoundId] = (compoundCount[compoundId] || 0) + 1;
    });

    Object.values(compoundCount).forEach((count) => {
      if (count > 1) {
        duplicates += count - 1;
      }
    });

    return duplicates;
  };

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "databases") {
        setFormState((prev) => ({
          ...prev,
          databases: toggleDatabaseSelection(prev.databases, value, checked),
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

    const formattedData = {
      mz: parseFloat(formState.mz),
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
        `${import.meta.env.VITE_API_URL}compounds/simple-search`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Response: " + response);
      console.log("Response data: " + response.data);
      console.log("Response data msFeatures: " + response.data.msFeatures);

      const rawResults = response.data;

      const adductGroups = [];

      if (Array.isArray(rawResults.msfeatures)) {
        rawResults.msfeatures.forEach((feature, featureIndex) => {
          const annotationsByAdducts = feature.annotationsByAdducts;

          if (Array.isArray(annotationsByAdducts)) {
            annotationsByAdducts.forEach(({ adduct, annotations }, adductIndex) => {
              const compounds = Array.isArray(annotations)
                ? annotations.map((annotation, annotationIndex) =>
                    normalizeAnnotation(
                      annotation,
                      `${featureIndex}-${adductIndex}-${annotationIndex}`
                    )
                  )
                : [];

              adductGroups.push({
                adduct,
                compounds,
              });
            });
          }
        });
      } else {
        console.error("Expected response.data.msfeatures to be an array");
      }

      const groupedByAdductView = buildGroupedResultsView(
        adductGroups,
        formState.adductsString,
        {
          labelKey: "adduct",
          compoundsKey: "compounds",
          fallbackLabel: "Adduct",
        }
      );

      setMatchedAdductCount(groupedByAdductView.matchedGroupCount);
      setTotalAdductCount(formState.adductsString.length);

      const allCompounds = groupedByAdductView.displayGroups.flatMap(
        (group) => group.compounds
      );
      const duplicateCount = countDuplicates(allCompounds);
      console.log("Duplicate Count: ", duplicateCount);

      console.log("Raw results:", rawResults);

      toast.dismiss();
      toast.success("Form submitted successfully!", {
        autoClose: 2000,
        closeOnClick: true,
        draggable: true,
        position: "middle-left",
      });
      setResults(groupedByAdductView.summaryResults);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting search:", error.response || error);
      toast.dismiss();
      toast.error(formatApiError(error, { action: "submit your search" }));
    } finally {
      setLoading(false);
    }
  };

  const resultGroups = resultMapToGroups(results, {
    labelKey: "adduct",
    compoundsKey: "compounds",
  }).filter(
    (group) => Array.isArray(group.compounds) && group.compounds.length > 0
  );
  const hasResultCompounds = resultGroups.length > 0;

  return (
    <div className="page">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}
      
      <header className="title-header">
        <span className="title-text">Simple Search</span>
      </header>

      <div
        className="page outer-container row"
        style={{ cursor: loading ? "wait" : "default" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid-container">
            <TextInput
              label="Experimental Mass"
              name="mz"
              value={formState.mz}
              onChange={handleChange}
              placeholder="Enter mass value"
              className="experimental-mass-div"
            />

            <GroupRadio
              label="Metabolites"
              name="metaboliteType"
              value={formState.metaboliteType}
              options={["ALL", "ONLYLIPIDS"]}
              onChange={handleChange}
              className="metabolites-div"
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
          </div>

          <div className="form-buttons-container center-button">
            <button type="submit">Submit</button>
          </div>
        </form>
        <ToastContainer limit={1} />

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
            <ResultsSummary
              results={results}
              matchedAdductCount={matchedAdductCount}
              totalAdductCount={totalAdductCount}
            />

            {!hasResultCompounds && (
              <p className="no-results">No results found for this query.</p>
            )}

            {resultGroups.map((group) => (
              <ResultsDropdownGroup
                key={group.adduct}
                adduct={group.adduct}
                compounds={group.compounds}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleSearch;
