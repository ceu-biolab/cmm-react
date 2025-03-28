import { useState } from "react";
import axios from "axios";
import ExperimentalMassInput from "../components/search/ExperimentalMassInput.jsx";
import MetabolitesSelection from "../components/search/MetabolitesSelection";
import AdductsCheckboxes from "../components/search/AdductsCheckboxes";
import DatabasesCheckboxes from "../components/search/DatabasesCheckboxes";
import ToleranceSelection from "../components/search/ToleranceSelection";
import IonizationSelection from "../components/search/IonizationSelection";

const SimpleSearch = () => {
  axios.defaults.httpsAgent = undefined;

  {
    /* Default input state */
  }
  const [searchData, setSearchData] = useState({
    experimentalMass: "",
    tolerance: "10",
    toleranceType: "ppm",
    metabolites: "all-except-peptides",
    ionizationMode: "ionization1",
    adducts: [],
    databases: [],
  });

  {
    /* Store search results */
  }
  // const [results, setResults] = useState([]);
  const [selectedAdducts, setSelectedAdducts] = useState([]);
  
  const [selectedDatabases, setSelectedDatabases] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setSearchData((prev) => ({
        ...prev,
        [name]: checked
        ? [...(prev[name] || []), value]
          : prev[name].filter((item) => item !== value),
      }));

      if (name === "adducts") {
        setSelectedAdducts((prev) =>
          checked ? [...prev, value] : prev.filter((adduct) => adduct !== value)
        );
      } else if (name === "databases") {
        setSelectedDatabases((prev) =>
          checked ? [...prev, value] : prev.filter((db) => db !== value)
        );
      }
    } else {
      setSearchData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}`,
        searchData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("API Response:", response.data);
      // setResults(response.data);
      alert("Request accepted.");
    } catch (error) {
      console.error("Error submitting search:", error);
      alert("There was an error submitting your search");
    }
  };

  {
    /* Load demo data function */
  }
  const loadDemoData = () => {
    setSearchData({
      experimentalMass: "757.5667",
      tolerance: "10",
      toleranceType: "ppm",
      metabolites: "all-except-peptides",
      ionizationMode: "ionization1",
      adducts: ["M+H", "M+2H", "M+Na", "M+K", "M+NH4", "M+H-H2O"],
      databases: ["All (Including In Silico Compounds)"],
    });
  };

  {
    /* Clear input function */
  }
  const clearInput = () => {
    setSearchData({
      experimentalMass: "",
      tolerance: "10",
      toleranceType: "ppm",
      metabolites: "all-except-peptides",
      ionizationMode: "ionization1",
      adducts: [],
      databases: [],
    });
  };

  return (
    <div className="page outer-container row">
      <div className="search-title">
        <h3>Simple Search</h3>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-form grid-container">
          <ExperimentalMassInput
            searchData={searchData}
            handleChange={handleChange}
          />

          <MetabolitesSelection
            searchData={searchData}
            handleChange={handleChange}
          />

          <AdductsCheckboxes
            selectedAdducts={selectedAdducts}
            onChange={handleChange}
          />

          <DatabasesCheckboxes
            selectedDatabases={selectedDatabases}
            onChange={handleChange}
          />

          <ToleranceSelection
            searchData={searchData}
            handleChange={handleChange}
          />

          <IonizationSelection
            searchData={searchData}
            handleChange={handleChange}
          />
        </div>

        <div className="form-buttons-container center-button">
          <button type="submit">Submit</button>
        </div>
      </form>

      <div className="align-buttons-container">
        {/* Load Demo Data and Clear Input */}
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
    </div>
  );
};

export default SimpleSearch;
