import { useState, useEffect } from "react";
import axios from "axios";
import AdductsCheckboxes from "../components/search/AdductsCheckboxes";
import DatabasesCheckboxes from "../components/search/DatabasesCheckboxes";
import ResultsDropdownGroup from "../components/search/ResultsDropdownGroup";
import searchIcon from "../assets/svgs/search-svg.svg";
import TextBoxInput from "../components/search/TextBoxInput.jsx";
import GroupRadio from "../components/search/GroupRadio.jsx";
import ToleranceRadio from "../components/search/ToleranceRadio.jsx";

const BatchSearch = () => {
  const [formState, setFormState] = useState({
    mz: [],
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
      mz: [
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
      ],
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
      mz: [],
      tolerance: "10",
      toleranceMode: "ppm",
      metaboliteType: "All except peptides",
      ionizationMode: "Neutral",
      adductsString: [],
      databases: [],
    });
  };

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "mz") {
      const newMZValues = value.split(",").map((val) => parseFloat(val.trim()));
      setFormState((prev) => ({ ...prev, [name]: newMZValues }));
    } else if (type === "checkbox") {
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
      mz: formState.mz.map((mass) => parseFloat(mass)),
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
        `${import.meta.env.VITE_API_URL}compounds/batch-search`,
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
    <div className="page">
      <header className="title-header">
        <img src={searchIcon} alt="Search Icon" className="icon" />
        <span className="title-text">Batch Search</span>
      </header>
      <div className="page outer-container row">
        <form onSubmit={handleSubmit}>
          <div className="grid-container">
            <TextBoxInput
              label="Experimental Masses"
              name="mz"
              value={formState.mz}
              onChange={handleChange}
              className="masses-text-box-batch"
            />

            <GroupRadio
              label="Metabolites"
              name="metaboliteType"
              value={formState.metaboliteType}
              options={[
                "All except peptides",
                "ONLYLIPIDS",
                "All including peptides",
              ]}
              onChange={handleChange}
              className="metabolites-div"
            />

            <AdductsCheckboxes
              selectedAdducts={formState.adductsString}
              onChange={handleChange}
            />

            <DatabasesCheckboxes
              selectedDatabases={formState.databases}
              onChange={handleChange}
            />

            <ToleranceRadio
              label="Tolerance"
              toleranceValue={formState.tolerance}
              toleranceMode={formState.toleranceMode}
              onChange={handleChange}
            />

            <GroupRadio
              label="Ionization Mode"
              name="ionizationMode"
              value={formState.ionizationMode}
              options={["Neutral", "Positive Mode", "Negative Mode"]}
              onChange={handleChange}
              className="ionization-div"
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
    </div>
  );
};

export default BatchSearch;
