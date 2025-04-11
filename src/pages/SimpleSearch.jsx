import { useState, useEffect } from "react";
import axios from "axios";
import ExperimentalMassInput from "../components/search/ExperimentalMassInput.jsx";
import MetabolitesSelection from "../components/search/MetabolitesSelection";
import AdductsCheckboxes from "../components/search/AdductsCheckboxes";
import DatabasesCheckboxes from "../components/search/DatabasesCheckboxes";
import ToleranceSelection from "../components/search/ToleranceSelection";
import IonizationSelection from "../components/search/IonizationSelection";
import ResultsTable from "../components/search/ResultsTable.jsx";
import CompoundViewer from "../components/search/CompoundViewer.jsx";
import ResultsDropdownGroup from "../components/search/ResultsDropdownGroup";

const SimpleSearch = () => {
  const [formState, setFormState] = useState({
    mz: "",
    tolerance: "",
    toleranceMode: "ppm",
    ionizationMode: "Positive Mode",
    metaboliteType: "All except peptides",
    adductsString: [],
    databases: [],
  });

  const [results, setResults] = useState([]);

  const [showResults, setShowResults] = useState(false);

  const loadDemoData = () => {
    console.log("Loading demo data...");
    setFormState({
      mz: "757.5667",
      tolerance: "10",
      toleranceMode: "ppm",
      metaboliteType: "ONLYLIPIDS",
      ionizationMode: "Positive Mode",
      adductsString: ["M+H", "M+2H", "M+Na", "M+K", "M+NH4", "M+H-H2O"],
      databases: ["HMDB"],
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      mz: "",
      tolerance: "10",
      toleranceMode: "ppm",
      metaboliteType: "All except peptides",
      ionizationMode: "Positive Mode",
      adductsString: [],
      databases: [],
    });
  };

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "adductsString") {
        setFormState((prev) => ({
          ...prev,
          adductsString: checked
            ? [...prev.adductsString, value]
            : prev.adductsString.filter((adduct) => adduct !== value),
        }));
      } else if (name === "databases") {
        setFormState((prev) => ({
          ...prev,
          databases: checked
            ? [...prev.databases, value]
            : prev.databases.filter((db) => db !== value),
        }));
      }
    } else {
      // For other inputs, like text or select
      setFormState((prev) => ({ ...prev, [name]: value || null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      mz: parseFloat(formState.mz),
      tolerance: parseFloat(formState.tolerance),
      toleranceMode: formState.toleranceMode,
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

      const rawResults = response.data;

      const groupedByAdduct = {};

      rawResults.forEach((result) => {
        result.potentialAnnotations?.forEach((annotation) => {
          const { adduct, cmm_compounds } = annotation;
          if (!groupedByAdduct[adduct]) {
            groupedByAdduct[adduct] = [];
          }
          groupedByAdduct[adduct].push(...cmm_compounds);
        });
      });

      console.log("Raw results:", rawResults);

      setResults(groupedByAdduct);
      alert("Request accepted.");
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting search:", error.response || error);
      alert("There was an error submitting your search");
    }
  };

  return (
    <div className="page outer-container row">
      <div className="search-title">
        <h3>Simple Search</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid-container">
          <ExperimentalMassInput mz={formState.mz} onChange={handleChange} />

          <MetabolitesSelection
            searchData={formState}
            onChange={handleChange}
          />

          <AdductsCheckboxes
            selectedAdducts={formState.adductsString}
            onChange={handleChange}
          />

          <DatabasesCheckboxes
            selectedDatabases={formState.databases}
            onChange={handleChange}
          />

          <ToleranceSelection searchData={formState} onChange={handleChange} />

          <IonizationSelection
            ionizationMode={formState.ionizationMode}
            onChange={handleChange}
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
          Object.entries(results).map(([adduct, compounds]) => (
            <ResultsDropdownGroup
              key={adduct}
              adduct={adduct}
              compounds={compounds}
            />
          ))}
      </div>
    </div>
  );
};

export default SimpleSearch;
