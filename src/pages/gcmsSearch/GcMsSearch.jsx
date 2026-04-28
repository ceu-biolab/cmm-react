import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import TextInput from "../../components/search/TextInput";
import TextBoxInput from "../../components/search/TextBoxInput";
import GroupRadio from "../../components/search/GroupRadio";
import { ToastContainer, toast } from "react-toastify";
import MirroredSpectrum from "../../components/search/MirroredSpectrum";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup";
import ResultsSummary from "../../components/search/ResultsSummary";
import { formatApiError } from "../../utils/apiError";
import { normalizeAnnotation } from "../../utils/resultNormalization";
import { singleGroupResultMap } from "../../utils/resultsSummary";
import {
  parseFlexibleNumber,
  parsePeakList,
  serializePeakListForInput,
} from "../../utils/numberParsing";

const toDeuteriumAwareAlphabet = (chemicalAlphabet, deuteriumEnabled) => {
  if (!deuteriumEnabled || chemicalAlphabet === "ALL") {
    return chemicalAlphabet;
  }

  if (chemicalAlphabet === "CHNOPS") {
    return "CHNOPSD";
  }

  if (chemicalAlphabet === "CHNOPSCL") {
    return "CHNOPSCLD";
  }

  return chemicalAlphabet;
};

const toSpectrumPeaks = (spectrum = []) =>
  Array.isArray(spectrum)
    ? spectrum.map(({ mzValue, intensity }) => ({
        mz: mzValue,
        intensity,
      }))
    : [];

const getGcmsResultSource = (rawResults) => {
  if (Array.isArray(rawResults?.gcmsFeatures)) {
    return rawResults.gcmsFeatures[0] || {};
  }

  return rawResults || {};
};

const GcMsSearch = () => {
  const [formState, setFormState] = useState({
    spectrum: "",
    retentionIndex: "",
    retentionIndexTolerance: "",
    derivatizationMethod: "",
    columnType: "",
    chemicalAlphabet: "",
    deuterium: false,
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedMatchKey, setSelectedMatchKey] = useState(null);

  const loadDemoData = () => {
    console.log("Loading demo data...");
    setFormState({
      spectrum: serializePeakListForInput([
        { mz: 115.0376, intensity: 100.0 },
        { mz: 55.0177, intensity: 40.31255 },
        { mz: 59.0128, intensity: 18.10327 },
        { mz: 87.0427, intensity: 15.90476 },
        { mz: 71.0855, intensity: 6.21324 },
        { mz: 57.0698, intensity: 5.426879 },
        { mz: 116.0395, intensity: 5.407668 },
        { mz: 43.0292, intensity: 5.190647 },
        { mz: 85.1014, intensity: 3.522497 },
        { mz: 43.0541, intensity: 3.221486 },
        { mz: 143.0325, intensity: 2.812858 },
        { mz: 113.1323, intensity: 2.04844 },
        { mz: 56.0257, intensity: 2.012552 },
        { mz: 84.0934, intensity: 1.697714 },
        { mz: 121.9918, intensity: 1.101694 },
        { mz: 326.9567, intensity: 1.095998 },
        { mz: 127.1478, intensity: 1.063178 },
        { mz: 151.9783, intensity: 1.049012 },
        { mz: 107.5385, intensity: 1.047718 },
      ]),
      retentionIndex: "1500",
      retentionIndexTolerance: "10",
      derivatizationMethod: "METHYL_CHLOROFORMATE",
      columnType: "STANDARD_NON_POLAR",
      chemicalAlphabet: "CHNOPS",
      deuterium: false,
    });
  };

  const clearInput = () => {
    console.log("Clearing input...");
    setFormState({
      spectrum: "",
      retentionIndex: "",
      retentionIndexTolerance: "",
      derivatizationMethod: "",
      columnType: "",
      chemicalAlphabet: "",
      deuterium: false,
    });
  };

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { peaks, invalids } = parsePeakList(formState.spectrum);

    if (invalids.length) {
      toast.dismiss();
      toast.error("Spectrum must use m/z:intensity peaks separated by new lines or semicolons.");
      setLoading(false);
      return;
    }

    const spectrumPairs = peaks.map((peak) => ({
      mzValue: peak.mz,
      intensity: peak.intensity,
    }));

    const formattedData = {
      gcmsSpectrumExperimental: { spectrum: spectrumPairs },
      retentionIndex: parseFlexibleNumber(formState.retentionIndex),
      retentionIndexTolerance: parseFlexibleNumber(
        formState.retentionIndexTolerance
      ),
      derivatizationMethod: formState.derivatizationMethod,
      columnType: formState.columnType,
      chemicalAlphabet: toDeuteriumAwareAlphabet(
        formState.chemicalAlphabet,
        formState.deuterium
      ),
      deuterium: formState.deuterium,
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

      toast.dismiss();
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
      toast.dismiss();
      toast.error(formatApiError(error, { action: "submit your search" }));
    } finally {
      setLoading(false);
    }
  };

  const gcmsCompounds = useMemo(() => {
    const resultSource = getGcmsResultSource(results);
    const experimentalPeaks = toSpectrumPeaks(
      resultSource?.gcmsSpectrumExperimental?.spectrum
    );

    return (resultSource?.gcmsAnnotations || [])
      .slice()
      .sort(
        (left, right) =>
          (right.gcmsCosineScore ?? -Infinity) -
          (left.gcmsCosineScore ?? -Infinity)
      )
      .map((annotation, annotationIndex) => {
        const compoundPeaks = toSpectrumPeaks(
          annotation?.gcmsCompound?.gcmsspectrum?.[0]?.spectrum
        );

        return {
          ...normalizeAnnotation(annotation, `gcms-${annotationIndex + 1}`),
          comparisonKey: `a${annotationIndex}`,
          experimentalPeaks,
          compoundPeaks,
        };
      });
  }, [results]);

  const comparisonOptions = useMemo(
    () =>
      gcmsCompounds
        .filter(
          (compound) =>
            Array.isArray(compound?.compoundPeaks) &&
            compound.compoundPeaks.length > 0
        )
        .map((compound, index) => ({
          key: compound.comparisonKey,
          label:
            compound.compoundName || compound.compoundId || `Match ${index + 1}`,
          experimentalPeaks: compound.experimentalPeaks,
          compoundPeaks: compound.compoundPeaks,
          compoundName: compound.compoundName,
          compoundId: compound.compoundId,
        })),
    [gcmsCompounds]
  );

  const selectedComparison = useMemo(
    () =>
      comparisonOptions.find((option) => option.key === selectedMatchKey) ||
      comparisonOptions[0] ||
      null,
    [comparisonOptions, selectedMatchKey]
  );

  const selectedComparisonIndex = useMemo(() => {
    if (!selectedComparison) {
      return 0;
    }
    const index = comparisonOptions.findIndex(
      (option) => option.key === selectedComparison.key
    );
    return index >= 0 ? index : 0;
  }, [comparisonOptions, selectedComparison]);

  useEffect(() => {
    if (!comparisonOptions.length) {
      if (selectedMatchKey !== null) {
        setSelectedMatchKey(null);
      }
      return;
    }

    const hasSelection = comparisonOptions.some(
      (option) => option.key === selectedMatchKey
    );

    if (!hasSelection) {
      setSelectedMatchKey(comparisonOptions[0].key);
    }
  }, [comparisonOptions, selectedMatchKey]);

  const hasGcmsCompounds = gcmsCompounds.length > 0;
  const summaryResults = singleGroupResultMap("GC-MS matches", gcmsCompounds);

  return (
    <div className="page">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}

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
              validationMode="spectrum"
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
              label="Chemical Alphabet"
              name="chemicalAlphabet"
              value={formState.chemicalAlphabet}
              options={["ALL", "CHNOPS", "CHNOPSCL"]}
              onChange={handleChange}
              className="chem-alph-gcms"
            >
              <label className="box group-radio-deuterium">
                <input
                  type="checkbox"
                  name="deuterium"
                  checked={formState.deuterium}
                  onChange={handleChange}
                />
                Deuterium
              </label>
            </GroupRadio>

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
        <ToastContainer limit={1} />

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
          {showResults && selectedComparison && (
            <MirroredSpectrum
              title={
                selectedComparison.compoundName
                  ? `Experimental vs ${selectedComparison.compoundName}`
                  : selectedComparison.compoundId
                  ? `Experimental vs ${selectedComparison.compoundId}`
                  : "Experimental vs Match"
              }
              experimentalPeaks={selectedComparison.experimentalPeaks}
              compoundPeaks={selectedComparison.compoundPeaks}
              selectorOptions={comparisonOptions.map((option) => ({
                value: option.key,
                label: option.label,
              }))}
              selectedOptionIndex={selectedComparisonIndex}
              onSelectOption={(index) =>
                setSelectedMatchKey(comparisonOptions[index]?.key ?? null)
              }
              selectorAriaLabel="Select GC-MS match"
            />
          )}

          {showResults && hasGcmsCompounds && (
            <p className="compare-hint">Click row to compare spectra.</p>
          )}

          {showResults && (
            <>
              <ResultsSummary
                results={summaryResults}
                matchedAdductCount={hasGcmsCompounds ? 1 : 0}
                totalAdductCount={1}
                progressLabel="GC-MS matches"
                filename="gcms_export.csv"
                hiddenExportKeys={["score", "massErrorPpm"]}
              />

              {hasGcmsCompounds ? (
                <ResultsDropdownGroup
                  adduct="GC-MS matches"
                  compounds={gcmsCompounds}
                  defaultOpen
                  tableProps={{
                    hiddenColumns: ["score", "massErrorPpm"],
                    selectedRowId: selectedMatchKey,
                    getRowId: (compound) => compound.comparisonKey,
                    isRowSelectable: (compound) =>
                      Array.isArray(compound?.compoundPeaks) &&
                      compound.compoundPeaks.length > 0,
                    onRowClick: (compound) =>
                      setSelectedMatchKey(compound?.comparisonKey ?? null),
                  }}
                />
              ) : (
                <p className="no-results">No results found for this query.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GcMsSearch;
