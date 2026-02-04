import { useState, useEffect } from "react";
import axios from "axios";
import TextInput from "../../components/search/TextInput.jsx";
import TextBoxInput from "../../components/search/TextBoxInput.jsx";
import ToleranceRadio from "../../components/search/ToleranceRadio.jsx";
import GroupRadio from "../../components/search/GroupRadio.jsx";
import SpectrumGraph from "../../components/search/SpectrumGraph.jsx";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes.jsx";

const MsMsSearch = () => {
  const [formState, setFormState] = useState({
    CIDEnergy: "LOW",
    precursorIonMz: "",
    tolerancePrecursorIon: "",
    toleranceModePrecursorIon: "PPM",
    toleranceFragments: "",
    toleranceModeFragments: "PPM",
    ionizationMode: "POSITIVE",
    adducts: ["[M+H]+"],
    fragmentsMZsIntensities: {
      precursorMz: "",
      peaks: "",
    },
    scoreType: "COSINE",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDemoData = () => {
    const demo = {
      CIDEnergy: "MED",
      precursorIonMZ: 287.236,
      tolerancePrecursorIon: 10.0,
      toleranceModePrecursorIon: "PPM",
      toleranceFragments: 30.0,
      toleranceModeFragments: "PPM",
      ionizationMode: "POSITIVE",
      adducts: ["[M+H]+"],
      fragmentsMZsIntensities: {
        precursorMz: 287.23,
        peaks: [
          { mz: 55.301, intensity: 12.753 },
          { mz: 67.237, intensity: 14.611 },
          { mz: 69.204, intensity: 39.189 },
          { mz: 79.134, intensity: 14.527 },
          { mz: 81.102, intensity: 26.351 },
          { mz: 83.17, intensity: 13.007 },
          { mz: 91.118, intensity: 12.331 },
          { mz: 93.14, intensity: 30.405 },
          { mz: 95.091, intensity: 50 },
          { mz: 96.871, intensity: 15.034 },
          { mz: 105.084, intensity: 27.365 },
          { mz: 107.052, intensity: 25 },
          { mz: 109.035, intensity: 31.757 },
          { mz: 111.057, intensity: 18.074 },
          { mz: 119.012, intensity: 20.777 },
          { mz: 121.035, intensity: 100 },
          { mz: 121.722, intensity: 11.318 },
          { mz: 122.549, intensity: 15.456 },
          { mz: 124.954, intensity: 15.203 },
          { mz: 130.958, intensity: 10.98 },
          { mz: 132.972, intensity: 31.419 },
          { mz: 134.987, intensity: 21.199 },
          { mz: 137.048, intensity: 26.689 },
          { mz: 143.036, intensity: 9.544 },
          { mz: 145.113, intensity: 14.949 },
          { mz: 146.854, intensity: 15.034 },
          { mz: 148.939, intensity: 11.74 },
          { mz: 150.992, intensity: 27.027 },
          { mz: 157.2, intensity: 13.851 },
          { mz: 159.066, intensity: 16.639 },
          { mz: 161.08, intensity: 16.639 },
          { mz: 163.149, intensity: 12.078 },
          { mz: 165.094, intensity: 8.108 },
          { mz: 171.028, intensity: 12.331 },
          { mz: 173.152, intensity: 10.557 },
          { mz: 174.916, intensity: 12.584 },
          { mz: 185.099, intensity: 12.5 },
          { mz: 199.295, intensity: 8.024 },
          { mz: 216.966, intensity: 12.078 },
          { mz: 244.947, intensity: 13.936 },
        ],
      },
      scoreType: "COSINE",
    };

    const peaksString = demo.fragmentsMZsIntensities.peaks
      .map((p) => `${p.mz}:${p.intensity}`)
      .join(", ");

    setFormState({
      CIDEnergy: demo.CIDEnergy,
      precursorIonMz: demo.precursorIonMZ,
      tolerancePrecursorIon: demo.tolerancePrecursorIon,
      toleranceModePrecursorIon: demo.toleranceModePrecursorIon,
      toleranceFragments: demo.toleranceFragments,
      toleranceModeFragments: demo.toleranceModeFragments,
      ionizationMode: demo.ionizationMode,
      adducts: demo.adducts,
      fragmentsMZsIntensities: {
        precursorMz: demo.fragmentsMZsIntensities.precursorMz,
        peaks: peaksString,
      },
      scoreType: demo.scoreType,
    });
  };

  const clearInput = () => {
    setFormState({
      CIDEnergy: "LOW",
      precursorIonMz: "",
      tolerancePrecursorIon: "",
      toleranceModePrecursorIon: "PPM",
      toleranceFragments: "",
      toleranceModeFragments: "PPM",
      ionizationMode: "POSITIVE",
      adducts: ["[M+H]+"],
      fragmentsMZsIntensities: {
        precursorMz: "",
        peaks: "",
      },
      scoreType: "COSINE",
    });
  };

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "precursorIonMz") {
      setFormState((prev) => ({
        ...prev,
        precursorIonMz: value,
        fragmentsMZsIntensities: {
          ...prev.fragmentsMZsIntensities,
          precursorMz: value,
        },
      }));
      return;
    }

    if (type === "checkbox") {
      return;
    }

    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdductsChange = (adducts) => {
    setFormState((prev) => ({ ...prev, adducts }));
  };

  const parseMsmsPeaks = (input) => {
    const trimmed = input?.trim();
    if (!trimmed) return [];

    const tokens = trimmed.split(/[\s,;]+/).filter(Boolean);
    const pairs = [];
    const numericBuffer = [];

    for (const token of tokens) {
      if (token.includes(":")) {
        const [mzStr, intensityStr] = token.split(":");
        const mz = parseFloat(mzStr);
        const intensity = parseFloat(intensityStr);
        if (!Number.isNaN(mz) && !Number.isNaN(intensity)) {
          pairs.push({ mz, intensity });
        }
      } else {
        const value = parseFloat(token);
        if (!Number.isNaN(value)) {
          numericBuffer.push(value);
        }
      }
    }

    for (let i = 0; i + 1 < numericBuffer.length; i += 2) {
      pairs.push({ mz: numericBuffer[i], intensity: numericBuffer[i + 1] });
    }

    return pairs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const peaksArray = parseMsmsPeaks(formState.fragmentsMZsIntensities.peaks);

    const formattedData = {
      CIDEnergy: formState.CIDEnergy,
      precursorIonMZ: parseFloat(formState.precursorIonMz),
      tolerancePrecursorIon: parseFloat(formState.tolerancePrecursorIon),
      toleranceModePrecursorIon: formState.toleranceModePrecursorIon,
      toleranceFragments: parseFloat(formState.toleranceFragments),
      toleranceModeFragments: formState.toleranceModeFragments,
      ionizationMode: formState.ionizationMode,
      adducts: formState.adducts,
      fragmentsMZsIntensities: {
        precursorMz: parseFloat(formState.precursorIonMz),
        peaks: peaksArray,
      },
      scoreType: formState.scoreType,
    };

    console.log("Sending to backend:", formattedData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}MSMSSearch`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;
      console.log(rawResults);

      const groupedByAdduct = Object.values(
        rawResults.msmsList.reduce((acc, hit) => {
          const adduct = hit.adduct || "Unknown";

          if (!acc[adduct]) {
            acc[adduct] = {
              adduct,
              compounds: [],
            };
          }

          acc[adduct].compounds.push({
            ...hit.compound,
            score: hit.msmsCosineScore,
            spectrum: hit.spectrum,
            msmsId: hit.msmsId,
          });

          return acc;
        }, {})
      );

      setResults({
        experimentalSpectrum: rawResults.experimentalSpectrum,
        precursorMz: rawResults.precursorMz,
        adductGroups: groupedByAdduct,
      });
    } catch (error) {
      console.error("Error submitting search:", error.response || error);
      alert("There was an error submitting your search");
    } finally {
      setLoading(false);
    }
  };

  const handleNestedChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split(".");

    setFormState((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value,
      },
    }));
  };

  return (
    <div className="page">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}

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
              name="precursorIonMz"
              value={formState.precursorIonMz}
              onChange={handleChange}
              placeholder="Enter m/z value"
              className="input-msms"
            />

            <TextBoxInput
              label="MS/MS Peak List"
              name="fragmentsMZsIntensities.peaks"
              value={formState.fragmentsMZsIntensities.peaks}
              onChange={handleNestedChange}
              className="box-input-msms"
              placeholder="Enter MS/MS peaks (comma separated)"
              validationMode="mzIntensityPairs"
            />

            <ToleranceRadio
              label="Precursor Ion Tolerance"
              toleranceValue={formState.tolerancePrecursorIon}
              mzToleranceMode={formState.toleranceModePrecursorIon}
              onChange={handleChange}
              unitOptions={["PPM", "Da"]}
              inputName="tolerancePrecursorIon"
              modeName="toleranceModePrecursorIon"
              className="ion-tolerance-msms"
            />

            <ToleranceRadio
              label="M/Z Tolerance"
              inputName="toleranceFragments"
              modeName="toleranceModeFragments"
              toleranceValue={formState.toleranceFragments}
              mzToleranceMode={formState.toleranceModeFragments}
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

            <AdductsCheckboxes
              selectedAdducts={formState.adducts}
              onSelectionChange={handleAdductsChange}
              ionizationMode={formState.ionizationMode}
              name="adducts"
              className="adducts-container-msms"
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

        {results?.experimentalSpectrum && (
          <div className="spectrum-graph-wrapper">
            <SpectrumGraph
              peaks={results.experimentalSpectrum.peaks}
              precursorMz={results.precursorMz}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MsMsSearch;
