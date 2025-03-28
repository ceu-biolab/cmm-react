import { useState, useEffect } from "react";
import axios from "axios";
import ExperimentalMassInput from "../components/search/ExperimentalMassInput.jsx";
import MetabolitesSelection from "../components/search/MetabolitesSelection";
import AdductsCheckboxes from "../components/search/AdductsCheckboxes";
import DatabasesCheckboxes from "../components/search/DatabasesCheckboxes";
import ToleranceSelection from "../components/search/ToleranceSelection";
import IonizationSelection from "../components/search/IonizationSelection";

const SimpleSearch = () => {
  axios.defaults.httpsAgent = undefined;

  const [searchData, setSearchData] = useState({
    experimentalMass: "",
    tolerance: "10",
    toleranceType: "ppm",
    metabolites: "all-except-peptides",
    ionizationMode: "ionization1",
    adducts: [],
    databases: [],
  });

  const [_, forceUpdate] = useState(false);

  const loadDemoData = () => {
    console.log("Loading demo data...");
    setSearchData({
      experimentalMass: "757.5667",
      tolerance: "10",
      toleranceType: "ppm",
      metabolites: "only-lipids",
      ionizationMode: "ionization2",
      adducts: ["M+H", "M+2H", "M+Na", "M+K", "M+NH4", "M+H-H2O"],
      databases: ["All (Including In Silico Compounds)"],
    });
    forceUpdate((prev) => !prev);
    console.log("Forcing update");
  };

  const clearInput = () => {
    console.log("Clearing input...");
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

  {
    /* Store search results */
  }
  // const [results, setResults] = useState([]);

  useEffect(() => {
    console.log("Updated searchData:", searchData);
  }, [searchData]); // ✅ Runs every time searchData changes

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "adducts") {
      setSearchData((prev) => ({
        ...prev,
        adducts: checked
          ? [...prev.adducts, value]
          : prev.adducts.filter((adduct) => adduct !== value),
      }));
    } else if (type === "checkbox") {
      setSearchData((prev) => ({
        ...prev,
        databases: checked
          ? [...prev.databases, value]
          : prev.databases.filter((db) => db !== value),
      }));
    } else {
      setSearchData((prev) => ({ ...prev, [name]: value }));
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

  return (
    <div className="page outer-container row">
      <div className="search-title">
        <h3>Simple Search</h3>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-form grid-container">
          <ExperimentalMassInput
            experimentalMass={searchData.experimentalMass}
            onChange={handleChange}
          />

          <MetabolitesSelection
            searchData={searchData}
            onChange={handleChange}
          />

          <AdductsCheckboxes
            selectedAdducts={searchData.adducts}
            onChange={handleChange}
          />

          <DatabasesCheckboxes
            selectedDatabases={searchData.databases}
            onChange={handleChange}
          />

          <ToleranceSelection searchData={searchData} onChange={handleChange} />

          <IonizationSelection
            ionizationMode={searchData.ionizationMode}
            onChange={handleChange}
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
