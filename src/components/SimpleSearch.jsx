import { useState } from "react";
import axios from "axios";

const SimpleSearch = () => {
  const [searchData, setSearchData] = useState({
    experimentalMass: "",
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/search`,
        searchData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("API Response:", response.data);
      setResults(response.data); // Update with actual results
    } catch (error) {
      console.error("Error submitting search:", error);
      alert("There was an error submitting your search. Using dummy data.");
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
          Metlin: "40729",
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
          Metlin: "40746",
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
          Metlin: "77280",
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
          Metlin: "77040",
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
          Metlin: "76788",
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
          Metlin: "75729",
          PubChem: "",
          KNApSAcK: "",
          NPAtlas: "",
        },
      ];
      // Set dummy data only on failure
      setResults(dummyData);
    }
  };

  // Load Demo Data function
  const loadDemoData = () => {
    setSearchData({
      experimentalMass: "757.5667",
      tolerance: "10",
      toleranceType: "ppm",
      metabolites: "all-except-peptides",
      massMode: "mode2",
      ionizationMode: "ionization1",
      adducts: ["M+H", "M+2H", "M+Na", "M+K", "M+NH4", "M+H-H2O"],
      databases: ["All except MINE"],
    });
  };

  // Clear Input function
  const clearInput = () => {
    setSearchData({
      experimentalMass: "",
      tolerance: "10",
      toleranceType: "ppm",
      metabolites: "all-except-peptides",
      massMode: "mode1",
      ionizationMode: "ionization1",
      adducts: "[]",
      databases: [],
    });
  };

  return (
    <div className="outer-container">
      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="row">
            <div className="column">
              {/* Experimental Mass Input */}
              <div className="inner-column">
                <label>Experimental Mass:</label>
                <input
                  type="text"
                  name="experimentalMass"
                  value={searchData.experimentalMass}
                  onChange={handleChange}
                  placeholder="Enter mass values"
                />
              </div>

              {/* Tolerance Input */}
              <div className="inner-column">
                <label>Tolerance:</label>
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
                <label>Metabolites:</label>
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
                      {option.replace(/-/g, " ")}
                    </label>
                  ))}
                </div>
              </div>

              {/* Mass Mode */}
              <div className="inner-column">
                <label>Mass Mode:</label>
                <div>
                  {["mode1", "mode2"].map((mode) => (
                    <label key={mode} className="box">
                      <input
                        className="radio"
                        type="radio"
                        name="massMode"
                        value={mode}
                        checked={searchData.massMode === mode}
                        onChange={handleChange}
                      />
                      {mode === "mode1" ? "Neutral Masses" : "m/z Masses"}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="column">
              {/* Ionization Mode */}
              <div className="inner-column">
                <label>Ionization Mode:</label>
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
                {/* Adducts (Checkboxes) */}
                <label>Adducts</label>
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
                  "All except MINE",
                  "All (Including In Silico Compounds)",
                  "HMDB",
                  "LipidMaps",
                  "Metlin",
                  "Kegg",
                  "In-house",
                  "Aspergillus",
                  "FAHFA Lipids",
                  "MINE (Only In Silico Compounds)",
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
            <div className="submit-button center-button">
              <button type="submit">Submit</button>
            </div>

            {/* Load Demo Data and Clear Input */}
            <div className="other-buttons">
              <div className="submit-button">
                <button type="button" onClick={loadDemoData}>
                  Load Demo Data
                </button>
              </div>

              <div className="submit-button">
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
                <th>Metlin</th>
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
                      href={`https://dummy-link.com/metlin/${item.Metlin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.Metlin}
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

export default SimpleSearch;
