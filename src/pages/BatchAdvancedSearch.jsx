import { useState, useEffect } from "react";
import axios from "axios";
import AdductsCheckboxes from "../components/search/AdductsCheckboxes";
import DatabasesCheckboxes from "../components/search/DatabasesCheckboxes";
import ResultsDropdownGroup from "../components/search/ResultsDropdownGroup";
import TextBoxInput from "../components/search/TextBoxInput.jsx";
import GroupRadio from "../components/search/GroupRadio.jsx";
import ToleranceRadio from "../components/search/ToleranceRadio.jsx";

const BatchAdvancedSearch = () => {
  const [formState, setFormState] = useState({
    mz: [],
    //allMz: [],
    retentionTimes: [],
    //allRt: [],
    compSpectra: [],
    //allCompSpectra: [],
    tolerance: "",
    toleranceMode: "ppm",
    chemAlphabet: "CHNOPS",
    deuteriumCheck: "",
    modifiers: "None",
    ionizationMode: "Positive Mode",
    metaboliteType: "All",
    adductsString: [],
    databases: [],
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const loadDemoData = () => {
    console.log("Loading demo data...");
    setFormState({
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
      //allMz: ["Working..."],
      retentionTimes: [
        "18.842525",
        "18.842525",
        "8.144917",
        "8.144917",
        "28.269503",
        "4.021555",
        "19.46886",
        "19.46886",
        "21.503885",
        "20.90083",
        "18.852442",
        "17.863642",
        "17.863642",
        "17.41639",
        "16.68847",
        "16.68847",
        "17.76522",
      ],
      //allRt: ["Working..."],
      compSpectra: [
        "(400.3432, 307034.88)(401.34576, 73205.016)(402.3504, 15871.166)(403.35446, 2379.5325)(404.3498, 525.92053)",
        "(422.32336, 1562.7301)(423.3237, 564.0795)(424.33255, 292.2923)",
        "(631.4875, 367.90726)(632.4899, 261.73)(316.24945, 569921.25)(317.2518, 100396.53)(318.25354, 13153.248)(319.2558, 1834.3552)(320.25305, 241.56665)",
        "(338.2299, 1832.6085)(339.2322, 468.8131)",
        "(561.4858, 236.35)(141.1306, 297.12)(281.24765, 8532.774)",
      ],
      //allCompSpectra: ["Working..."],
      tolerance: "10",
      toleranceMode: "ppm",
      chemAlphabet: "CHNOPS",
      deuteriumCheck: "",
      modifiers: "NH3",
      metaboliteType: "ONLYLIPIDS",
      ionizationMode: "POSITIVE",
      adductsString: ["M+H", "M+2H", "M+Na", "M+K", "M+NH4", "M+H-H2O"],
      databases: ["HMDB"],
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      mz: [],
      //allMz: [],
      retentionTimes: [],
      //allRt: [],
      compSpectra: [],
      //allCompSpectra: [],
      tolerance: "",
      toleranceMode: "ppm",
      chemAlphabet: "CHNOPS",
      deuteriumCheck: "",
      modifiers: "None",
      ionizationMode: "POSITIVE",
      metaboliteType: "All",
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
    setLoading(true);

    const formattedData = {
      mz: formState.mz.map((mass) => parseFloat(mass)),
      //allMz: formState.allMz.map((mass) => parseFloat(mass)),
      retentionTimes: formState.retentionTimes.map((time) => parseFloat(time)),
      //allRt: formState.allRt.map((time) => parseFloat(time)),
      compSpectra: formState.compSpectra.map((spectraString) => {
        // parse "(400.3432, 307034.88)" into { mz: 400.3432, intensity: 307034.88 }
        const regex = /\(([\d.]+),\s*([\d.]+)\)/g;
        const parsed = [];
        let match;
        while ((match = regex.exec(spectraString)) !== null) {
          parsed.push({
            mz: parseFloat(match[1]),
            intensity: parseFloat(match[2]),
          });
        }
        return parsed;
      }),
      //allCompSpectra: formState.allCompSpectra.map((spectra) =>
      //parseFloat(spectra)
      //),
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
        `${import.meta.env.VITE_API_URL}batch-advanced-search`,
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
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting search:", error.response || error);
      alert("There was an error submitting your search");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="title-header">
        <span className="title-text">Batch Advanced Search</span>
      </header>
      <div
        className="page outer-container row"
        style={{ cursor: loading ? "wait" : "default" }}
      >
        <label className="required-label">
          Required <span className="red-asterisk">*</span>
        </label>
        <form onSubmit={handleSubmit}>
          <div className="grid-container-batch-adv">
            <TextBoxInput
              label={
                <>
                  Experimental Masses <span style={{ color: "red" }}>*</span>
                </>
              }
              name="mz"
              value={formState.mz}
              onChange={handleChange}
              className="masses-text-adv"
            />

            {/*
            <TextBoxInput
              label="All Experimental Masses"
              name="allMz"
              value={formState.allMz}
              onChange={handleChange}
              className="all-masses-text-adv"
            />
            */}

            <TextBoxInput
              label="Retention Times"
              name="retentionTimes"
              value={formState.retentionTimes}
              onChange={handleChange}
              className="rt-text-adv"
              placeholder="Enter retention times (comma separated)"
            />

            {/*
            <TextBoxInput
              label="All Retention Times"
              name="allRt"
              value={formState.allRt}
              onChange={handleChange}
              className="all-rt-text-adv"
            />
            */}

            <TextBoxInput
              label="Composite Spectra"
              name="compSpectra"
              value={formState.compSpectra}
              onChange={handleChange}
              className="spec-text-adv"
              placeholder="Enter composite spectra (comma separated)"
            />

            {/*
            <TextBoxInput
              label="All Composite Spectra"
              name="allCompSpectra"
              value={formState.allCompSpectra}
              onChange={handleChange}
              className="all-spec-text-adv"
            />
            */}

            <ToleranceRadio
              label={
                <>
                  Tolerance <span style={{ color: "red" }}>*</span>
                </>
              }
              toleranceValue={formState.tolerance}
              toleranceMode={formState.toleranceMode}
              onChange={handleChange}
              className="tolerance-adv"
            />

            <GroupRadio
              label={
                <>
                  Chemical Alphabet <span style={{ color: "red" }}>*</span>
                </>
              }
              name="chemAlphabet"
              value={formState.chemAlphabet}
              options={["All", "CHNOPS", "CHNOPS + Cl"]}
              onChange={handleChange}
              className="chem-alph-adv"
            />

            <GroupRadio
              label={
                <>
                  Modifiers <span style={{ color: "red" }}>*</span>
                </>
              }
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
              className="modifiers-adv"
            />

            <DatabasesCheckboxes
              label={
                <>
                  Databases <span style={{ color: "red" }}>*</span>
                </>
              }
              selectedDatabases={formState.databases}
              onChange={handleChange}
              className="databases-adv"
            />

            <GroupRadio
              label={
                <>
                  Metabolites <span style={{ color: "red" }}>*</span>
                </>
              }
              name="metaboliteType"
              value={formState.metaboliteType}
              options={["All", "ONLYLIPIDS"]}
              onChange={handleChange}
              className="metabolites-adv"
            />

            <AdductsCheckboxes
              label={
                <>
                  Adducts <span style={{ color: "red" }}>*</span>
                </>
              }
              selectedAdducts={formState.adductsString}
              onChange={handleChange}
              className="adducts-adv"
            />

            <GroupRadio
              label={
                <>
                  Ionization Mode <span style={{ color: "red" }}>*</span>
                </>
              }
              name="ionizationMode"
              value={formState.ionizationMode}
              options={["NEUTRAL", "POSITIVE", "NEGATIVE"]}
              onChange={handleChange}
              className="ionization-adv"
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

export default BatchAdvancedSearch;
