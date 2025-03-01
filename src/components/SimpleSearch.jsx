import { useState } from "react";
import axios from "axios";

const SearchForm = () => {
  // State for form inputs
  const [searchData, setSearchData] = useState({
    experimentalMass: "",
    tolerance: "10",
    toleranceType: "ppm",
    metabolites: "all-except-peptides",
    massMode: "mode1",
    ionizationMode: "ionization1",
    adducts: "adduct1",
    databases: [],
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle checkboxes (databases)
      setSearchData((prev) => ({
        ...prev,
        databases: checked
          ? [...prev.databases, value]
          : prev.databases.filter((db) => db !== value),
      }));
    } else {
      // Handle text and radio inputs
      setSearchData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/search",
        searchData
      );
      console.log("Response:", response.data);
      alert("Search submitted successfully!");
    } catch (error) {
      console.error("Error submitting search:", error);
      alert("There was an error submitting your search.");
    }
  };

  return (
    <div className="search-container">
      <h2>Simple Search</h2>
      <form onSubmit={handleSubmit}>
        {/* Experimental Mass Input */}
        <label>Experimental Mass:</label>
        <input
          type="text"
          name="experimentalMass"
          value={searchData.experimentalMass}
          onChange={handleChange}
          placeholder="Enter mass values"
        />

        {/* Tolerance Input */}
        <label>Tolerance:</label>
        <input
          type="text"
          name="tolerance"
          value={searchData.tolerance}
          onChange={handleChange}
        />

        {/* Tolerance Type (ppm/mDa) */}
        <div>
          <label>
            <input
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
              type="radio"
              name="toleranceType"
              value="mDa"
              checked={searchData.toleranceType === "mDa"}
              onChange={handleChange}
            />
            mDa
          </label>
        </div>

        {/* Metabolites Selection */}
        <label>Metabolites:</label>
        <select
          name="metabolites"
          value={searchData.metabolites}
          onChange={handleChange}
        >
          <option value="all-except-peptides">All except peptides</option>
          <option value="only-lipids">Only lipids</option>
          <option value="all-including-peptides">All including peptides</option>
        </select>

        {/* Mass Mode */}
        <label>Mass Mode:</label>
        <div>
          <label>
            <input
              type="radio"
              name="massMode"
              value="mode1"
              checked={searchData.massMode === "mode1"}
              onChange={handleChange}
            />
            Neutral Masses
          </label>
          <label>
            <input
              type="radio"
              name="massMode"
              value="mode2"
              checked={searchData.massMode === "mode2"}
              onChange={handleChange}
            />
            m/z Masses
          </label>
        </div>

        {/* Ionization Mode */}
        <label>Ionization Mode:</label>
        <div>
          <label>
            <input
              type="radio"
              name="ionizationMode"
              value="ionization1"
              checked={searchData.ionizationMode === "ionization1"}
              onChange={handleChange}
            />
            Neutral
          </label>
          <label>
            <input
              type="radio"
              name="ionizationMode"
              value="ionization2"
              checked={searchData.ionizationMode === "ionization2"}
              onChange={handleChange}
            />
            Positive
          </label>
          <label>
            <input
              type="radio"
              name="ionizationMode"
              value="ionization3"
              checked={searchData.ionizationMode === "ionization3"}
              onChange={handleChange}
            />
            Negative
          </label>
        </div>

        {/* Databases (Checkboxes) */}
        <label>Databases:</label>
        <div>
          {["HMDB", "LipidMaps", "Metlin", "Kegg"].map((db) => (
            <label key={db}>
              <input
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

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SearchForm;
