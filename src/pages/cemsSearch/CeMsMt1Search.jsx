import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes.jsx";
import CeMsCompoundSelector from "../../components/search/CeMsCompoundSelector.jsx";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup.jsx";
import ResultsSummary from "../../components/search/ResultsSummary.jsx";
import TextBoxInput from "../../components/search/TextBoxInput.jsx";
import TextInput from "../../components/search/TextInput.jsx";
import GroupRadio from "../../components/search/GroupRadio.jsx";
import ToleranceRadio from "../../components/search/ToleranceRadio.jsx";
import { formatApiError } from "../../utils/apiError";
import { defaultCeMsBuffers, getCeMsBuffers } from "../../utils/cemsBuffers";
import {
  getCeMsAllCompoundNames,
  getCeMsAvailableCompoundNames,
  getCeMsOptions,
  toCeMsApiPolarity,
  toCeMsMetadataIonizationMode,
} from "../../utils/ceMsOptions";
import { normalizeAnnotation } from "../../utils/resultNormalization";
import {
  buildGroupedResultsView,
  buildFeatureSummaryResults,
  countMatchedGroups,
  flattenGroupCompounds,
} from "../../utils/resultsSummary";
import { parseFlexibleNumber, parseRequiredNumberList } from "../../utils/numberParsing";

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

const formatFeatureNumber = (value, digits = 4) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(digits) : "N/A";
};

const CeMsMt1Search = () => {
  const createInitialFormState = () => ({
    masses: "",
    mt: "",
    tolerance: "",
    tolerance_mode: "PPM",
    mt_tolerance: "",
    mt_tolerance_mode: "percentage",
    buffer: "",
    temperature: "",
    polarity: "",
    marker: "",
    marker_time: "",
    capillary_length: "",
    capillary_voltage: "",
    chemical_alphabet: "",
    deuterium: false,
    ion_mode: "positive",
    adducts: [],
  });

  const [formState, setFormState] = useState(createInitialFormState);

  const loadDemoData = () => {
    setFormState({
      masses: ["291.1299", "298.098", "308.094", "316.2488", "55.055"].join(
        "\n"
      ),
      tolerance: "10",
      tolerance_mode: "PPM",
      mt: ["11.56", "13.65", "15.62", "12.59", "6.99"].join("\n"),
      mt_tolerance: "10",
      mt_tolerance_mode: "percentage",
      buffer: "FORMIC_ACID_1M",
      temperature: "20",
      polarity: "Direct",
      marker: "L-Methionine sulfone",
      marker_time: "14.24",
      capillary_length: "1000",
      capillary_voltage: "30",
      chemical_alphabet: "CHNOPS",
      deuterium: false,
      ion_mode: "positive",
      adducts: [
        "[M+H]+",
        "[M+2H]2+",
        "[M+Na]+",
        "[M+K]+",
        "[M+NH4]+",
        "[M+H-H2O]+",
      ],
    });
  };

  const clearInput = () => {
    setFormState(createInitialFormState());
  };

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [bufferOptions, setBufferOptions] = useState(defaultCeMsBuffers);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [ceMsOptions, setCeMsOptions] = useState(null);
  const [ceMsOptionsError, setCeMsOptionsError] = useState(false);

  useEffect(() => {
    let mounted = true;
    getCeMsBuffers().then((buffers) => {
      if (!mounted) return;
      setBufferOptions(buffers && buffers.length ? buffers : defaultCeMsBuffers);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    getCeMsOptions()
      .then((options) => {
        if (!mounted) return;
        setCeMsOptions(options);
        setCeMsOptionsError(false);
      })
      .catch(() => {
        if (!mounted) return;
        setCeMsOptionsError(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormState((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value ?? "" }));
    }
  };

  const handleAdductsChange = (adducts) => {
    setFormState((prev) => ({ ...prev, adducts }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedData = {
      masses: parseRequiredNumberList(formState.masses),
      mt: parseRequiredNumberList(formState.mt),
      tolerance: parseFlexibleNumber(formState.tolerance),
      tolerance_mode: formState.tolerance_mode,
      mt_tolerance: parseFlexibleNumber(formState.mt_tolerance),
      mt_tolerance_mode: formState.mt_tolerance_mode,
      buffer: formState.buffer,
      temperature: formState.temperature
        ? parseFlexibleNumber(formState.temperature)
        : null,
      polarity: toCeMsApiPolarity(formState.polarity),
      marker: formState.marker,
      marker_time: formState.marker_time
        ? parseFlexibleNumber(formState.marker_time)
        : null,
      capillary_length: formState.capillary_length
        ? parseFlexibleNumber(formState.capillary_length)
        : null,
      capillary_voltage: formState.capillary_voltage
        ? parseFlexibleNumber(formState.capillary_voltage)
        : null,
      chemical_alphabet: toDeuteriumAwareAlphabet(
        formState.chemical_alphabet,
        formState.deuterium
      ),
      ion_mode: formState.ion_mode,
      adducts: formState.adducts,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}cems-1-marker`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );
      const rawResults = response.data;

      const features =
        rawResults.ceFeatures?.map((item, featureIndex) => {
          const annotationsByAdducts =
            item.annotationsByAdducts?.map((adductGroup, adductIndex) => {
              const annotations =
                adductGroup.annotations?.map((annotation, annotationIndex) =>
                  normalizeAnnotation(
                    annotation,
                    `${featureIndex}-${adductIndex}-${annotationIndex}`
                  )
                ) || [];

              return {
                adduct: adductGroup.adduct,
                annotations,
              };
            }) || [];

          return {
            feature: item.feature,
            annotationsByAdducts,
          };
        }) || [];

      setResults(features);
      setActiveFeatureIndex(0);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting search:", error.response || error);
      alert(formatApiError(error, { action: "submit your search" }));
    } finally {
      setLoading(false);
    }
  };

  const compoundFilters = useMemo(
    () => ({
      bufferCode: formState.buffer,
      temperature: formState.temperature
        ? parseFlexibleNumber(formState.temperature)
        : null,
      polarity: toCeMsApiPolarity(formState.polarity),
      ionizationMode: toCeMsMetadataIonizationMode(formState.ion_mode),
    }),
    [
      formState.buffer,
      formState.temperature,
      formState.polarity,
      formState.ion_mode,
    ]
  );

  const allMarkerCompounds = useMemo(
    () => getCeMsAllCompoundNames(ceMsOptions, "markerCompounds"),
    [ceMsOptions]
  );

  const availableMarkerCompounds = useMemo(
    () =>
      getCeMsAvailableCompoundNames(
        ceMsOptions,
        "markerCompounds",
        compoundFilters
      ),
    [ceMsOptions, compoundFilters]
  );

  useEffect(() => {
    if (!ceMsOptions || !formState.marker) {
      return;
    }

    const availableLookup = new Set(availableMarkerCompounds);
    if (availableLookup.has(formState.marker)) {
      return;
    }

    setFormState((prev) =>
      prev.marker
        ? {
            ...prev,
            marker: "",
          }
        : prev
    );
  }, [availableMarkerCompounds, ceMsOptions, formState.marker]);

  const activeFeatureView = buildGroupedResultsView(
    results[activeFeatureIndex]?.annotationsByAdducts,
    formState.adducts,
    {
      labelKey: "adduct",
      compoundsKey: "annotations",
      fallbackLabel: "Adduct",
    }
  );
  const allFeaturesSummaryResults = buildFeatureSummaryResults(results, {
    getFeatureLabel: (_, featureIndex) => `Feature ${featureIndex + 1}`,
    getFeatureCompounds: (feature) =>
      flattenGroupCompounds(feature.annotationsByAdducts, "annotations"),
  });
  const matchedFeatureCount = countMatchedGroups(allFeaturesSummaryResults);

  return (
    <div className="page cemspage">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}

      <header className="title-header">
        <span className="title-text">CE-MS MT 1 Marker Search</span>
      </header>

      <div
        className="page outer-container row"
        style={{ cursor: loading ? "wait" : "default" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid-container-ce-ms-markers">
            <TextBoxInput
              label="Experimental m/z Values"
              name="masses"
              value={formState.masses}
              onChange={handleChange}
              className="masses-text-im-ms"
            />

            <TextBoxInput
              label="Migration Times (MT)"
              name="mt"
              value={formState.mt}
              onChange={handleChange}
              className="ccs-values-im-ms"
            />

            <ToleranceRadio
              label="Tolerance"
              toleranceValue={formState.tolerance}
              mzToleranceMode={formState.tolerance_mode}
              onChange={handleChange}
              unitOptions={["PPM", "DA"]}
              inputName="tolerance"
              modeName="tolerance_mode"
              className="tolerance-im-ms"
            />

            <ToleranceRadio
              label="MT Tolerance"
              toleranceValue={formState.mt_tolerance}
              mzToleranceMode={formState.mt_tolerance_mode}
              onChange={handleChange}
              unitOptions={["percentage", "absolute"]}
              inputName="mt_tolerance"
              modeName="mt_tolerance_mode"
              className="ccs-tolerance-im-ms"
            />

            <GroupRadio
              label="Chemical Alphabet"
              name="chemical_alphabet"
              value={formState.chemical_alphabet}
              options={["ALL", "CHNOPS", "CHNOPSCL"]}
              onChange={handleChange}
              className="chem-alph-im-ms"
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
              label="Buffer"
              name="buffer"
              value={formState.buffer}
              options={bufferOptions}
              onChange={handleChange}
              className="buffer-group-cems"
            />

            <GroupRadio
              label="Polarity"
              name="polarity"
              value={formState.polarity}
              options={["Direct", "Inverse"]}
              onChange={handleChange}
              className="polarity-group-im-ms"
            />

            <GroupRadio
              label="Ionization Mode"
              name="ion_mode"
              value={formState.ion_mode}
              options={["positive", "negative"]}
              onChange={handleChange}
              className="ion-mode-group-im-ms"
            />

            <AdductsCheckboxes
              label="Adducts"
              selectedAdducts={formState.adducts}
              onSelectionChange={handleAdductsChange}
              ionizationMode={formState.ion_mode}
              name="adducts"
              className="adducts-im-ms"
            />

            <TextInput
              label="Temperature (°C)"
              name="temperature"
              type="number"
              value={formState.temperature}
              onChange={handleChange}
              placeholder="e.g. 20"
              className="temperature-input-im-ms"
            />

            {ceMsOptions && allMarkerCompounds.length && !ceMsOptionsError ? (
              <CeMsCompoundSelector
                label="Marker Compound"
                name="marker"
                value={formState.marker}
                onChange={handleChange}
                options={allMarkerCompounds}
                availableOptions={availableMarkerCompounds}
                searchPlaceholder="Search marker compounds"
                className="marker-input-im-ms"
              />
            ) : (
              <TextInput
                label="Marker Compound"
                name="marker"
                value={formState.marker}
                onChange={handleChange}
                placeholder="e.g. L-Methionine sulfone"
                className="marker-input-im-ms"
              />
            )}

            <TextInput
              label="Marker Time (min)"
              name="marker_time"
              type="number"
              value={formState.marker_time}
              onChange={handleChange}
              placeholder="e.g. 14.24"
              className="marker-time-input-im-ms"
            />

            <TextInput
              label="Capillary Length (mm)"
              name="capillary_length"
              type="number"
              value={formState.capillary_length}
              onChange={handleChange}
              placeholder="e.g. 1000"
              className="capillary-length-input-im-ms"
            />

            <TextInput
              label="Capillary Voltage (kV)"
              name="capillary_voltage"
              type="number"
              value={formState.capillary_voltage}
              onChange={handleChange}
              placeholder="e.g. 30"
              className="capillary-voltage-input-im-ms"
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

        {showResults && (
          <div className="results-div">
            {Array.isArray(results) && results.length > 0 ? (
              <>
                <ResultsSummary
                  results={allFeaturesSummaryResults}
                  matchedAdductCount={matchedFeatureCount}
                  totalAdductCount={results.length}
                  progressLabel="Features with matches"
                  filename="cems_mt1_all_features_export.csv"
                />

                <div className="feature-tabs" role="tablist">
                  {results.map((featureObj, featureIndex) => (
                    <button
                      key={`cems-mt1-feature-tab-${featureIndex}`}
                      type="button"
                      className={`feature-tab ${
                        featureIndex === activeFeatureIndex ? "active" : ""
                      }`}
                      onClick={() => setActiveFeatureIndex(featureIndex)}
                    >
                      Feature {featureIndex + 1} | m/z{" "}
                      {formatFeatureNumber(featureObj.feature?.mzValue, 4)} |
                      Mobility{" "}
                      {formatFeatureNumber(featureObj.feature?.effectiveMobility, 2)}
                    </button>
                  ))}
                </div>

                <div className="feature-tab-panel">
                  <ResultsSummary
                    results={activeFeatureView.summaryResults}
                    matchedAdductCount={activeFeatureView.matchedGroupCount}
                    totalAdductCount={formState.adducts.length}
                    filename={`cems_mt1_feature_${activeFeatureIndex + 1}_export.csv`}
                  />

                  {!activeFeatureView.hasCompounds && (
                    <p className="no-results">
                      No results found for this feature.
                    </p>
                  )}

                  {activeFeatureView.displayGroups.map((group) => (
                    <ResultsDropdownGroup
                      key={`${activeFeatureIndex}-${group.adduct}`}
                      adduct={group.adduct}
                      compounds={group.compounds}
                      tableProps={{
                        extraColumns: [
                          {
                            header: "Mobility Error (%)",
                            key: "mobilityErrorPct",
                            type: "number",
                            digits: 4,
                          },
                        ],
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="no-results">No features returned.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CeMsMt1Search;
