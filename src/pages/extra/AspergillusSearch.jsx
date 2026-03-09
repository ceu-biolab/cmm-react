import { useState, useEffect } from "react";
import axios from "axios";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes.jsx";
import DatabasesCheckboxes from "../../components/search/DatabasesCheckboxes.jsx";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup.jsx";
import TextBoxInput from "../../components/search/TextBoxInput.jsx";
import GroupRadio from "../../components/search/GroupRadio.jsx";
import ToleranceRadio from "../../components/search/ToleranceRadio.jsx";
import { formatApiError } from "../../utils/apiError";
import {
  DEFAULT_DATABASES,
  toggleDatabaseSelection,
} from "../../utils/databaseSelection";

const AspergillusSearch = () => {
  const [formState, setFormState] = useState({
    mz: "",
    allMz: "",
    rt: "",
    allRt: "",
    compSpectra: "",
    allCompSpectra: "",
    tolerance: "",
    toleranceMode: "",
    chemAlphabet: "",
    deuteriumCheck: "",
    modifiers: "",
    ionizationMode: "",
    metaboliteType: "",
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
      ].join("\n"),
      allMz: "Working...",
      rt: "Working...",
      allRt: "Working...",
      compSpectra: "Working...",
      allCompSpectra: "Working...",
      tolerance: "10",
      toleranceMode: "ppm",
      chemAlphabet: "CHNOPS",
      deuteriumCheck: "",
      modifiers: "NH3",
      metaboliteType: "ONLYLIPIDS",
      ionizationMode: "Positive Mode",
      adductsString: [
        "[M+H]+",
        "[M+2H]2+",
        "[M+Na]+",
        "[M+K]+",
        "[M+NH4]+",
        "[M+H-H2O]+",
      ],
      databases: DEFAULT_DATABASES,
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      mz: "",
      allMz: "",
      rt: "",
      allRt: "",
      compSpectra: "",
      allCompSpectra: "",
      tolerance: "",
      toleranceMode: "",
      chemAlphabet: "",
      deuteriumCheck: "",
      modifiers: "",
      ionizationMode: "",
      metaboliteType: "",
      adductsString: [],
      databases: [],
    });
  };

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "databases") {
        setFormState((prev) => ({
          ...prev,
          databases: toggleDatabaseSelection(prev.databases, value, checked),
        }));
      }
    } else {
      setFormState((prev) => ({ ...prev, [name]: value || null }));
    }
  };

  const handleAdductsChange = (adducts) => {
    setFormState((prev) => ({ ...prev, adductsString: adducts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const parseNumericList = (rawValue) =>
      String(rawValue || "")
        .split(/[\s,;]+/)
        .filter(Boolean)
        .map((entry) => Number(entry))
        .filter((entry) => Number.isFinite(entry));

    const formattedData = {
      mz: parseNumericList(formState.mz),
      allMz: parseNumericList(formState.allMz),
      rt: parseNumericList(formState.rt),
      allRt: parseNumericList(formState.allRt),
      compSpectra: parseNumericList(formState.compSpectra),
      allCompSpectra: parseNumericList(formState.allCompSpectra),
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
        `${import.meta.env.VITE_API_URL}compounds/aspergillus-search`,
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
      alert(formatApiError(error, { action: "submit your search" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="title-header">
        <span className="title-text">Aspergillus Search</span>
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
              name="rt"
              value={formState.rt}
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
              mzToleranceMode={formState.toleranceMode}
              onChange={handleChange}
              unitOptions={["ppm", "da"]}
              inputName="tolerance"
              modeName="toleranceMode"
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
              onSelectionChange={handleAdductsChange}
              ionizationMode={formState.ionizationMode}
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
              options={["Positive Mode", "Negative Mode"]}
              onChange={handleChange}
              className="ionization-adv"
            />
          </div>

          <div className="form-buttons-container center-button">
            <button type="submit">
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

export default AspergillusSearch;
