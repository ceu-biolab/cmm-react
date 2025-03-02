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
    <div className="outer-container">
      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="left-container">
            <div className="top-row">
              {/* Experimental Mass Input */}
              <div className="top-column">
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
              <div className="top-column">
                <label>Tolerance:</label>
                <input
                  type="text"
                  name="tolerance"
                  value={searchData.tolerance}
                  onChange={handleChange}
                />
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
              </div>

              <div className="bottom-column">
                <label>Metabolites:</label>
                <div>
                  <label class="box">
                    <input
                      type="radio"
                      name="metabolites"
                      value="all-except-peptides"
                      checked={searchData.metabolites === "all-except-peptides"}
                      onChange={handleChange}
                    />
                    All except peptides
                  </label>
                  <label class="box">
                    <input
                      type="radio"
                      name="metabolites"
                      value="only-lipids"
                      checked={searchData.metabolites === "only-lipids"}
                      onChange={handleChange}
                    />
                    Only lipids
                  </label>
                  <label class="box">
                    <input
                      type="radio"
                      name="metabolites"
                      value="all-including-peptides"
                      checked={
                        searchData.metabolites === "all-including-peptides"
                      }
                      onChange={handleChange}
                    />
                    All including peptides
                  </label>
                </div>
              </div>
            </div>

            {/* Metabolites Selection */}
            <div className="bottom-row">
              {/* Mass Mode */}
              <div className="bottom-column">
                <label>Mass Mode:</label>
                <div>
                  <label class="box">
                    <input
                      type="radio"
                      name="massMode"
                      value="mode1"
                      checked={searchData.massMode === "mode1"}
                      onChange={handleChange}
                    />
                    Neutral Masses
                  </label>
                  <label class="box">
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
              </div>

              {/* Ionization Mode */}
              <div className="bottom-column">
                <label>Ionization Mode:</label>
                <div>
                  <label class="box">
                    <input
                      type="radio"
                      name="ionizationMode"
                      value="ionization1"
                      checked={searchData.ionizationMode === "ionization1"}
                      onChange={handleChange}
                    />
                    Neutral
                  </label>
                  <label class="box">
                    <input
                      type="radio"
                      name="ionizationMode"
                      value="ionization2"
                      checked={searchData.ionizationMode === "ionization2"}
                      onChange={handleChange}
                    />
                    Positive Mode
                  </label>
                  <label class="box">
                    <input
                      type="radio"
                      name="ionizationMode"
                      value="ionization3"
                      checked={searchData.ionizationMode === "ionization3"}
                      onChange={handleChange}
                    />
                    Negative Mode
                  </label>
                </div>
              </div>

              {/* Adducts */}
              <div className="bottom-column">
                <label>Adducts</label>
                <div>
                  <label class="box">
                    <input
                      type="radio"
                      name="adducts"
                      value="adduct1"
                      checked={searchData.adducts === "adduct1"}
                      onChange={handleChange}
                    />
                    All
                  </label>
                  <label class="box">
                    <input
                      type="radio"
                      name="adducts"
                      value="adduct2"
                      checked={searchData.adducts === "adduct2"}
                      onChange={handleChange}
                    />
                    M
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="right-container">
            {/* Databases (Checkboxes) */}
            <label>Databases:</label>
            <div>
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

          {/* Submit Button */}
          <div className="submit-button">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
