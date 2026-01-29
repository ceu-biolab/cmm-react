import { useState, useEffect } from "react";
import axios from "axios";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes.jsx";
import DatabasesCheckboxes from "../../components/search/DatabasesCheckboxes.jsx";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup.jsx";
import TextBoxInput from "../../components/search/TextBoxInput.jsx";
import GroupRadio from "../../components/search/GroupRadio.jsx";
import ToleranceRadio from "../../components/search/ToleranceRadio.jsx";

const LcMsSearch = () => {
  const [formState, setFormState] = useState({
    mz: "",
    retentionTimes: "",
    compositeSpectrum: "",
    tolerance: "",
    mzToleranceMode: "PPM",
    chemicalAlphabet: "CHNOPS",
    deuterium: false,
    modifiersType: "None",
    ionizationMode: "POSITIVE",
    metaboliteType: "All",
    adductsString: [],
    databases: [],
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const loadDemoData = () => {
    setFormState({
      mz: [
        400.3432, 422.32336, 316.24945, 338.2299, 281.24765, 288.2174, 496.3427,
        518.3226, 548.37054, 572.3718, 570.3551, 568.3401, 590.321, 482.324,
        478.29312, 500.27457, 502.29303, 526.2927, 548.27484, 512.33417,
        534.31616,
      ].join(", "),

      mzToleranceMode: "PPM",
      tolerance: 50,
      ionizationMode: "POSITIVE",

      adductsString: ["[M+H]+", "[M+2H]2+", "[M+Na]+", "[M+K]+", "[M+H-H2O]+"],

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

      metaboliteType: "ONLYLIPIDS",

      retentionTimes: [
        18.842525, 18.842525, 8.144917, 8.144917, 28.269503, 4.021555, 19.46886,
        19.46886, 21.503885, 20.90083, 18.852442, 17.863642, 17.863642,
        17.41639, 16.68847, 16.68847, 17.76522, 17.698446, 17.698446, 16.254662,
        16.254662,
      ].join(", "),

      compositeSpectrum: JSON.stringify(
        [
          {
            400.3432: 307034.88,
            401.34576: 73205.016,
            402.3504: 15871.166,
            403.35446: 2379.5325,
            404.3498: 525.92053,
          },
          {
            422.32336: 1562.7301,
            423.3237: 564.0795,
            424.33255: 292.2923,
          },
          {
            631.4875: 367.90726,
            632.4899: 261.73,
            316.24945: 569921.25,
            317.2518: 100396.53,
            318.25354: 13153.248,
            319.2558: 1834.3552,
            320.25305: 241.56665,
          },
          {
            338.2299: 1832.6085,
            339.2322: 468.8131,
          },
          {
            561.4858: 236.35,
            141.1306: 297.12,
            281.24765: 8532.774,
            263.23685: 2734.8223,
            264.24228: 616.6557,
            265.2474: 97.63,
            303.2296: 3154.6785,
            304.2393: 718.22534,
            305.23438: 272.0783,
          },
          {
            575.422: 339.64,
            288.2174: 204084.69,
            289.22003: 32914.242,
            290.22226: 5089.2285,
            291.2198: 723.9824,
            292.2142: 86.07,
            310.19937: 1059.77,
            311.20145: 400.03336,
          },
          {
            991.674: 336133.72,
            992.67676: 173852.98,
            993.6781: 51292.195,
            994.6797: 11841.43,
            995.6813: 2720.4565,
            996.6789: 674.16394,
            496.3427: 2282350.8,
            497.34558: 627602.9,
            498.3469: 105371.484,
            499.34842: 15081.279,
            500.35052: 2490.545,
            501.3458: 489.87,
          },
          {
            518.32263: 116812.14,
            519.3252: 30485.719,
            520.3284: 5558.731,
            521.32385: 1256.6665,
          },
          {
            548.37054: 8616.517,
            549.3739: 2817.4402,
            550.3746: 667.2553,
          },
          {
            570.35345: 917.5628,
            571.35535: 354.61224,
          },
          {
            572.3718: 3261.4624,
            573.3752: 1148.7113,
            574.3768: 314.52,
            594.35284: 400.20178,
            595.3476: 362.69,
          },
          {
            570.3551: 15104.281,
            571.3582: 5156.9814,
            572.36224: 1203.8275,
            573.3646: 101.370476,
            592.33673: 1409.5024,
            593.3393: 543.91895,
            594.3383: 262.465,
          },
          {
            568.3401: 69828.43,
            569.34283: 22957.86,
            570.3444: 4912.129,
          },
          {
            590.32104: 5850.7417,
            591.3069: 2871.11,
          },
          {
            482.324: 20545.27,
            483.3272: 5389.9365,
            484.33014: 1090.0233,
            485.33273: 79.926674,
            504.30594: 2025.5525,
            505.30887: 635.57446,
            506.3216: 258.78,
          },
          {
            955.57416: 613.7586,
            956.57416: 387.9443,
            478.29312: 53651.203,
            479.29605: 13785.803,
            480.29916: 2631.2334,
            481.30112: 399.37863,
          },
          {
            500.27457: 3699.7795,
            501.2779: 1045.2344,
          },
          {
            502.29303: 39800.742,
            503.29602: 10899.144,
            504.29947: 2186.163,
            505.3003: 353.84317,
            524.27563: 2873.6033,
            525.2791: 906.12933,
          },
          {
            526.2927: 24282.523,
            527.2958: 7487.513,
            528.2991: 1569.15,
            529.2973: 196.42332,
          },
          {
            548.27484: 1864.1719,
            549.27313: 673.96075,
            550.2758: 280.30704,
          },
          {
            512.33417: 5651.2104,
            513.3372: 1544.2075,
            514.3397: 386.18942,
          },
        ],
        null,
        2
      ),

      chemicalAlphabet: "CHNOPS",
      deuterium: false,
      modifiersType: "none",
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      mz: "",
      retentionTimes: "",
      compositeSpectrum: "",
      tolerance: "",
      mzToleranceMode: "PPM",
      chemicalAlphabet: "CHNOPS",
      deuterium: false,
      modifiersType: "none",
      ionizationMode: "POSITIVE",
      metaboliteType: "All",
      adductsString: [],
      databases: [],
    });
  };

  useEffect(() => {
    if (loading) {
      document.body.style.cursor = "wait";
    } else {
      document.body.style.cursor = "default";
    }

    return () => {
      document.body.style.cursor = "default";
    };
  }, [loading]);

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
            : prev.adductsString.filter((a) => a !== value),
        }));
      } else if (name === "databases") {
        setFormState((prev) => ({
          ...prev,
          databases: checked
            ? [...prev.databases, value]
            : prev.databases.filter((db) => db !== value),
        }));
      } else if (name === "deuterium") {
        setFormState((prev) => ({
          ...prev,
          deuterium: checked,
        }));
      }
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: value ?? "",
      }));
    }
  };

  const parseCompositeSpectrum = (value) => {
    const trimmed = value?.trim();
    if (!trimmed) return [];

    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) {
      throw new Error("Composite spectra must be a JSON array.");
    }
    return parsed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let compositeSpectrum = [];
    try {
      compositeSpectrum = parseCompositeSpectrum(formState.compositeSpectrum);
    } catch (error) {
      console.error("Invalid composite spectra JSON:", error);
      alert("Composite spectra must be valid JSON.");
      return;
    }

    setLoading(true);

    const formattedData = {
      mz: formState.mz
        .split(/[\s,;]+/)
        .filter(Boolean)
        .map(Number),

      retentionTimes: formState.retentionTimes
        .split(/[\s,;]+/)
        .filter(Boolean)
        .map(Number),
      compositeSpectrum,
      tolerance: parseFloat(formState.tolerance),
      mzToleranceMode: formState.mzToleranceMode,
      chemicalAlphabet: formState.chemicalAlphabet,
      deuterium: formState.deuterium,
      modifiersType: formState.modifiersType,
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
      console.log("Raw results:", rawResults);

      const features = rawResults.map((item) => {
        const annotationsByAdducts =
          item.annotationsByAdducts?.map((adductGroup) => ({
            adduct: adductGroup.adduct,
            annotations: adductGroup.annotations || [],
          })) || [];

        const hasResults = annotationsByAdducts.some(
          (group) => group.annotations.length > 0
        );

        return {
          mzValue: item.feature?.mzValue,
          retentionTime: item.feature?.retentionTime,
          annotationsByAdducts,
          hasResults,
        };
      });

      setResults(features);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting search:", error.response || error);
      alert("There was an error submitting your search");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page cemspage">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}

      <header className="title-header">
        <span className="title-text">LC-MS Search</span>
      </header>

      <div className="page outer-container row">
        <div className="form-container" style={{ position: "relative" }}>
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
                name="compositeSpectrum"
                value={formState.compositeSpectrum}
                onChange={handleChange}
                className="spec-text-adv"
                placeholder="Enter composite spectra (JSON array)"
                validationMode="json"
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
                mzToleranceMode={formState.mzToleranceMode}
                onChange={handleChange}
                unitOptions={["PPM", "DA"]}
                inputName="tolerance"
                modeName="mzToleranceMode"
                className="tolerance-adv"
              />

              <GroupRadio
                label={
                  <>
                    Chemical Alphabet <span style={{ color: "red" }}>*</span>
                  </>
                }
                name="chemicalAlphabet"
                value={formState.chemicalAlphabet}
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
                name="modifiersType"
                value={formState.modifiersType}
                options={[
                  "none",
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

              <div className="deuterium-container">
                <label>
                  <input
                    type="checkbox"
                    name="deuterium"
                    checked={formState.deuterium}
                    onChange={handleChange}
                  />
                  Deuterium
                </label>
              </div>

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
              <button type="submit">Submit</button>
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
              results.map((featureObj, featureIndex) => (
                <div key={featureIndex} className="feature-group">
                  <h3>
                    Feature {featureIndex + 1}: m/z{" "}
                    {featureObj.mzValue?.toFixed(4) ?? "N/A"} | RT:{" "}
                    {featureObj.retentionTime?.toFixed(2) ?? "N/A"}
                  </h3>

                  {featureObj.hasResults &&
                  featureObj.annotationsByAdducts.length > 0 ? (
                    featureObj.annotationsByAdducts.map(
                      (adductGroup, adductIndex) => {
                        const normalizedCompounds = adductGroup.annotations.map(
                          (annotation, i) => ({
                            compoundId: annotation.compound?.compoundId ?? i,
                            compoundName:
                              annotation.compound?.compoundName ??
                              annotation.compound?.formula ??
                              "Unknown",
                            mass: annotation.compound?.mass ?? null,
                            massErrorPpm: annotation.massErrorPpm ?? null,
                            formula: annotation.compound?.formula,
                            chargeType: annotation.compound?.chargeType,
                            chargeNumber: annotation.compound?.chargeNumber,
                            numCarbons: annotation.compound?.numCarbons,
                            doubleBonds: annotation.compound?.doubleBonds,
                            numChains: annotation.compound?.numChains,
                            inchi: annotation.compound?.inchi,
                            inchiKey: annotation.compound?.inchiKey,
                            smiles: annotation.compound?.smiles,
                            casID: annotation.compound?.casID,
                            keggID: annotation.compound?.keggID,
                            chebiID: annotation.compound?.chebiID,
                            hmdbID: annotation.compound?.hmdbID,
                            lmID: annotation.compound?.lmID,
                            pcID: annotation.compound?.pcID,
                            knapsackID: annotation.compound?.knapsackID,
                            mol2: annotation.compound?.mol2,
                            sdf: annotation.compound?.sdf,
                          })
                        );

                        return (
                          <ResultsDropdownGroup
                            key={`${featureIndex}-${adductIndex}`}
                            adduct={adductGroup.adduct}
                            compounds={normalizedCompounds}
                          />
                        );
                      }
                    )
                  ) : (
                    <p className="no-results">
                      No results found for this feature.
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LcMsSearch;
