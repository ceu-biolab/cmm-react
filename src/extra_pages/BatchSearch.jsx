import { useState } from "react";
import axios from "axios";

const BatchSearch = () => {
  axios.defaults.httpsAgent = undefined;

  const [searchData, setSearchData] = useState({
    experimentalMasses: [],
    tolerance: "10",
    toleranceType: "ppm",
    metabolites: "all-except-peptides",
    massMode: "mode1",
    ionizationMode: "ionization1",
    adducts: [],
    databases: [],
  });

  const [results, setResults] = useState([]); // Store search results

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare the experimentalMasses as an array before sending
      const massArray = searchData.experimentalMasses
        .split(",")
        .map((mass) => parseFloat(mass.trim()))
        .filter((mass) => !isNaN(mass));

      // Update searchData with parsed masses
      const updatedSearchData = {
        ...searchData,
        experimentalMasses: massArray,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}`,
        updatedSearchData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("API Response:", response.data);
      // setResults(response.data);
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

  // Load Demo Data function
  const loadDemoData = () => {
    setSearchData({
      experimentalMasses: [
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
        "502.29303",
        "526.2927",
        "548.27484",
        "512.33417",
        "534.31616",
        "540.3651",
        "357.29926",
        "130.15865",
        "282.2793",
        "283.2637",
        "265.25244",
        "257.24796",
        "256.26474",
        "649.5228",
        "647.5117",
        "673.52704",
        "695.50885",
        "426.35757",
        "268.10373",
        "184.09554",
        "175.11816",
        "585.27026",
        "195.08762",
        "162.11313",
        "363.21667",
        "114.06652",
        "156.07611",
        "166.08543",
        "431.3844",
      ],
      tolerance: "10",
      toleranceType: "ppm",
      metabolites: "all-except-peptides",
      massMode: "mode2",
      ionizationMode: "ionization1",
      adducts: ["M+H", "M+2H", "M+Na", "M+K", "M+NH4", "M+H-H2O"],
      databases: ["All (Including In Silico Compounds)"],
    });
  };

  // Clear Input function
  const clearInput = () => {
    setSearchData({
      experimentalMasses: [""],
      tolerance: "10",
      toleranceType: "ppm",
      metabolites: "all-except-peptides",
      massMode: "mode1",
      ionizationMode: "ionization1",
      adducts: [],
      databases: [],
    });
  };

  return (
    <div className="page outer-container">
      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="row">
            <div className="column">
              {/* Experimental Masses Input */}
              <div className="inner-column">
                <label className="inner-column-label">
                  Experimental Masses
                </label>
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

              {/* Tolerance Input */}
              <div className="inner-column">
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
            </div>

            <div className="column">
              {/* Metabolites Selection */}
              <div className="inner-column">
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
                        : "All including peptides"}{" "}
                    </label>
                  ))}
                </div>
              </div>

              <div className="inner-column">
                {/* Ionization Mode */}
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
            </div>

            <div className="column">
              <div className="inner-column">
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
            </div>

            <div className="column">
              {/* Databases (Checkboxes) */}
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
          </div>

          <div className="align-buttons-container">
            {/* Submit Button */}
            <div className="form-buttons-container center-button">
              <button type="submit">Submit</button>
            </div>

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
        </form>
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

export default BatchSearch;
