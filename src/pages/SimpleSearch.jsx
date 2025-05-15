import { useState, useEffect } from "react";
import axios from "axios";
import TextInput from "../components/search/TextInput";
import AdductsCheckboxes from "../components/search/AdductsCheckboxes";
import DatabasesCheckboxes from "../components/search/DatabasesCheckboxes";
import GroupRadio from "../components/search/GroupRadio";
import ResultsDropdownGroup from "../components/search/ResultsDropdownGroup";
import searchIcon from "../assets/svgs/search-svg.svg";
import ToleranceRadio from "../components/search/ToleranceRadio";
import { ToastContainer, toast } from "react-toastify";

const SimpleSearch = () => {
  const [formState, setFormState] = useState({
    mz: "",
    mzToleranceMode: "PPM",
    tolerance: "",
    ionizationMode: "POSITIVE",
    adductsString: [],
    databases: [],
    metaboliteType: "ALL",
  });

  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [matchedAdductCount, setMatchedAdductCount] = useState(0);
  const [totalAdductCount, setTotalAdductCount] = useState(0);
  const percentage = (matchedAdductCount / totalAdductCount) * 100 || 0;

  const loadDemoData = () => {
    console.log("Loading demo data...");
    setFormState({
      mz: "757.5667",
      mzToleranceMode: "PPM",
      tolerance: "10",
      ionizationMode: "POSITIVE",
      adductsString: ["M+H", "M+2H", "M+Na", "M+K", "M+NH4", "M+H-H2O"],
      databases: [
        "HMDB",
        "LIPIDMAPS",
        "ASPERGILLUS",
        "FAHFA",
        "KEGG",
        "INHOUSE",
        "CHEBI",
        "PUBCHEM",
        "NPATLAS",
      ],
      metaboliteType: "ALL",
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      mz: "",
      tolerance: "10",
      mzToleranceMode: "PPM",
      metaboliteType: "ALL",
      ionizationMode: "Neutral",
      adductsString: [],
      databases: [],
    });
  };

  const countDuplicates = (compounds) => {
    const compoundCount = {};
    let duplicates = 0;

    compounds.forEach((compound) => {
      const compoundId = compound.compoundId;
      compoundCount[compoundId] = (compoundCount[compoundId] || 0) + 1;
    });

    Object.values(compoundCount).forEach((count) => {
      if (count > 1) {
        duplicates += count - 1;
      }
    });

    return duplicates;
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
      setFormState((prev) => ({ ...prev, [name]: value || null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      mz: parseFloat(formState.mz),
      tolerance: parseFloat(formState.tolerance),
      mzToleranceMode: formState.mzToleranceMode,
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
      console.log("Response: " + response)
      console.log("Response data: " + response.data)
      console.log("Response data msFeatures: " + response.data.msFeatures)

      const rawResults = response.data;

      const groupedByAdduct = {};

      if (Array.isArray(rawResults.msfeatures)) {
        rawResults.msfeatures.forEach((feature) => {
          const annotationsByAdducts = feature.annotationsByAdducts;
      
          if (Array.isArray(annotationsByAdducts)) {
            annotationsByAdducts.forEach(({ adduct, annotations }) => {
              if (!groupedByAdduct[adduct]) {
                groupedByAdduct[adduct] = [];
              }
      
              if (Array.isArray(annotations)) {
                annotations.forEach((annotation) => {
                  const compound = annotation.compound;
                  if (compound) {
                    groupedByAdduct[adduct].push(compound);
                  }
                });
              }
            });
          }
        });
      } else {
        console.error("Expected response.data.msfeatures to be an array");
      }

      const adductsWithResults = Object.keys(groupedByAdduct).filter(
        (adduct) => groupedByAdduct[adduct].length > 0
      );
      const totalAdducts = formState.adductsString.length;
      const matchedAdducts = adductsWithResults.length;
      setMatchedAdductCount(matchedAdducts);
      setTotalAdductCount(totalAdducts);

      const allCompounds = Object.values(groupedByAdduct).flat();
      const duplicateCount = countDuplicates(allCompounds);
      console.log("Duplicate Count: ", duplicateCount);

      console.log("Raw results:", rawResults);
      
      toast.success("Form submitted successfully!", {
        autoClose: 2000,
        closeOnClick: true,
        draggable: true,
        position: "middle-left",
      });
      setResults(groupedByAdduct);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting search:", error.response || error);
      toast.error("Something went wrong.");
    }
  };

  const totalCompounds = Object.values(results).reduce(
    (sum, compounds) => sum + compounds.length,
    0
  );

  return (
    <div className="page">
      <header className="title-header">
        <img src={searchIcon} alt="Search Icon" className="icon" />
        <span className="title-text">Simple Search</span>
      </header>

      <div className="page outer-container row">
        <form onSubmit={handleSubmit}>
          <div className="grid-container">
            <TextInput
              label="Experimental Mass"
              name="mz"
              value={formState.mz}
              onChange={handleChange}
              placeholder="Enter mass value"
              className="experimental-mass-div"
            />

            <GroupRadio
              label="Metabolites"
              name="metaboliteType"
              value={formState.metaboliteType}
              options={["ALL", "ONLYLIPIDS"]}
              onChange={handleChange}
              className="metabolites-div"
            />

            <GroupRadio
              label="Ionization Mode"
              name="ionizationMode"
              value={formState.ionizationMode}
              options={["Neutral", "POSITIVE", "Negative Mode"]}
              onChange={handleChange}
              className="ionization-div"
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
              mzToleranceMode={formState.mzToleranceMode}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons-container center-button">
            <button type="submit">
              Submit
            </button>
          </div>
        </form>
        <ToastContainer />

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
            <div className="drop-down-results-summary">
              <div className="results-summary-col-1">
                <div className="results-count">{totalCompounds}</div>
                <div className="results-count-text">
                  Compound{totalCompounds !== 1 ? "s" : ""} found
                </div>
              </div>
              <div className="results-summary-col-2">
                <div className="progress-ring-container">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 36 36"
                    className="circular-chart"
                  >
                    <path
                      className="circle-bg"
                      d="M18 2.0845
         a 15.9155 15.9155 0 0 1 0 31.831
         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="2"
                    />
                    <path
                      className="circle"
                      strokeDasharray={`${percentage}, 100`}
                      d="M18 2.0845
         a 15.9155 15.9155 0 0 1 0 31.831
         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#00acc1"
                      strokeWidth="2"
                    />
                    <text
                      x="18"
                      y="20.35"
                      className="percentage-text"
                      textAnchor="middle"
                    >
                      {matchedAdductCount}/{totalAdductCount}
                    </text>
                  </svg>
                </div>
                <div className="results-count-text">Adduct matches</div>
              </div>
            </div>

            {Object.entries(results).map(([adduct, compounds]) => (
              <ResultsDropdownGroup
                key={adduct}
                adduct={adduct}
                compounds={compounds}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleSearch;
