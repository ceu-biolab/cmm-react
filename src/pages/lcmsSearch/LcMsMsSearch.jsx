import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextBoxInput from "../../components/search/TextBoxInput.jsx";
import ToleranceRadio from "../../components/search/ToleranceRadio.jsx";
import GroupRadio from "../../components/search/GroupRadio.jsx";
import SpectrumGraph from "../../components/search/SpectrumGraph.jsx";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes.jsx";
import MirroredSpectrum from "../../components/search/MirroredSpectrum.jsx";
import ResultsDropdownGroup from "../../components/search/ResultsDropdownGroup.jsx";
import ResultsSummary from "../../components/search/ResultsSummary.jsx";
import { formatApiError } from "../../utils/apiError";
import {
  buildFeatureSummaryResults,
  buildGroupedResultsView,
  countMatchedGroups,
  flattenGroupCompounds,
} from "../../utils/resultsSummary";
import {
  CHEMICAL_ALPHABET_OPTIONS,
  toDeuteriumAwareAlphabet,
} from "../../utils/chemicalAlphabet";
import {
  parseFlexibleNumber,
  parseNumberList,
  parsePeakList,
  serializeNumberListForInput,
  serializePeakListForInput,
  splitSpectrumBlocks,
} from "../../utils/numberParsing";

const SPECTRUM_SOURCE_OPTIONS = [
  { value: "ALL", label: "ALL" },
  { value: "experimental", label: "Experimental" },
  { value: "predicted", label: "Predicted" },
];

const LCMSMS_ENDPOINTS = [
  "LCMSMSSearch",
  "lcmsms-search",
  "lc-ms-ms-search",
];

const firstDefined = (...values) =>
  values.find((value) => value !== undefined && value !== null);

const normalizePeaks = (peaks) => {
  if (!Array.isArray(peaks) || peaks.length === 0) {
    return [];
  }

  const maxIntensity = peaks.reduce((max, peak) => {
    const intensity = Number(peak?.intensity) || 0;
    return Math.max(max, intensity);
  }, 0);

  if (!maxIntensity) {
    return peaks.map((peak) => ({
      mz: peak?.mz,
      intensity: 0,
    }));
  }

  return peaks.map((peak) => ({
    mz: peak?.mz,
    intensity: (Number(peak?.intensity) || 0) / maxIntensity,
  }));
};

const buildDemoSpectra = () => [
  [
    { mz: 41.305, intensity: 100.0 },
    { mz: 44.161, intensity: 64.873 },
    { mz: 45.378, intensity: 17.722 },
    { mz: 55.961, intensity: 44.937 },
    { mz: 57.303, intensity: 42.089 },
    { mz: 58.388, intensity: 10.206 },
    { mz: 69.072, intensity: 33.544 },
    { mz: 85.977, intensity: 43.354 },
    { mz: 132.064, intensity: 9.494 },
  ],
  [
    { mz: 55.301, intensity: 12.753 },
    { mz: 67.237, intensity: 14.611 },
    { mz: 69.204, intensity: 39.189 },
    { mz: 79.134, intensity: 14.527 },
    { mz: 81.102, intensity: 26.351 },
    { mz: 83.17, intensity: 13.007 },
    { mz: 91.118, intensity: 12.331 },
    { mz: 93.14, intensity: 30.405 },
    { mz: 95.091, intensity: 50.0 },
    { mz: 105.084, intensity: 27.365 },
    { mz: 107.052, intensity: 25.0 },
    { mz: 109.035, intensity: 31.757 },
    { mz: 121.035, intensity: 100.0 },
    { mz: 132.972, intensity: 31.419 },
    { mz: 150.992, intensity: 27.027 },
    { mz: 185.099, intensity: 12.5 },
    { mz: 244.947, intensity: 13.936 },
  ],
];

const serializeSpectraBlocksForInput = (spectra = []) =>
  spectra.map((peaks) => serializePeakListForInput(peaks)).join("\n\n");

const parseSpectrumBlockList = (value) => {
  const spectra = [];
  const invalids = [];

  splitSpectrumBlocks(value).forEach((block, blockIndex) => {
    const { peaks, invalids: blockInvalids } = parsePeakList(block);

    if (blockInvalids.length) {
      invalids.push(
        ...blockInvalids.map((entry) => `Spectrum ${blockIndex + 1}: ${entry}`)
      );
      return;
    }

    spectra.push({ peaks });
  });

  return { spectra, invalids };
};

const getHitsFromFeature = (featureResult) => {
  if (Array.isArray(featureResult)) {
    return featureResult;
  }

  const candidates = [
    featureResult?.lcmsmsList,
    featureResult?.lcMsMsList,
    featureResult?.lcMsmsList,
    featureResult?.msmsList,
    featureResult?.annotations,
    featureResult?.results,
    featureResult?.hits,
  ];

  return candidates.find(Array.isArray) || [];
};

const getRawFeatures = (rawResults) => {
  if (Array.isArray(rawResults)) {
    return rawResults;
  }

  const candidates = [
    rawResults?.features,
    rawResults?.msFeatures,
    rawResults?.msfeatures,
    rawResults?.lcmsmsFeatures,
    rawResults?.results,
  ];

  const features = candidates.find(Array.isArray);
  if (features) {
    return features;
  }

  const singleFeatureHits = getHitsFromFeature(rawResults);
  return singleFeatureHits.length ? [rawResults] : [];
};

const groupHitsByAdduct = (hits, featureIndex) =>
  Object.values(
    hits.reduce((acc, hit, hitIndex) => {
      const adduct = hit?.adduct || hit?.adductString || "Unknown";

      if (!acc[adduct]) {
        acc[adduct] = {
          adduct,
          compounds: [],
        };
      }

      const compound = hit?.compound || hit?.annotation?.compound || hit || {};

      acc[adduct].compounds.push({
        ...compound,
        finalScore: firstDefined(
          hit?.finalScore,
          hit?.lcmsmsScore,
          hit?.totalScore,
          compound?.finalScore
        ),
        score: firstDefined(hit?.score, hit?.matchingScore, compound?.score),
        rtScore: firstDefined(
          hit?.rtScore,
          hit?.retentionTimeScore,
          compound?.rtScore
        ),
        adductScore: firstDefined(
          hit?.adductScore,
          hit?.adductRelationScore,
          compound?.adductScore
        ),
        ionizationScore: firstDefined(
          hit?.ionizationScore,
          compound?.ionizationScore
        ),
        msmsCosineScore: firstDefined(
          hit?.msmsCosineScore,
          hit?.cosineScore,
          compound?.msmsCosineScore
        ),
        deltaPpmPrecursorIon: firstDefined(
          hit?.deltaPpmPrecursorIon,
          hit?.massErrorPpmPrecursorIon,
          compound?.deltaPpmPrecursorIon
        ),
        collisionEnergy: firstDefined(
          hit?.collisionEnergy,
          hit?.CIDEnergy,
          compound?.collisionEnergy
        ),
        spectrumSource: firstDefined(
          hit?.spectrumSource,
          compound?.spectrumSource
        ),
        spectrum: firstDefined(
          hit?.spectrum,
          hit?.matchedSpectrum,
          hit?.librarySpectrum,
          compound?.spectrum
        ),
        msmsId: firstDefined(
          hit?.msmsId,
          hit?.spectrumId,
          hit?.id,
          `feature-${featureIndex + 1}-${adduct}-${hitIndex}`
        ),
      });

      return acc;
    }, {})
  );

const getAdductGroupsFromFeature = (featureResult, featureIndex) => {
  const groupedCandidates =
    featureResult?.annotationsByAdducts || featureResult?.adductGroups;

  if (Array.isArray(groupedCandidates)) {
    return groupedCandidates.map((group) => ({
      adduct: group?.adduct || group?.adductString || "Unknown",
      compounds: groupHitsByAdduct(
        (group?.annotations || group?.compounds || []).map((hit) => ({
          ...hit,
          adduct: group?.adduct || group?.adductString || "Unknown",
        })),
        featureIndex
      ).flatMap((adductGroup) => adductGroup.compounds),
    }));
  }

  return groupHitsByAdduct(getHitsFromFeature(featureResult), featureIndex);
};

const normalizeFeatureResults = (rawResults, formattedData) => {
  const rawFeatures = getRawFeatures(rawResults);

  return formattedData.precursorIonMZValues.map((precursorIonMZ, index) => {
    const rawFeature = rawFeatures[index] || {};
    const feature = rawFeature?.feature || rawFeature;
    const adductGroups = getAdductGroupsFromFeature(rawFeature, index);

    return {
      featureIndex: index,
      precursorIonMZ: firstDefined(
        feature?.precursorIonMZ,
        feature?.precursorIonMz,
        feature?.mzValue,
        precursorIonMZ
      ),
      rtValue: firstDefined(
        feature?.rtValue,
        feature?.retentionTime,
        feature?.retentionTimeValue,
        formattedData.rtValues[index]
      ),
      experimentalSpectrum: firstDefined(
        rawFeature?.experimentalSpectrum,
        rawFeature?.querySpectrum,
        formattedData.fragmentsMZsIntensitiesList[index]
      ),
      adductGroups,
    };
  });
};

const postLcMsMsSearch = async (formattedData) => {
  let lastError;

  for (const endpoint of LCMSMS_ENDPOINTS) {
    try {
      return await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      const status = error?.response?.status;
      lastError = error;

      if (status !== 404 && status !== 405) {
        throw error;
      }
    }
  }

  throw lastError;
};

const formatFeatureNumber = (value, digits = 4) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(digits) : "N/A";
};

const LcMsMsSearch = () => {
  const createInitialFormState = () => ({
    precursorIonMZValues: "",
    rtValues: "",
    spectraBlocks: "",
    tolerancePrecursorIon: "",
    toleranceModePrecursorIon: "PPM",
    toleranceFragments: "100",
    toleranceModeFragments: "MDA",
    ionizationMode: "POSITIVE",
    adducts: [],
    chemicalAlphabet: "CHNOPS",
    deuterium: false,
    CIDEnergy: "",
    scoreType: "COSINE",
    spectrumSource: "ALL",
  });

  const [formState, setFormState] = useState(createInitialFormState);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [selectedMatchByFeature, setSelectedMatchByFeature] = useState({});

  const loadDemoData = () => {
    const spectra = buildDemoSpectra();

    setFormState({
      precursorIonMZValues: serializeNumberListForInput([132.101905, 287.236]),
      rtValues: serializeNumberListForInput([5.2, 6.8]),
      spectraBlocks: serializeSpectraBlocksForInput(spectra),
      tolerancePrecursorIon: 10.0,
      toleranceModePrecursorIon: "PPM",
      toleranceFragments: 100.0,
      toleranceModeFragments: "MDA",
      ionizationMode: "POSITIVE",
      adducts: ["[M+H]+"],
      chemicalAlphabet: "CHNOPS",
      deuterium: false,
      CIDEnergy: "HIGH",
      scoreType: "COSINE",
      spectrumSource: "experimental",
    });
  };

  const clearInput = () => {
    setFormState(createInitialFormState());
    setResults([]);
    setShowResults(false);
    setActiveFeatureIndex(0);
    setSelectedMatchByFeature({});
  };

  useEffect(() => {
    console.log("Updated searchData:", formState);
  }, [formState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormState((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdductsChange = (adducts) => {
    setFormState((prev) => ({ ...prev, adducts }));
  };

  const validateFeatureInputs = () => {
    const mzValues = parseNumberList(formState.precursorIonMZValues);
    const rtValues = parseNumberList(formState.rtValues);
    const spectra = parseSpectrumBlockList(formState.spectraBlocks);

    if (mzValues.invalids.length) {
      throw new Error(
        `Invalid precursor m/z entries: ${mzValues.invalids.join(", ")}`
      );
    }

    if (rtValues.invalids.length) {
      throw new Error(`Invalid RT entries: ${rtValues.invalids.join(", ")}`);
    }

    if (spectra.invalids.length) {
      throw new Error(`Invalid spectrum entries: ${spectra.invalids.join(", ")}`);
    }

    if (!mzValues.values.length) {
      throw new Error("Provide at least one precursor ion m/z value.");
    }

    if (
      mzValues.values.length !== rtValues.values.length ||
      mzValues.values.length !== spectra.spectra.length
    ) {
      throw new Error(
        "Precursor m/z values, RT values, and spectrum blocks must have the same number of features."
      );
    }

    return {
      precursorIonMZValues: mzValues.values,
      rtValues: rtValues.values,
      fragmentsMZsIntensitiesList: spectra.spectra,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let featurePayload;
    try {
      featurePayload = validateFeatureInputs();
    } catch (error) {
      alert(error.message);
      return;
    }

    setLoading(true);

    const formattedData = {
      CIDEnergy: formState.CIDEnergy,
      tolerancePrecursorIon: parseFlexibleNumber(
        formState.tolerancePrecursorIon
      ),
      toleranceModePrecursorIon: formState.toleranceModePrecursorIon,
      toleranceFragments: parseFlexibleNumber(formState.toleranceFragments),
      toleranceModeFragments: formState.toleranceModeFragments,
      ionizationMode: formState.ionizationMode,
      adducts: formState.adducts,
      precursorIonMZValues: featurePayload.precursorIonMZValues,
      fragmentsMZsIntensitiesList:
        featurePayload.fragmentsMZsIntensitiesList,
      scoreType: formState.scoreType,
      spectrumSource: formState.spectrumSource,
      rtValues: featurePayload.rtValues,
      chemicalAlphabet: toDeuteriumAwareAlphabet(
        formState.chemicalAlphabet,
        formState.deuterium
      ),
      deuterium: formState.deuterium,
    };

    console.log("Sending to backend:", formattedData);

    try {
      const response = await postLcMsMsSearch(formattedData);
      const rawResults = response.data || {};
      const normalizedFeatures = normalizeFeatureResults(rawResults, formattedData);
      const nextSelectedMatchByFeature = {};

      normalizedFeatures.forEach((feature, featureIndex) => {
        const firstAvailableMatch = feature.adductGroups
          .flatMap((group) => group.compounds)
          .find((compound) => Array.isArray(compound?.spectrum?.peaks));

        if (firstAvailableMatch?.msmsId) {
          nextSelectedMatchByFeature[featureIndex] = firstAvailableMatch.msmsId;
        }
      });

      setResults(normalizedFeatures);
      setActiveFeatureIndex(0);
      setSelectedMatchByFeature(nextSelectedMatchByFeature);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting search:", error.response || error);
      alert(formatApiError(error, { action: "submit your search" }));
    } finally {
      setLoading(false);
    }
  };

  const activeFeature = results[activeFeatureIndex] || null;
  const activeFeatureView = buildGroupedResultsView(
    activeFeature?.adductGroups,
    formState.adducts,
    {
      labelKey: "adduct",
      compoundsKey: "compounds",
      fallbackLabel: "Adduct",
    }
  );

  const allFeaturesSummaryResults = buildFeatureSummaryResults(results, {
    getFeatureLabel: (_, featureIndex) => `Feature ${featureIndex + 1}`,
    getFeatureCompounds: (feature) =>
      flattenGroupCompounds(feature.adductGroups, "compounds"),
  });
  const matchedFeatureCount = countMatchedGroups(allFeaturesSummaryResults);

  const allMatches = useMemo(
    () =>
      activeFeature?.adductGroups?.flatMap((group) =>
        (group.compounds || []).filter((compound) =>
          Array.isArray(compound?.spectrum?.peaks)
        )
      ) || [],
    [activeFeature]
  );

  const selectedMatchId = selectedMatchByFeature[activeFeatureIndex] ?? null;
  const selectedMatch = useMemo(
    () =>
      allMatches.find((compound) => compound.msmsId === selectedMatchId) ||
      allMatches[0] ||
      null,
    [allMatches, selectedMatchId]
  );

  const selectedMatchIndex = useMemo(() => {
    if (!selectedMatch) return 0;
    const index = allMatches.findIndex(
      (compound) => compound.msmsId === selectedMatch.msmsId
    );
    return index >= 0 ? index : 0;
  }, [allMatches, selectedMatch]);

  useEffect(() => {
    if (!allMatches.length) {
      return;
    }

    const exists = allMatches.some(
      (compound) => compound.msmsId === selectedMatchId
    );

    if (!exists) {
      setSelectedMatchByFeature((prev) => ({
        ...prev,
        [activeFeatureIndex]: allMatches[0]?.msmsId ?? null,
      }));
    }
  }, [activeFeatureIndex, allMatches, selectedMatchId]);

  const setSelectedMatchId = (msmsId) => {
    setSelectedMatchByFeature((prev) => ({
      ...prev,
      [activeFeatureIndex]: msmsId,
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
        <span className="title-text">LC-MS/MS Search</span>
      </header>

      <div
        className="page outer-container row"
        style={{ cursor: loading ? "wait" : "default" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid-container-lcmsms-batch">
            <TextBoxInput
              label="Precursor Ion m/z Values"
              name="precursorIonMZValues"
              value={formState.precursorIonMZValues}
              onChange={handleChange}
              className="precursor-values-lcmsms"
            />

            <TextBoxInput
              label="RT Values"
              name="rtValues"
              value={formState.rtValues}
              onChange={handleChange}
              className="rt-values-lcmsms"
            />

            <TextBoxInput
              label="MS/MS Spectra"
              name="spectraBlocks"
              value={formState.spectraBlocks}
              onChange={handleChange}
              className="spectra-blocks-lcmsms"
              validationMode="compositeSpectrum"
            />

            <ToleranceRadio
              label="Precursor Ion Tolerance"
              toleranceValue={formState.tolerancePrecursorIon}
              mzToleranceMode={formState.toleranceModePrecursorIon}
              onChange={handleChange}
              unitOptions={["PPM", "Da"]}
              inputName="tolerancePrecursorIon"
              modeName="toleranceModePrecursorIon"
              className="ion-tolerance-lcmsms"
            />

            <ToleranceRadio
              label="Fragment m/z Tolerance"
              inputName="toleranceFragments"
              modeName="toleranceModeFragments"
              toleranceValue={formState.toleranceFragments}
              mzToleranceMode={formState.toleranceModeFragments}
              unitOptions={["PPM", "MDA"]}
              onChange={handleChange}
              className="mz-tolerance-lcmsms"
            />

            <GroupRadio
              label="Ionization Mode"
              name="ionizationMode"
              value={formState.ionizationMode}
              options={["POSITIVE", "NEGATIVE"]}
              onChange={handleChange}
              className="ionization-div-lcmsms"
            />

            <GroupRadio
              label="Chemical Alphabet"
              name="chemicalAlphabet"
              value={formState.chemicalAlphabet}
              options={CHEMICAL_ALPHABET_OPTIONS}
              onChange={handleChange}
              className="chem-alph-lcmsms"
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
              label="Ionization Voltage"
              name="CIDEnergy"
              value={formState.CIDEnergy}
              options={["LOW", "MED", "HIGH", "ALL"]}
              onChange={handleChange}
              className="ionization-volt-div-lcmsms"
            />

            <GroupRadio
              label="Spectrum Source"
              name="spectrumSource"
              value={formState.spectrumSource}
              options={SPECTRUM_SOURCE_OPTIONS}
              onChange={handleChange}
              className="spectrum-source-lcmsms"
            />

            <AdductsCheckboxes
              selectedAdducts={formState.adducts}
              onSelectionChange={handleAdductsChange}
              ionizationMode={formState.ionizationMode}
              name="adducts"
              className="adducts-container-lcmsms"
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

        {showResults && (
          <div className="results-div">
            {results.length > 0 ? (
              <>
                <ResultsSummary
                  results={allFeaturesSummaryResults}
                  matchedAdductCount={matchedFeatureCount}
                  totalAdductCount={results.length}
                  progressLabel="Features with matches"
                  filename="lcmsms_all_features_export.csv"
                  hiddenExportKeys={["score"]}
                />

                <div className="feature-tabs" role="tablist">
                  {results.map((feature, featureIndex) => (
                    <button
                      key={`lcmsms-feature-tab-${featureIndex}`}
                      type="button"
                      className={`feature-tab ${
                        featureIndex === activeFeatureIndex ? "active" : ""
                      }`}
                      onClick={() => setActiveFeatureIndex(featureIndex)}
                    >
                      Feature {featureIndex + 1} | m/z{" "}
                      {formatFeatureNumber(feature.precursorIonMZ, 4)} | RT{" "}
                      {formatFeatureNumber(feature.rtValue, 2)}
                    </button>
                  ))}
                </div>

                <div className="feature-tab-panel">
                  <ResultsSummary
                    results={activeFeatureView.summaryResults}
                    matchedAdductCount={activeFeatureView.matchedGroupCount}
                    totalAdductCount={formState.adducts.length}
                    filename={`lcmsms_feature_${activeFeatureIndex + 1}_export.csv`}
                    hiddenExportKeys={["score"]}
                  />

                  {activeFeatureView.hasCompounds && (
                    <p className="compare-hint">Click row to compare spectra.</p>
                  )}
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
                            header: "Spectrum Source",
                            key: "spectrumSource",
                            always: true,
                          },
                          {
                            header: "MS/MS Cosine Score",
                            key: "msmsCosineScore",
                            type: "number",
                            digits: 4,
                            always: true,
                          },
                          {
                            header: "Collision Energy",
                            key: "collisionEnergy",
                            type: "number",
                            digits: 2,
                          },
                        ],
                        forceColumns: ["rtScore"],
                        hiddenColumns: ["score"],
                        selectedRowId: selectedMatchId,
                        getRowId: (compound, index) =>
                          compound?.msmsId ??
                          `${compound?.compoundId ?? "compound"}-${index}`,
                        isRowSelectable: (compound) =>
                          Array.isArray(compound?.spectrum?.peaks),
                        onRowClick: (compound) => {
                          if (!Array.isArray(compound?.spectrum?.peaks)) return;
                          setSelectedMatchId(compound.msmsId ?? null);
                        },
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

        {selectedMatch?.spectrum?.peaks?.length > 0 &&
        activeFeature?.experimentalSpectrum?.peaks?.length > 0 ? (
          <div className="spectrum-graph-wrapper">
            <MirroredSpectrum
              title={
                selectedMatch?.compoundName
                  ? `Feature ${activeFeatureIndex + 1}: Experimental vs ${
                      selectedMatch.compoundName
                    }`
                  : selectedMatch?.compoundId
                  ? `Feature ${activeFeatureIndex + 1}: Experimental vs ${
                      selectedMatch.compoundId
                    }`
                  : `Feature ${activeFeatureIndex + 1}: Experimental vs Match`
              }
              experimentalPeaks={activeFeature.experimentalSpectrum.peaks}
              compoundPeaks={selectedMatch.spectrum.peaks}
              selectorOptions={allMatches.map((compound, index) => ({
                value: compound?.msmsId ?? index,
                label: [
                  compound?.compoundName ||
                    compound?.compoundId ||
                    `Match ${index + 1}`,
                  compound?.spectrumSource,
                ]
                  .filter(Boolean)
                  .join(" | "),
              }))}
              selectedOptionIndex={selectedMatchIndex}
              onSelectOption={(index) =>
                setSelectedMatchId(allMatches[index]?.msmsId ?? null)
              }
              selectorAriaLabel="Select LC-MS/MS match"
            />
          </div>
        ) : (
          activeFeature?.experimentalSpectrum && (
            <div className="spectrum-graph-wrapper">
              <h3>Feature {activeFeatureIndex + 1} Experimental Spectrum</h3>
              <SpectrumGraph
                peaks={normalizePeaks(activeFeature.experimentalSpectrum.peaks)}
                precursorMz={activeFeature.precursorIonMZ}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LcMsMsSearch;
