import { useState, useEffect } from "react";
import axios from "axios";
import TextInput from "../components/search/TextInput.jsx";
import TextBoxInput from "../components/search/TextBoxInput.jsx";
import ToleranceRadio from "../components/search/ToleranceRadio.jsx";
import GroupRadio from "../components/search/GroupRadio.jsx";
import SpectrumGraph from "../components/search/SpectrumGraph.jsx";

const MsMsSearch = () => {
  const [formState, setFormState] = useState({
    precursorMz: "",
    peaks: "",
    precursorTolerance: "",
    precursorToleranceMode: "PPM",
    mzTolerance: "",
    mzToleranceMode: "PPM",
    adducts: ["M+H"],
    ionizationMode: "POSITIVE",
    CIDEnergy: "LOW",
    scoreType: "COSINE",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDemoData = () => {
    console.log("Loading demo data...");
    setFormState({
      CIDEnergy: "MED",
      precursorMz: "287.236",
      precursorTolerance: "10.0",
      precursorToleranceMode: "PPM",
      mzTolerance: "30.0",
      mzToleranceMode: "PPM",
      ionizationMode: "POSITIVE",
      adducts: ["M+H"],
      peaks: `55.301, 12.753, 67.237, 14.611, 69.204, 39.189, 79.134, 14.527, 81.102, 26.351, 83.17, 13.007, 91.118, 12.331, 93.14, 30.405, 95.091, 50, 96.871, 15.034, 105.084, 27.365, 107.052, 25, 109.035, 31.757, 111.057, 18.074, 119.012, 20.777, 121.035, 100, 121.722, 11.318, 122.549, 15.456, 124.954, 15.203, 130.958, 10.98, 132.972, 31.419, 134.987, 21.199, 137.048, 26.689, 143.036, 9.544, 145.113, 14.949, 146.854, 15.034, 148.939, 11.74, 150.992, 27.027, 157.2, 13.851, 159.066, 16.639, 161.08, 16.639, 163.149, 12.078, 165.094, 8.108, 171.028, 12.331, 173.152, 10.557, 174.916, 12.584, 185.099, 12.5, 199.295, 8.024, 216.966, 12.078, 244.947, 13.936`,
      scoreType: "COSINE",
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      precursorMz: "",
      peaks: "",
      precursorTolerance: "0.1",
      precursorToleranceMode: "PPM",
      mzTolerance: "0.5",
      mzToleranceMode: "PPM",
      adducts: ["M+H"],
      ionizationMode: "POSITIVE",
      CIDEnergy: "LOW",
    });
  };

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const peaksArray = Array.isArray(formState.peaks)
      ? formState.peaks
          .map(Number)
          .filter((v) => !isNaN(v))
          .reduce((acc, val, i, arr) => {
            if (i % 2 === 0 && arr[i + 1] != null) {
              acc.push({ mz: arr[i], intensity: arr[i + 1] });
            }
            return acc;
          }, [])
      : formState.peaks
          .split(/[\s,;]+/)
          .map((v) => parseFloat(v))
          .filter((v) => !isNaN(v))
          .reduce((acc, val, i, arr) => {
            if (i % 2 === 0 && arr[i + 1] != null) {
              acc.push({ mz: arr[i], intensity: arr[i + 1] });
            }
            return acc;
          }, []);

    const formattedData = {
      CIDEnergy: formState.CIDEnergy,
      precursorIonMZ: parseFloat(formState.precursorMz),
      tolerancePrecursorIon: parseFloat(formState.precursorTolerance),
      toleranceModePrecursorIon: formState.precursorToleranceMode.toUpperCase(),
      toleranceFragments: parseFloat(formState.mzTolerance),
      toleranceModeFragments: formState.mzToleranceMode.toUpperCase(),
      ionizationMode: formState.ionizationMode,
      adducts: ["M+H"], // ? Needs adducts???
      fragmentsMZsIntensities: {
        precursorMz: parseFloat(formState.precursorMz),
        peaks: peaksArray,
      },
      scoreType: "COSINE",
    };

    console.log("Sending to backend:", JSON.stringify(formattedData, null, 2));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}MSMSSearch`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;

      console.log("Raw results:", rawResults);

      const responseDataEXAMPLE = {
        msmsList: [
          {
            msmsId: 520,
            compound: {
              compoundId: 1095,
              casId: "68-26-8",
              compoundName: "Retinol",
              formula: "C20H30O",
              mass: 286.229665582,
              chargeType: 0,
              chargeNumber: 0,
              formulaType: "CHNOPS",
              compoundType: 1,
              compoundStatus: 2,
              formulaTypeInt: 0,
              logP: 0.0,
              rtPred: 0.1321357114325395,
              inchi:
                "InChI=1S/C20H30O/c1-16(8-6-9-17(2)13-15-21)11-12-19-18(3)10-7-14-20(19,4)5/h6,8-9,11-13,21H,7,10,14-15H2,1-5H3/b9-6+,12-11+,16-8+,17-13+",
              inchiKey: "FPIPGXGPPPQFEQ-OVSJKPMPSA-N",
              smiles: "C\\C(=C/CO)\\C=C\\C=C(/C)\\C=C\\C1=C(C)CCCC1(C)C",
              lipidType: null,
              numChains: 0,
              numCarbons: 0,
              doubleBonds: 0,
              biologicalActivity: null,
              meshNomenclature: null,
              iupacClassification: null,
              mol2: null,
              keggID: "C17276",
              lmID: "LMPR01090001",
              hmdbID: "HMDB0000305",
              agilentID: "215",
              pcID: 9904001,
              chebiID: 17336,
              inHouseID: null,
              aspergillusID: 0,
              knapsackID: null,
              npatlasID: 0,
              fahfaID: 0,
              ohPositionID: 0,
              aspergillusWebName: null,
              lipidMapsClassifications: [
                {
                  category: "PR",
                  mainClass: "PR01",
                  subClass: "PR0109",
                  classLevel4: "",
                },
              ],
              pathways: [],
            },
            adduct: "M+H",
            deltaPpmPrecursorIon: -3.279643144683768,
            msmsCosineScore: 0.9999999999999998,
            collisionEnergy: 25,
            spectrum: {
              precursorMz: 287.23694203466783,
              peaks: [
                {
                  mz: 55.301,
                  intensity: 0.12753,
                },
                {
                  mz: 67.237,
                  intensity: 0.14611000000000002,
                },
                {
                  mz: 69.204,
                  intensity: 0.39189,
                },
                {
                  mz: 79.134,
                  intensity: 0.14526999999999998,
                },
                {
                  mz: 81.102,
                  intensity: 0.26350999999999997,
                },
                {
                  mz: 83.17,
                  intensity: 0.13007,
                },
                {
                  mz: 91.118,
                  intensity: 0.12330999999999999,
                },
                {
                  mz: 93.14,
                  intensity: 0.30405,
                },
                {
                  mz: 95.091,
                  intensity: 0.5,
                },
                {
                  mz: 96.871,
                  intensity: 0.15034,
                },
                {
                  mz: 105.084,
                  intensity: 0.27365,
                },
                {
                  mz: 107.052,
                  intensity: 0.25,
                },
                {
                  mz: 109.035,
                  intensity: 0.31757,
                },
                {
                  mz: 111.057,
                  intensity: 0.18074,
                },
                {
                  mz: 119.012,
                  intensity: 0.20777,
                },
                {
                  mz: 121.035,
                  intensity: 1.0,
                },
                {
                  mz: 121.722,
                  intensity: 0.11318,
                },
                {
                  mz: 122.549,
                  intensity: 0.15456,
                },
                {
                  mz: 124.954,
                  intensity: 0.15203,
                },
                {
                  mz: 130.958,
                  intensity: 0.10980000000000001,
                },
                {
                  mz: 132.972,
                  intensity: 0.31419,
                },
                {
                  mz: 134.987,
                  intensity: 0.21199,
                },
                {
                  mz: 137.048,
                  intensity: 0.26689,
                },
                {
                  mz: 143.036,
                  intensity: 0.09544000000000001,
                },
                {
                  mz: 145.113,
                  intensity: 0.14949,
                },
                {
                  mz: 146.854,
                  intensity: 0.15034,
                },
                {
                  mz: 148.939,
                  intensity: 0.1174,
                },
                {
                  mz: 150.992,
                  intensity: 0.27027,
                },
                {
                  mz: 157.2,
                  intensity: 0.13851000000000002,
                },
                {
                  mz: 159.066,
                  intensity: 0.16638999999999998,
                },
                {
                  mz: 161.08,
                  intensity: 0.16638999999999998,
                },
                {
                  mz: 163.149,
                  intensity: 0.12078,
                },
                {
                  mz: 165.094,
                  intensity: 0.08108,
                },
                {
                  mz: 171.028,
                  intensity: 0.12330999999999999,
                },
                {
                  mz: 173.152,
                  intensity: 0.10557,
                },
                {
                  mz: 174.916,
                  intensity: 0.12584,
                },
                {
                  mz: 185.099,
                  intensity: 0.125,
                },
                {
                  mz: 199.295,
                  intensity: 0.08023999999999999,
                },
                {
                  mz: 216.966,
                  intensity: 0.12078,
                },
                {
                  mz: 244.947,
                  intensity: 0.13936,
                },
              ],
            },
          },
        ],
      };

      const resultsEXAMPLE = responseDataEXAMPLE.msmsList.map((entry) => ({
        compoundId: entry.compound.compoundId,
        compoundName: entry.compound.compoundName,
        formula: entry.compound.formula,
        mass: entry.compound.mass,
        adduct: entry.adduct,
        deltaPpmPrecursorIon: entry.deltaPpmPrecursorIon,
        msmsCosineScore: entry.msmsCosineScore,
        collisionEnergy: entry.collisionEnergy,
        spectrum: entry.spectrum.peaks,
      }));

      setResults(resultsEXAMPLE);
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
        <span className="title-text">MS/MS Search</span>
      </header>

      <div
        className="page outer-container row"
        style={{ cursor: loading ? "wait" : "default" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid-container-msms">
            <TextInput
              label="Precursor Ion Mass"
              name="precursorMz"
              value={formState.precursorMz}
              onChange={handleChange}
              placeholder="Enter m/z value"
              className="input-msms"
            />

            <TextBoxInput
              label="MS/MS Peak List"
              name="peaks"
              value={formState.peaks}
              onChange={handleChange}
              className="box-input-msms"
              placeholder="Enter MS/MS peaks (comma separated)"
            />

            <ToleranceRadio
              label="Precursor Ion Tolerance"
              inputName="precursorTolerance"
              modeName="precursorToleranceMode"
              toleranceValue={formState.precursorTolerance}
              toleranceMode={formState.precursorToleranceMode}
              unitOptions={["PPM", "Da"]}
              onChange={handleChange}
              className="ion-tolerance-msms"
            />

            <ToleranceRadio
              label="M/Z Tolerance"
              inputName="mzTolerance"
              modeName="mzToleranceMode"
              toleranceValue={formState.mzTolerance}
              toleranceMode={formState.mzToleranceMode}
              unitOptions={["PPM", "Da"]}
              onChange={handleChange}
              className="mz-tolerance-msms"
            />

            <GroupRadio
              label="Ionization Mode"
              name="ionizationMode"
              value={formState.ionizationMode}
              options={["POSITIVE", "NEGATIVE"]}
              onChange={handleChange}
              className="ionization-div-msms"
            />

            <GroupRadio
              label="Ionization Voltage"
              name="CIDEnergy"
              value={formState.CIDEnergy}
              options={["LOW", "MED", "HIGH", "ALL"]}
              onChange={handleChange}
              className="ionization-volt-div-msms"
            />

            {/*
            <GroupRadio
              label="Type of Spectra"
              name="spectraType"
              value={formState.spectraType}
              options={["Experimental", "Predicted"]}
              onChange={handleChange}
              className="spectra-div-msms"
            />
            */}
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

        {results.map((compound) => (
          <div key={compound.compoundId}>
            <h3>
              {compound.compoundName} ({compound.formula})
            </h3>
            <p>
              Adduct: {compound.adduct}, Score: {compound.msmsCosineScore}
            </p>
            <SpectrumGraph peaks={compound.spectrum} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MsMsSearch;
