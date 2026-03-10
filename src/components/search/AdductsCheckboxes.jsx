import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const FALLBACK_ADDUCTS = {
  positive: [
    "[M+Na]+",
    "[M+2H]2+",
    "[M+H]+",
    "[M+K]+",
    "[M+NH4]+",
    "[M+H-H2O]+",
    "[M+H+NH4]2+",
    "[M+H+HCOONa]+",
    "[M+H-2H2O]+",
    "[M+C3H9ONa]+",
    "[M+Li]+",
    "[2M+2H+3H2O]+",
    "[2M+ACN+H]+",
    "[2M+ACN+Na]+",
    "[2M+H-H2O]+",
    "[2M+H]+",
    "[2M+K]+",
    "[2M+NH4]+",
    "[2M+Na]+",
    "[M+2ACN+2H]2+",
    "[M+2ACN+H]+",
    "[M+2H+Na]3+",
    "[M+2K-H]+",
    "[M+2Na-H]+",
    "[M+2Na]2+",
    "[M+3ACN+2H]2+",
    "[M+3H]3+",
    "[M+3Na]3+",
    "[M+ACN+2H]2+",
    "[M+ACN+H]+",
    "[M+ACN+Na]+",
    "[M+CH3OH+H]+",
    "[M+DMSO+H]+",
    "[M+H+2Na]3+",
    "[M+H+K]2+",
    "[M+H+Na]2+",
    "[M+IsoProp+H]+",
    "[M+IsoProp+Na+H]+",
    "[M+NH4-H2O]+",
  ],
  negative: [
    "[M-H]-",
    "[M+Cl]-",
    "[M-H-H2O]-",
    "[M+Na-2H]-",
    "[M+K-2H]-",
    "[M+Hac-H]-",
    "[M+FA-H]-",
    "[2M+CH3COO]-",
    "[2M+FA-H]-",
    "[2M+Hac-H]-",
    "[2M-H]-",
    "[3M-H]-",
    "[M+Br]-",
    "[M+CH3COO]-",
    "[M+TFA-H]-",
    "[M-2H]2-",
    "[M-3H]3-",
    "[M-H2O-H]-",
  ],
};

const FALLBACK_CCS_ADDUCTS = {
  positive: ["[M+Na]+", "[M+H]+"],
  negative: ["[M-H]-", "[M+Na-2H]-", "[M-H2O-H]-"],
};

const cachedAdductsByEndpoint = {};
const adductsPromiseByEndpoint = {};

const resolveFallbackAdducts = (endpoint) => {
  if (endpoint === "get/ccs-adducts") {
    return FALLBACK_CCS_ADDUCTS;
  }
  return FALLBACK_ADDUCTS;
};

const normalizeAdductValue = (value) => {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    return value.adduct || value.code || value.name || null;
  }

  return null;
};

const normalizeAdducts = (data) => {
  const positive = Array.isArray(data?.positive)
    ? data.positive.map(normalizeAdductValue).filter(Boolean)
    : [];
  const negative = Array.isArray(data?.negative)
    ? data.negative.map(normalizeAdductValue).filter(Boolean)
    : [];

  if (!positive.length && !negative.length) {
    return null;
  }

  return { positive, negative };
};

const fetchAdducts = async (endpoint) => {
  if (cachedAdductsByEndpoint[endpoint]) {
    return cachedAdductsByEndpoint[endpoint];
  }

  if (!adductsPromiseByEndpoint[endpoint]) {
    adductsPromiseByEndpoint[endpoint] = axios
      .get(`${import.meta.env.VITE_API_URL}${endpoint}`)
      .then((response) => {
        const normalized = normalizeAdducts(response.data);
        if (normalized) {
          cachedAdductsByEndpoint[endpoint] = normalized;
        }
        return cachedAdductsByEndpoint[endpoint];
      })
      .catch(() => null)
      .finally(() => {
        adductsPromiseByEndpoint[endpoint] = null;
      });
  }

  return adductsPromiseByEndpoint[endpoint];
};

const normalizeMode = (value) => {
  if (!value) return null;
  const lower = String(value).toLowerCase();
  if (lower.includes("pos")) return "positive";
  if (lower.includes("neg")) return "negative";
  return null;
};

const uniqueList = (values) => Array.from(new Set(values));
const hasSameOrder = (left, right) =>
  left.length === right.length &&
  left.every((item, index) => item === right[index]);

const orderSelectionByAvailable = (selection, availableAdducts) => {
  const availableSet = new Set(availableAdducts);
  const selectionSet = new Set(selection);

  const orderedKnown = availableAdducts.filter((adduct) =>
    selectionSet.has(adduct)
  );
  const unknown = selection.filter((adduct) => !availableSet.has(adduct));

  return uniqueList([...orderedKnown, ...unknown]);
};

const DEFAULT_ADDUCTS_BY_MODE = {
  positive: ["[M+H]+", "[M+2H]2+", "[M+Na]+", "[M+K]+", "[M+NH4]+", "[M+H-H2O]+"],
  negative: ["[M-H]-", "[M+Cl]-", "[M+HCOOH-H]-", "[M+FA-H]-", "[M-H-H2O]-"],
};

const getDefaultAdducts = (modeKey, availableAdducts, preferPreset = true) => {
  if (preferPreset) {
    const preferred = DEFAULT_ADDUCTS_BY_MODE[modeKey] || [];
    const defaults = preferred.filter((adduct) =>
      availableAdducts.includes(adduct)
    );
    if (defaults.length) {
      return defaults;
    }
  }

  return availableAdducts.slice(0, 6);
};

const AdductsCheckboxes = ({
  selectedAdducts = [],
  onSelectionChange,
  className = "",
  label = "Adducts",
  name = "adductsString",
  ionizationMode,
  adductsEndpoint = "get/adducts",
}) => {
  const usePresetDefaults = adductsEndpoint !== "get/ccs-adducts";
  const [adducts, setAdducts] = useState(
    cachedAdductsByEndpoint[adductsEndpoint] ||
      resolveFallbackAdducts(adductsEndpoint)
  );
  const previousAvailableRef = useRef(null);
  const keepEmptySelectionRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const fallbackAdducts = resolveFallbackAdducts(adductsEndpoint);
    previousAvailableRef.current = null;

    setAdducts(cachedAdductsByEndpoint[adductsEndpoint] || fallbackAdducts);

    fetchAdducts(adductsEndpoint).then((data) => {
      if (!isMounted) return;
      setAdducts(data || fallbackAdducts);
    });

    return () => {
      isMounted = false;
    };
  }, [adductsEndpoint]);

  const modeKey = useMemo(
    () => normalizeMode(ionizationMode),
    [ionizationMode]
  );

  const availableAdducts = useMemo(() => {
    if (!modeKey) {
      return uniqueList([
        ...(adducts?.positive || []),
        ...(adducts?.negative || []),
      ]);
    }
    return adducts?.[modeKey] || [];
  }, [adducts, modeKey]);

  const notifySelectionChange = useCallback(
    (nextSelection) => {
      if (!onSelectionChange) {
        return;
      }
      onSelectionChange(nextSelection);
    },
    [onSelectionChange]
  );

  const isAllSelected =
    availableAdducts.length > 0 &&
    availableAdducts.every((adduct) => selectedAdducts.includes(adduct));

  useEffect(() => {
    if (!availableAdducts.length) {
      previousAvailableRef.current = availableAdducts;
      return;
    }

    const previousAvailable = previousAvailableRef.current;
    if (!previousAvailable || !previousAvailable.length) {
      const filtered = orderSelectionByAvailable(
        selectedAdducts.filter((adduct) => availableAdducts.includes(adduct)),
        availableAdducts
      );

      if (!filtered.length && !selectedAdducts.length && modeKey) {
        if (!keepEmptySelectionRef.current) {
          const defaults = getDefaultAdducts(
            modeKey,
            availableAdducts,
            usePresetDefaults
          );
          if (defaults.length) {
            notifySelectionChange(
              orderSelectionByAvailable(defaults, availableAdducts)
            );
            previousAvailableRef.current = availableAdducts;
            return;
          }
        }
      }

      if (!hasSameOrder(filtered, selectedAdducts)) {
        notifySelectionChange(filtered);
      }
      previousAvailableRef.current = availableAdducts;
      return;
    }

    const wasAllSelected =
      previousAvailable.length > 0 &&
      previousAvailable.every((adduct) => selectedAdducts.includes(adduct));
    if (wasAllSelected) {
      if (!hasSameOrder(availableAdducts, selectedAdducts)) {
        notifySelectionChange(availableAdducts);
      }
    } else {
      const filtered = orderSelectionByAvailable(
        selectedAdducts.filter((adduct) => availableAdducts.includes(adduct)),
        availableAdducts
      );

      if (!filtered.length && modeKey) {
        if (!keepEmptySelectionRef.current) {
          const defaults = getDefaultAdducts(
            modeKey,
            availableAdducts,
            usePresetDefaults
          );
          if (defaults.length) {
            notifySelectionChange(
              orderSelectionByAvailable(defaults, availableAdducts)
            );
            previousAvailableRef.current = availableAdducts;
            return;
          }
        }
      }

      if (!hasSameOrder(filtered, selectedAdducts)) {
        notifySelectionChange(filtered);
      }
    }

    previousAvailableRef.current = availableAdducts;

    if (selectedAdducts.length > 0) {
      keepEmptySelectionRef.current = false;
    }
  }, [
    availableAdducts,
    selectedAdducts,
    notifySelectionChange,
    modeKey,
    usePresetDefaults,
  ]);

  const handleToggleAll = (event) => {
    if (event.target.checked) {
      keepEmptySelectionRef.current = false;
      notifySelectionChange(availableAdducts);
    } else {
      keepEmptySelectionRef.current = true;
      notifySelectionChange([]);
    }
  };

  const handleToggleAdduct = (adduct) => {
    const nextSelection = orderSelectionByAvailable(
      selectedAdducts.includes(adduct)
        ? selectedAdducts.filter((entry) => entry !== adduct)
        : [...selectedAdducts, adduct],
      availableAdducts
    );
    keepEmptySelectionRef.current = nextSelection.length === 0;
    notifySelectionChange(nextSelection);
  };

  return (
    <div className={`adducts-div ${className}`}>
      {label && <label className="inner-column-label">{label}</label>}{" "}
      <div className="scrollable-checkboxes">
        <label key="select-all">
          <input
            className="checkbox"
            type="checkbox"
            name={`${name}-select-all`}
            value="Select All"
            checked={isAllSelected}
            onChange={handleToggleAll}
          />
          Select All
        </label>
        {availableAdducts.map((adduct) => (
          <label key={adduct}>
            <input
              className="checkbox"
              type="checkbox"
              name={name}
              value={adduct}
              checked={selectedAdducts.includes(adduct)}
              onChange={() => handleToggleAdduct(adduct)}
            />
            {adduct}
          </label>
        ))}
      </div>
    </div>
  );
};

export default AdductsCheckboxes;
