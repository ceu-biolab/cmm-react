import { useState } from "react";
import axios from "axios";

const MsMsSearch = () => {
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
  const [results, setResults] = useState([]);

  {
    /* File upload function */
  }
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        console.log("File content:", text);
      };
      reader.readAsText(file);
    }
  };

  {
    /* Handle changes with checkboxes function */
  }
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "adducts") {
      setSearchData((prev) => ({
        ...prev,
        adducts: checked
          ? [...prev.adducts, value] // Add adduct to array if checked
          : prev.adducts.filter((adduct) => adduct !== value), // Remove adduct from array if unchecked
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

  {
    /* Handle form submission function */
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}`,
        searchData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("API Response:", response.data);
      //setResults(response.data);
      alert("Request accepted.");
      const dummyData = [
        {
          id: 164773,
          name: "PE-NMe(18:1(9Z)/18:1(9Z))[U]",
          formula: "C42H80NO8P",
          molecularWeight: 757.56216,
          errorPPM: 6,
          ionizationScore: "N/A",
          Cas: "",
          KEGG: "",
          CHEBI: "",
          HMDB: "",
          LipidMaps: "",
          PubChem: "",
          KNApSAcK: "",
          NPAtlas: "",
        },
        {
          id: 164774,
          name: "PE-NMe(18:1(9E)/18:1(9E))[U]",
          formula: "C42H80NO8P",
          molecularWeight: 757.56216,
          errorPPM: 6,
          ionizationScore: "N/A",
          Cas: "",
          KEGG: "",
          CHEBI: "",
          HMDB: "",
          LipidMaps: "",
          PubChem: "",
          KNApSAcK: "",
          NPAtlas: "",
        },
        {
          id: 3840,
          name: "PE(22:1(11Z)/15:1(9Z))",
          formula: "C42H80NO8P",
          molecularWeight: 757.56216,
          errorPPM: 6,
          ionizationScore: 2.0,
          Cas: "",
          KEGG: "",
          CHEBI: "",
          HMDB: "",
          LipidMaps: "LMGP02011045",
          PubChem: "",
          KNApSAcK: "",
          NPAtlas: "",
        },
        {
          id: 3600,
          name: "PE(19:1(9Z)/18:1(9Z))",
          formula: "C42H80NO8P",
          molecularWeight: 757.56216,
          errorPPM: 6,
          ionizationScore: 2.0,
          Cas: "",
          KEGG: "",
          CHEBI: "",
          HMDB: "",
          LipidMaps: "LMGP02010805",
          PubChem: "",
          KNApSAcK: "",
          NPAtlas: "",
        },
        {
          id: 3348,
          name: "PE(17:0/20:2(11Z,14Z))",
          formula: "C42H80NO8P",
          molecularWeight: 757.56216,
          errorPPM: 6,
          ionizationScore: 2.0,
          Cas: "",
          KEGG: "",
          CHEBI: "",
          HMDB: "",
          LipidMaps: "LMGP02010553",
          PubChem: "",
          KNApSAcK: "",
          NPAtlas: "",
        },
        {
          id: 1824,
          name: "PC(15:1(9Z)/19:1(9Z))",
          formula: "C42H80NO8P",
          molecularWeight: 757.56216,
          errorPPM: 6,
          ionizationScore: 2.0,
          Cas: "",
          KEGG: "",
          CHEBI: "179033",
          HMDB: "",
          LipidMaps: "LMGP01011449",
          PubChem: "",
          KNApSAcK: "",
          NPAtlas: "",
        },
      ];
      setResults(dummyData);
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
      {/* Page title */}
      <div class="ms-ms-title">
        <h3>MS/MS Search</h3>
      </div>
      <form onSubmit={handleSubmit} className="search-form grid-container">
        {/* Experimental Masses Input */}
        <div className="inner-column">
          <label className="inner-column-label">Experimental Masses</label>
          <textarea
            name="experimentalMasses"
            value={searchData.experimentalMasses}
            onChange={handleChange}
            placeholder="Enter mass values (comma separated)"
            rows="6"
            cols="35"
          />
          {/* File Upload Button with SVG Icon */}
          <label htmlFor="file-upload" className="custom-file-upload">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-file-earmark-arrow-up-fill"
              viewBox="0 0 16 16"
            >
              <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z" />
            </svg>
          </label>
          <input
            type="file"
            id="file-upload"
            accept=".txt,.csv"
            onChange={handleFileUpload}
          />
        </div>

        {/* Metabolites Selection */}
        <div className="metabolites-div">
          <label className="inner-column-label">Metabolites</label>
          <div>
            {[
              "all-except-peptides",
              "only-lipids",
              "all-including-peptides",
            ].map((option) => (
              <label key={option} className="box">
                <input
                  className="radio"
                  type="radio"
                  name="metabolites"
                  value={option}
                  checked={searchData.metabolites === option}
                  onChange={handleChange}
                />
                {option === "all-except-peptides"
                  ? "All except peptides"
                  : option === "only-lipids"
                  ? "Only lipids"
                  : "All including peptides"}
              </label>
            ))}
          </div>
        </div>

        {/* Adducts (Checkboxes) */}
        <div className="adducts-div">
          {/* Adducts (Checkboxes) */}
          <label className="inner-column-label">Adducts</label>
          <div className="scrollable-checkboxes">
            {[
              "All",
              "M+H",
              "M+2H",
              "M+Na",
              "M+K",
              "M+NH4",
              "M+H-H2O",
              "M+H+NH4",
              "2M+H",
              "2M+Na",
              "M+H+HCOONa",
              "2M+H-H2O",
              "M+3H",
              "M+2H+Na",
              "M+H+2K",
              "M+H+2Na",
              "M+3Na",
              "M+H+Na",
              "M+H+K",
              "M+ACN+2H",
              "M+2Na",
              "M+2ACN+2H",
              "M+CH3OH+H",
              "M+ACN+H",
              "M+2Na-H",
              "M+IsoProp+H",
              "M+ACN+Na",
              "M+2K-H",
              "M+DMSO+H",
              "M+2ACN+H",
              "M+IsoProp+Na+H",
              "2M+NH4",
              "2M+K",
              "2M+ACN+H",
              "2M+ACN+Na",
              "3M+H",
              "3M+Na",
              "M+H-2H2O",
              "M+NH4-H2O",
              "M+Li",
              "2M+2H+3H2O",
              "M+H+CH3COOH",
              "M+H+CH3COONa",
              "M+F+H",
            ].map((adduct) => (
              <label key={adduct}>
                <input
                  className="radio"
                  type="checkbox"
                  name="adducts"
                  value={adduct}
                  checked={searchData.adducts.includes(adduct)}
                  onChange={handleChange}
                />
                {adduct}
              </label>
            ))}
          </div>
        </div>

        {/* Databases (Checkboxes) */}
        <div className="databases-div">
          <label>Databases</label>
          <div className="checkboxes">
            {[
              "All (Including In Silico Compounds)",
              "HMDB",
              "LipidMaps",
              "Kegg",
              "In-house",
              "Aspergillus",
              "FAHFA Lipids",
            ].map((db) => (
              <label key={db}>
                <input
                  className="radio"
                  type="checkbox"
                  name="databases"
                  value={db}
                  checked={searchData.databases.includes(db)}
                  onChange={handleChange}
                />
                {db}
              </label>
            ))}
          </div>
        </div>

        {/* Tolerance Input */}
        <div className="tolerance-div">
          <label className="inner-column-label">Tolerance</label>
          <input
            type="text"
            name="tolerance"
            value={searchData.tolerance}
            onChange={handleChange}
          />
          <label>
            <input
              className="radio"
              type="radio"
              name="toleranceType"
              value="ppm"
              checked={searchData.toleranceType === "ppm"}
              onChange={handleChange}
            />
            ppm
          </label>
          <label>
            <input
              className="radio"
              type="radio"
              name="toleranceType"
              value="mDa"
              checked={searchData.toleranceType === "mDa"}
              onChange={handleChange}
            />
            mDa
          </label>
        </div>

        {/* Ionization Mode */}
        <div className="ionization-div">
          <label className="inner-column-label">Ionization Mode</label>
          <div>
            {["ionization1", "ionization2", "ionization3"].map((mode) => (
              <label key={mode} className="box">
                <input
                  className="radio"
                  type="radio"
                  name="ionizationMode"
                  value={mode}
                  checked={searchData.ionizationMode === mode}
                  onChange={handleChange}
                />
                {mode === "ionization1"
                  ? "Neutral"
                  : mode === "ionization2"
                  ? "Positive Mode"
                  : "Negative Mode"}
              </label>
            ))}
          </div>
        </div>
        {/* Submit Button */}
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

      {/* Table to Display Results */}
      {results.length > 0 && (
        <div className="results-container">
          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Formula</th>
                <th>Molecular Weight</th>
                <th>Error PPM</th>
                <th>Ionization Score</th>
                <th>CAS</th>
                <th>KEGG</th>
                <th>CHEBI</th>
                <th>HMDB</th>
                <th>LipidMaps</th>
                <th>PubChem</th>
                <th>KNApSAcK</th>
                <th>NP Atlas</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item) => (
                <tr key={item.id}>
                  <td>
                    <a
                      href={`https://dummy-link.com/cas/${item.Cas}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.id}
                    </a>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.formula}</td>
                  <td>{item.molecularWeight}</td>
                  <td>{item.errorPPM}</td>
                  <td>{item.ionizationScore}</td>
                  <td>
                    <a
                      href={`https://dummy-link.com/cas/${item.Cas}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.Cas}
                    </a>
                  </td>
                  <td>
                    <a
                      href={`https://dummy-link.com/kegg/${item.KEGG}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.KEGG}
                    </a>
                  </td>
                  <td>
                    <a
                      href={`https://dummy-link.com/chebi/${item.CHEBI}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.CHEBI}
                    </a>
                  </td>
                  <td>
                    <a
                      href={`https://dummy-link.com/hmdb/${item.HMDB}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.HMDB}
                    </a>
                  </td>
                  <td>
                    <a
                      href={`https://dummy-link.com/lipidmaps/${item.LipidMaps}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.LipidMaps}
                    </a>
                  </td>
                  <td>
                    <a
                      href={`https://dummy-link.com/pubchem/${item.PubChem}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.PubChem}
                    </a>
                  </td>
                  <td>
                    <a
                      href={`https://dummy-link.com/knapsack/${item.KNApSAcK}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.KNApSAcK}
                    </a>
                  </td>
                  <td>
                    <a
                      href={`https://dummy-link.com/npatlas/${item.NPAtlas}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.NPAtlas}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MsMsSearch;
