import { useState, useEffect } from "react";
import axios from "axios";
import AdductsCheckboxes from "../components/search/AdductsCheckboxes";
import DatabasesCheckboxes from "../components/search/DatabasesCheckboxes";
import ResultsDropdownGroup from "../components/search/ResultsDropdownGroup";
import searchIcon from "../assets/svgs/search-svg.svg";
import TextBoxInput from "../components/search/TextBoxInput.jsx";
import GroupRadio from "../components/search/GroupRadio.jsx";
import ToleranceRadio from "../components/search/ToleranceRadio.jsx";

const RtPredSearch = () => {
  const [formState, setFormState] = useState({
    cmmIDs: [],
    rtKnown: [],
    mz: [],
    rt: [],
    compSpectra: [],
    tolerance: "",
    toleranceMode: "ppm",
    chemAlphabet: "CHNOPS",
    deuteriumCheck: "",
    modifiers: "None",
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
      cmmIDs: ["Working..."],
      rtKnown: ["Working..."],
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
      rt: ["Working..."],
      compSpectra: ["Working..."],
      tolerance: "10",
      toleranceMode: "ppm",
      chemAlphabet: "CHNOPS",
      deuteriumCheck: "",
      modifiers: "NH3",
      metaboliteType: "ONLYLIPIDS",
      ionizationMode: "Positive Mode",
      adductsString: ["M+H", "M+2H", "M+Na", "M+K", "M+NH4", "M+H-H2O"],
      databases: ["HMDB"],
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      cmmIDs: [],
      rtKnown: [],
      mz: [],
      rt: [],
      compSpectra: [],
      tolerance: "",
      toleranceMode: "ppm",
      chemAlphabet: "CHNOPS",
      deuteriumCheck: "",
      modifiers: "None",
      ionizationMode: "Positive Mode",
      metaboliteType: "All except peptides",
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
      setFormState((prev) => ({ ...prev, [name]: value || null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      cmmIDs: formState.mz.map((mass) => parseFloat(mass)),
      rtKnown: formState.mz.map((mass) => parseFloat(mass)),
      mz: formState.mz.map((mass) => parseFloat(mass)),
      rt: formState.rt.map((time) => parseFloat(time)),
      compSpectra: formState.compSpectra.map((spectra) => parseFloat(spectra)),
      tolerance: parseFloat(formState.tolerance),
      toleranceMode: formState.toleranceMode,
      chemAlphabet: formState.chemAlphabet,
      deuteriumCheck: formState.deuteriumCheck,
      modifiers: formState.modifiers,
      ionizationMode: formState.ionizationMode,
      metaboliteType: formState.metaboliteType,
      adductsString: formState.adductsString,
      databases: formState.databases,
    };

    console.log("Sending to backend:", JSON.stringify(formattedData, null, 2));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}compounds/rt-pred-search`,
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
        <span className="title-text">RT Pred Search</span>
      </header>
      <div className="page outer-container row">
        <form onSubmit={handleSubmit}>
          <div className="grid-container-rt-pred">
            <TextBoxInput
              label="CMM IDs of Reference Standards (*)"
              name="cmmIDs"
              value={formState.cmmIDs}
              onChange={handleChange}
              className="cmmIDs-text-rt-pred"
            />

            <TextBoxInput
              label="Retention Times of Known Compounds in Analysis"
              name="rtKnown"
              value={formState.rtKnown}
              onChange={handleChange}
              className="rts-known-text-rt-pred"
            />

            <TextBoxInput
              label="Experimental Masses (*)"
              name="mz"
              value={formState.mz}
              onChange={handleChange}
              className="masses-text-rt-pred"
            />

            <TextBoxInput
              label="Retention Times"
              name="rt"
              value={formState.rt}
              onChange={handleChange}
              className="rt-text-rt-pred"
            />

            <TextBoxInput
              label="Composite Spectra"
              name="compSpectra"
              value={formState.compSpectra}
              onChange={handleChange}
              className="spec-text-rt-pred"
            />

            <ToleranceRadio
              label="Tolerance (*)"
              toleranceValue={formState.tolerance}
              toleranceMode={formState.toleranceMode}
              onChange={handleChange}
              className="tolerance-rt-pred"
            />

            <GroupRadio
              label="Confidence Interval (*)"
              name="confidenceInterval"
              value={formState.confidenceInterval}
              options={["68", "95", "99"]}
              onChange={handleChange}
              className="conf-int-rt-pred"
            />

            <GroupRadio
              label="Chemical Alphabet (*)"
              name="chemAlphabet"
              value={formState.chemAlphabet}
              options={["All", "CHNOPS", "CHNOPS + Cl"]}
              onChange={handleChange}
              className="chem-alph-rt-pred"
            />

            <GroupRadio
              label="Modifiers (*)"
              name="modifiers"
              value={formState.modifiers}
              options={[
                "None",
                "NH3",
                "HCOO",
                "CH3COO",
                "HCOONH3",
                "CH3COONH3",
              ]}
              onChange={handleChange}
              className="modifiers-rt-pred"
            />

            <DatabasesCheckboxes
              label="Databases (*)"
              selectedDatabases={formState.databases}
              onChange={handleChange}
              className="databases-rt-pred"
            />

            <GroupRadio
              label="Metabolites (*)"
              name="metaboliteType"
              value={formState.metaboliteType}
              options={[
                "All except peptides",
                "ONLYLIPIDS",
                "All including peptides",
              ]}
              onChange={handleChange}
              className="metabolites-rt-pred"
            />

            <AdductsCheckboxes
              label="Adducts (*)"
              selectedAdducts={formState.adductsString}
              onChange={handleChange}
              className="adducts-rt-pred"
            />

            <GroupRadio
              label="Ionization Mode (*)"
              name="ionizationMode"
              value={formState.ionizationMode}
              options={["Neutral", "Positive Mode", "Negative Mode"]}
              onChange={handleChange}
              className="ionization-rt-pred"
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

export default RtPredSearch;
