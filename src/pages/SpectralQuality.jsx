import { useState, useEffect } from "react";
import axios from "axios";
import TextInput from "../components/search/TextInput";
import GroupRadio from "../components/search/GroupRadio";
import { ToastContainer, toast } from "react-toastify";
import pathwayIcon from "../assets/svgs/spectra.svg";

const SpectralQuality = () => {
  const [formState, setFormState] = useState({
    avgSignal: "",
    intensity: "",
    noise: "",
    scans: "",
    samples: "",
    coelution: "No co-elution",
    crossTalk: "No cross-talk",
  });

  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const loadDemoData = () => {
    console.log("Loading demo data...");
    setFormState({
      avgSignal: "100000",
      intensity: "100000",
      noise: "10",
      scans: "7",
      samples: "1",
      coelution: "No co-elution",
      crossTalk: "No cross-talk",
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      avgSignal: "",
      intensity: "",
      noise: "",
      scans: "",
      samples: "",
      coelution: "No co-elution",
      crossTalk: "No cross-talk",
    });
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
      avgSignal: parseFloat(formState.avgSignal),
      intensity: parseFloat(formState.intensity),
      noise: parseFloat(formState.noise),
      scans: parseFloat(formState.scans),
      samples: parseFloat(formState.samples),
      coelution: formState.coelution,
      crossTalk: formState.crossTalk,
    };

    console.log("Sending to backend:", JSON.stringify(formattedData, null, 2));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}compounds/simple-search`,
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
      toast.success("Form submitted successfully!", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        position: 'bottom-left',
      });
      setResults(groupedByAdduct);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting search:", error.response || error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="page">
      <header className="title-header">
        <img src={pathwayIcon} alt="Pathway Icon" className="icon" />
        <span className="title-text">Spectral Quality</span>
      </header>

      <div className="page outer-container row">
        <form onSubmit={handleSubmit}>
          <div className="grid-container-spectral-quality">
            <TextInput
              label="Average signal in MS mode"
              name="avgSignal"
              value={formState.avgSignal}
              onChange={handleChange}
              placeholder="Enter average signal in MS level"
              className="avg-signal-spec"
            />

            <TextInput
              label="Overall intensity of MS/MS spectra"
              name="intensity"
              value={formState.intensity}
              onChange={handleChange}
              placeholder="Enter overall intensity of MS/MS"
              className="intensity-spec"
            />

            <TextInput
              label="Noise level (%)"
              name="noise"
              value={formState.noise}
              onChange={handleChange}
              placeholder="Enter noise level percentage"
              className="noise-spec"
            />

            <TextInput
              label="Number of scans"
              name="scans"
              value={formState.scans}
              onChange={handleChange}
              placeholder="Enter number of scans of MS/MS"
              className="scans-spec"
            />

            <TextInput
              label="Number of samples"
              name="samples"
              value={formState.samples}
              onChange={handleChange}
              placeholder="Enter number of samples of MS/MS"
              className="samples-spec"
            />

            <GroupRadio
              label="Co-elution"
              name="coelution"
              value={formState.coelution}
              options={[
                "No co-elution",
                "With known compound",
                "With unknown compound",
              ]}
              onChange={handleChange}
              className="coelution-spec"
            />

            <GroupRadio
              label="Cross-talk"
              name="crossTalk"
              value={formState.crossTalk}
              options={["No cross-talk", "Soft cross-talk", "Hard cross-talk"]}
              onChange={handleChange}
              className="cross-talk-spec"
            />
          </div>
          <div className="form-buttons-container center-button">
            <button type="submit" onClick={handleSubmit}>
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
      </div>

      {showResults && (
        <div className="results-div">

        </div>
      )}
    </div>
  );
};

export default SpectralQuality;
