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
  buildFeatureSummaryResults,
  buildGroupedResultsView,
  countMatchedGroups,
  flattenGroupCompounds,
} from "../../utils/resultsSummary";
import {
  parseFlexibleNumber,
  parseRequiredNumberList,
} from "../../utils/numberParsing";

const DEMO_ADDUCTS = [
  "[M+H]+",
  "[M+2H]2+",
  "[M+Na]+",
  "[M+K]+",
  "[M+NH4]+",
  "[M+H-H2O]+",
];

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

const createInitialFormState = (markerCount) => ({
  masses: "",
  rmt: "",
  tolerance: "",
  tolerance_mode: "PPM",
  rmt_tolerance: "",
  rmt_tolerance_mode: "percentage",
  buffer: "",
  temperature: "",
  polarity: "",
  rmt_reference: "",
  marker: "",
  marker_time: "",
  marker1: "",
  marker1_time: "",
  marker2: "",
  marker2_time: "",
  capillary_length: "",
  capillary_voltage: "",
  chemical_alphabet: "",
  deuterium: false,
  ion_mode: "positive",
  adducts: [],
  markerCount,
});

const createDemoFormState = (markerCount) => ({
  ...createInitialFormState(markerCount),
  masses: ["291.1299", "298.098", "308.094", "316.2488", "55.055"].join("\n"),
  rmt: ["0.85", "0.86", "1.07", "0.93", "0.42"].join("\n"),
  tolerance: "10",
  tolerance_mode: "PPM",
  rmt_tolerance: "10",
  rmt_tolerance_mode: "percentage",
  buffer: "FORMIC_ACID_1M",
  temperature: "20",
  polarity: "Direct",
  rmt_reference: "L-Methionine sulfone",
  marker: markerCount === 1 ? "L-Methionine sulfone" : "",
  marker_time: markerCount === 1 ? "14.24" : "",
  marker1: markerCount === 2 ? "L-Methionine sulfone" : "",
  marker1_time: markerCount === 2 ? "14.24" : "",
  marker2: markerCount === 2 ? "Hippuric acid" : "",
  marker2_time: markerCount === 2 ? "25.29" : "",
  capillary_length: markerCount === 1 ? "1000" : "",
  capillary_voltage: markerCount === 1 ? "30" : "",
  chemical_alphabet: "CHNOPS",
  adducts: DEMO_ADDUCTS,
});

const getPageCopy = (markerCount) => {
  if (markerCount === 1) {
    return {
      title: "CE-MS RMT 1 Marker Search",
      endpoint: "cems-rmt-1-marker",
      tabKey: "cems-rmt1",
      allFeaturesFilename: "cems_rmt1_marker_all_features_export.csv",
      featureFilenamePrefix: "cems_rmt1_marker_feature",
    };
  }

  return {
    title: "CE-MS RMT 2 Markers Search",
    endpoint: "cems-rmt-2-marker",
    tabKey: "cems-rmt2",
    allFeaturesFilename: "cems_rmt2_markers_all_features_export.csv",
    featureFilenamePrefix: "cems_rmt2_markers_feature",
  };
};

const CeMsRmtMarkerSearch = ({ markerCount }) => {
  const pageCopy = getPageCopy(markerCount);
  const [formState, setFormState] = useState(() =>
    createInitialFormState(markerCount)
  );
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [bufferOptions, setBufferOptions] = useState(defaultCeMsBuffers);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [ceMsOptions, setCeMsOptions] = useState(null);
  const [ceMsOptionsError, setCeMsOptionsError] = useState(false);

  const loadDemoData = () => {
    setFormState(createDemoFormState(markerCount));
  };

  const clearInput = () => {
    setFormState(createInitialFormState(markerCount));
  };

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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      setFormState((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormState((prev) => ({ ...prev, [name]: value ?? "" }));
  };

  const handleAdductsChange = (adducts) => {
    setFormState((prev) => ({ ...prev, adducts }));
  };

  const buildPayload = (masses, rmtValues) => {
    const payload = {
      masses,
      tolerance: parseFlexibleNumber(formState.tolerance),
      tolerance_mode: formState.tolerance_mode,
      rmt: rmtValues,
      rmt_tolerance: parseFlexibleNumber(formState.rmt_tolerance),
      rmt_tolerance_mode: formState.rmt_tolerance_mode,
      buffer: formState.buffer,
      temperature: formState.temperature
        ? parseFlexibleNumber(formState.temperature)
        : null,
      polarity: toCeMsApiPolarity(formState.polarity),
      rmt_reference: formState.rmt_reference,
      chemical_alphabet: toDeuteriumAwareAlphabet(
        formState.chemical_alphabet,
        formState.deuterium
      ),
      ion_mode: formState.ion_mode,
      adducts: formState.adducts,
    };

    if (markerCount === 1) {
      return {
        ...payload,
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
      };
    }

    return {
      ...payload,
      marker1: formState.marker1,
      marker1_time: formState.marker1_time
        ? parseFlexibleNumber(formState.marker1_time)
        : null,
      marker2: formState.marker2,
      marker2_time: formState.marker2_time
        ? parseFlexibleNumber(formState.marker2_time)
        : null,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const masses = parseRequiredNumberList(formState.masses);
    const rmtValues = parseRequiredNumberList(formState.rmt);

    if (!masses.length || !rmtValues.length) {
      alert("Experimental m/z values and RMT values are required.");
      return;
    }

    if (masses.length !== rmtValues.length) {
      alert("Experimental m/z values and RMT values must have the same length.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${pageCopy.endpoint}`,
        buildPayload(masses, rmtValues),
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResults = response.data;
      const features =
        rawResults.ceFeatures?.map((item, featureIndex) => {
          const annotationsByAdducts =
            item.annotationsByAdducts?.map((adductGroup, adductIndex) => ({
              adduct: adductGroup.adduct,
              annotations:
                adductGroup.annotations?.map((annotation, annotationIndex) =>
                  normalizeAnnotation(
                    annotation,
                    `${featureIndex}-${adductIndex}-${annotationIndex}`
                  )
                ) || [],
            })) || [];

          return {
            feature: item.feature,
            submittedRmt: rmtValues[featureIndex] ?? null,
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
    if (!ceMsOptions) {
      return;
    }

    const availableMarkerLookup = new Set(availableMarkerCompounds);

    setFormState((prev) => {
      const nextState = { ...prev };
      let changed = false;

      if (
        nextState.rmt_reference &&
        !availableMarkerLookup.has(nextState.rmt_reference)
      ) {
        nextState.rmt_reference = "";
        changed = true;
      }

      if (nextState.marker && !availableMarkerLookup.has(nextState.marker)) {
        nextState.marker = "";
        changed = true;
      }

      if (nextState.marker1 && !availableMarkerLookup.has(nextState.marker1)) {
        nextState.marker1 = "";
        changed = true;
      }

      if (nextState.marker2 && !availableMarkerLookup.has(nextState.marker2)) {
        nextState.marker2 = "";
        changed = true;
      }

      return changed ? nextState : prev;
    });
  }, [availableMarkerCompounds, ceMsOptions]);

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

  const renderReferenceSelector = () =>
    ceMsOptions && allMarkerCompounds.length && !ceMsOptionsError ? (
      <CeMsCompoundSelector
        label="RMT Reference Compound"
        name="rmt_reference"
        value={formState.rmt_reference}
        onChange={handleChange}
        options={allMarkerCompounds}
        availableOptions={availableMarkerCompounds}
        searchPlaceholder="Search reference compounds"
      />
    ) : (
      <TextInput
        label="RMT Reference Compound"
        name="rmt_reference"
        value={formState.rmt_reference}
        onChange={handleChange}
        placeholder="e.g. L-Methionine sulfone"
      />
    );

  const renderMarkerSelector = (label, name, placeholder) =>
    ceMsOptions && allMarkerCompounds.length && !ceMsOptionsError ? (
      <CeMsCompoundSelector
        label={label}
        name={name}
        value={formState[name]}
        onChange={handleChange}
        options={allMarkerCompounds}
        availableOptions={availableMarkerCompounds}
        searchPlaceholder="Search marker compounds"
      />
    ) : (
      <TextInput
        label={label}
        name={name}
        value={formState[name]}
        onChange={handleChange}
        placeholder={placeholder}
      />
    );

  return (
    <div className="page cemspage">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}

      <header className="title-header">
        <span className="title-text">{pageCopy.title}</span>
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
              label="Relative Migration Times"
              name="rmt"
              value={formState.rmt}
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
              label="RMT Tolerance"
              toleranceValue={formState.rmt_tolerance}
              mzToleranceMode={formState.rmt_tolerance_mode}
              onChange={handleChange}
              unitOptions={["percentage", "absolute"]}
              inputName="rmt_tolerance"
              modeName="rmt_tolerance_mode"
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

            {renderReferenceSelector()}

            {markerCount === 1 ? (
              <>
                {renderMarkerSelector(
                  "Marker Compound",
                  "marker",
                  "e.g. L-Methionine sulfone"
                )}

                <TextInput
                  label="Marker Time (min)"
                  name="marker_time"
                  type="number"
                  value={formState.marker_time}
                  onChange={handleChange}
                  placeholder="e.g. 14.24"
                />

                <TextInput
                  label="Capillary Length (mm)"
                  name="capillary_length"
                  type="number"
                  value={formState.capillary_length}
                  onChange={handleChange}
                  placeholder="e.g. 1000"
                />

                <TextInput
                  label="Capillary Voltage (kV)"
                  name="capillary_voltage"
                  type="number"
                  value={formState.capillary_voltage}
                  onChange={handleChange}
                  placeholder="e.g. 30"
                />
              </>
            ) : (
              <>
                {renderMarkerSelector(
                  "Marker 1 Compound",
                  "marker1",
                  "e.g. L-Methionine sulfone"
                )}

                <TextInput
                  label="Marker 1 Time (min)"
                  name="marker1_time"
                  type="number"
                  value={formState.marker1_time}
                  onChange={handleChange}
                  placeholder="e.g. 14.24"
                />

                {renderMarkerSelector(
                  "Marker 2 Compound",
                  "marker2",
                  "e.g. Hippuric acid"
                )}

                <TextInput
                  label="Marker 2 Time (min)"
                  name="marker2_time"
                  type="number"
                  value={formState.marker2_time}
                  onChange={handleChange}
                  placeholder="e.g. 25.29"
                />
              </>
            )}
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

        {showResults && (
          <div className="results-div">
            {results.length > 0 ? (
              <>
                <ResultsSummary
                  results={allFeaturesSummaryResults}
                  matchedAdductCount={matchedFeatureCount}
                  totalAdductCount={results.length}
                  progressLabel="Features with matches"
                  filename={pageCopy.allFeaturesFilename}
                />

                <div className="feature-tabs" role="tablist">
                  {results.map((featureObj, featureIndex) => (
                    <button
                      key={`${pageCopy.tabKey}-feature-tab-${featureIndex}`}
                      type="button"
                      className={`feature-tab ${
                        featureIndex === activeFeatureIndex ? "active" : ""
                      }`}
                      onClick={() => setActiveFeatureIndex(featureIndex)}
                    >
                      Feature {featureIndex + 1} | m/z{" "}
                      {formatFeatureNumber(featureObj.feature?.mzValue, 4)} |
                      RMT {formatFeatureNumber(featureObj.submittedRmt, 3)}
                    </button>
                  ))}
                </div>

                <div className="feature-tab-panel">
                  <ResultsSummary
                    results={activeFeatureView.summaryResults}
                    matchedAdductCount={activeFeatureView.matchedGroupCount}
                    totalAdductCount={formState.adducts.length}
                    filename={`${pageCopy.featureFilenamePrefix}_${
                      activeFeatureIndex + 1
                    }_export.csv`}
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
                            header: "Relative MT",
                            key: "relativeMt",
                            type: "number",
                            digits: 4,
                          },
                          {
                            header: "Absolute MT",
                            key: "absoluteMt",
                            type: "number",
                            digits: 4,
                          },
                          {
                            header: "RMT Error (%)",
                            key: "rmtErrorPct",
                            type: "number",
                            digits: 4,
                          },
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

export default CeMsRmtMarkerSearch;
