import { useState, useEffect } from "react";
import axios from "axios";
import TextInput from "../components/search/TextInput";
import GroupRadio from "../components/search/GroupRadio";
import DatabasesCheckboxes from "../components/search/DatabasesCheckboxes";
import ResultsDropdownGroup from "../components/search/ResultsDropdownGroup";
import searchIcon from "../assets/svgs/search-svg.svg";

const BrowseSearch = () => {
  const [formState, setFormState] = useState({
    name: "",
    formula: "",
    metaboliteType: "All except peptides",
    databases: [],
  });

  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const loadDemoData = () => {
    console.log("Loading demo data...");
    setFormState({
      name: "Choline",
      formula: "C5H14NO",
      metaboliteType: "ONLYLIPIDS",
      databases: ["HMDB"],
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      name: "",
      formula: "",
      metaboliteType: "All except peptides",
      databases: [],
    });
  };

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormState((prev) => ({
        ...prev,
        databases: checked
          ? [...prev.databases, value]
          : prev.databases.filter((db) => db !== value),
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value || null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      name: formState.name,
      formula: formState.formula,
      metaboliteType: formState.metaboliteType,
      databases: formState.databases,
    };

    console.log("Sending to backend:", JSON.stringify(formattedData, null, 2));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}compounds/browse-search`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;

      console.log("Raw results:", rawResults);

      setResults(rawResults);
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
        <span className="title-text">Browse Search</span>
      </header>

      <div className="page outer-container row outer-container-browse">
        <form onSubmit={handleSubmit}>
          <div className="grid-container-browse">
            <TextInput
              label="Name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="Compound name"
              className="compound-name-div"
            />

            <TextInput
              label="Formula"
              name="formula"
              value={formState.formula}
              onChange={handleChange}
              placeholder="Compound formula"
              className="compound-formula-div"
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
              className="metabolites-browse-div"
            />

            <DatabasesCheckboxes
              selectedDatabases={formState.databases}
              onChange={handleChange}
              className="databases-browse-div"
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

        {showResults && (
          <div className="results-div">
            <ResultsDropdownGroup compounds={results} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseSearch;
