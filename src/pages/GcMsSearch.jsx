import { useState, useEffect } from "react";
import axios from "axios";
import TextInput from "../components/search/TextInput";
import TextBoxInput from "../components/search/TextBoxInput";
import GroupRadio from "../components/search/GroupRadio";
import { ToastContainer, toast } from "react-toastify";
import MirroredSpectrum from "../components/search/MirroredSpectrum";

const GcMsSearch = () => {
  const [formState, setFormState] = useState({
    spectrum: "",
    retentionIndex: "10",
    retentionIndexTolerance: "10",
    derivatizationMethod: "METHYL_CHLOROFORMATE",
    columnType: "STANDARD_NON_POLAR",
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const loadDemoData = () => {
    console.log("Loading demo data...");
    setFormState({
      spectrum: `115.0376,100.0,55.0177,40.31255,59.0128,18.10327,87.0427,15.90476,71.0855,6.21324,57.0698,5.426879,116.0395,5.407668,43.0292,5.190647,85.1014,3.522497,43.0541,3.221486,143.0325,2.812858,113.1323,2.04844,56.0257,2.012552,84.0934,1.697714,121.9918,1.101694,326.9567,1.095998,127.1478,1.063178,151.9783,1.049012,107.5385,1.047718`,
      retentionIndex: "1500",
      retentionIndexTolerance: "10",
      derivatizationMethod: "METHYL_CHLOROFORMATE",
      columnType: "STANDARD_NON_POLAR",
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      spectrum: "", //* TEXTBOX INPUT
      retentionIndex: "1500", //* INPUT
      retentionIndexTolerance: "10", //* INPUT
      derivatizationMethod: "METHYL_CHLOROFORMATE", //* GROUP RADIO
      columnType: "STANDARD_NON_POLAR", //* GROUP RADIO
    });
  };

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState((prev) => ({ ...prev, [name]: value || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const spectrumPairs = formState.spectrum
      .split(",")
      .map((val) => parseFloat(val.trim()))
      .reduce((acc, curr, idx, arr) => {
        if (idx % 2 === 0) {
          acc.push({ mzValue: curr, intensity: arr[idx + 1] });
        }
        return acc;
      }, []);

    const formattedData = {
      gcmsSpectrumExperimental: { spectrum: spectrumPairs },
      retentionIndex: parseFloat(formState.retentionIndex),
      retentionIndexTolerance: parseFloat(formState.retentionIndexTolerance),
      derivatizationMethod: formState.derivatizationMethod,
      columnType: formState.columnType,
    };

    console.log("Sending to backend:", JSON.stringify(formattedData, null, 2));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}gcms`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;
      console.log("Raw results:", rawResults);

      toast.success("Form submitted successfully!", {
        autoClose: 2000,
        closeOnClick: true,
        draggable: true,
        position: "middle-left",
      });
      setResults(rawResults);
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
        <span className="title-text">GC-MS Search</span>
      </header>

      <div
        className="page outer-container row"
        style={{ cursor: loading ? "wait" : "default" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid-container">
            <TextBoxInput
              label="Spectrum"
              name="spectrum"
              value={formState.spectrum}
              onChange={handleChange}
              className="box-input-gcms"
              placeholder="Enter spectrum in CSV format"
            />

            <TextInput
              label="Retention Index"
              name="retentionIndex"
              value={formState.retentionIndex}
              onChange={handleChange}
              placeholder="Enter RI"
              className="input-gcms"
            />

            <TextInput
              label="Retention Index Tolerance"
              name="retentionIndexTolerance"
              value={formState.retentionIndexTolerance}
              onChange={handleChange}
              placeholder="Enter RI tolerance"
              className="input-gcms"
            />

            <GroupRadio
              label="Derivatization Method"
              name="derivatizationMethod"
              value={formState.derivatizationMethod}
              options={["METHYL_CHLOROFORMATE", "TMS", "TBDMS_DERIVATIZATION"]}
              onChange={handleChange}
              className="metabolites-gcms"
            />

            <GroupRadio
              label="Column Type"
              name="columnType"
              value={formState.columnType}
              options={[
                "SEMISTANDARD_NON_POLAR",
                "STANDARD_NON_POLAR",
                "STANDARD_POLAR",
              ]}
              onChange={handleChange}
              className="ionization-gcms"
            />
          </div>

          <div className="form-buttons-container center-button">
            <button type="submit">Submit</button>
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

        {showResults && results && results.gcmsFeatures && (
          <div className="results-div">
            <MirroredSpectrum data={results} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GcMsSearch;
