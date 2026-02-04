import React, { useEffect, useMemo, useRef, useState } from "react";
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

let cachedAdducts = null;
let adductsPromise = null;

const normalizeAdducts = (data) => {
  const positive = Array.isArray(data?.positive)
    ? data.positive.filter(Boolean)
    : [];
  const negative = Array.isArray(data?.negative)
    ? data.negative.filter(Boolean)
    : [];

  if (!positive.length && !negative.length) {
    return null;
  }

  return { positive, negative };
};

const fetchAdducts = async () => {
  if (cachedAdducts) {
    return cachedAdducts;
  }

  if (!adductsPromise) {
    adductsPromise = axios
      .get(`${import.meta.env.VITE_API_URL}get/adducts`)
      .then((response) => {
        const normalized = normalizeAdducts(response.data);
        if (normalized) {
          cachedAdducts = normalized;
        }
        return cachedAdducts;
      })
      .catch(() => null)
      .finally(() => {
        adductsPromise = null;
      });
  }

  return adductsPromise;
};

const normalizeMode = (value) => {
  if (!value) return null;
  const lower = String(value).toLowerCase();
  if (lower.includes("pos")) return "positive";
  if (lower.includes("neg")) return "negative";
  return null;
};

const uniqueList = (values) => Array.from(new Set(values));

const hasSameItems = (left, right) => {
  if (left.length !== right.length) return false;
  const leftSet = new Set(left);
  if (leftSet.size !== left.length) return false;
  return right.every((item) => leftSet.has(item));
};

const AdductsCheckboxes = ({
  selectedAdducts = [],
  onSelectionChange,
  className = "",
  label = "Adducts",
  name = "adductsString",
  ionizationMode,
}) => {
  const [adducts, setAdducts] = useState(
    cachedAdducts || FALLBACK_ADDUCTS
  );
  const previousAvailableRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    fetchAdducts().then((data) => {
      if (!isMounted) return;
      setAdducts(data || FALLBACK_ADDUCTS);
    });

    return () => {
      isMounted = false;
    };
  }, []);

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

  const notifySelectionChange = (nextSelection) => {
    if (!onSelectionChange) {
      return;
    }
    onSelectionChange(nextSelection);
  };

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
      const filtered = selectedAdducts.filter((adduct) =>
        availableAdducts.includes(adduct)
      );
      if (!hasSameItems(filtered, selectedAdducts)) {
        notifySelectionChange(filtered);
      }
      previousAvailableRef.current = availableAdducts;
      return;
    }

    const wasAllSelected = previousAvailable.every((adduct) =>
      selectedAdducts.includes(adduct)
    );
    if (wasAllSelected) {
      if (!hasSameItems(availableAdducts, selectedAdducts)) {
        notifySelectionChange(availableAdducts);
      }
    } else {
      const filtered = selectedAdducts.filter((adduct) =>
        availableAdducts.includes(adduct)
      );
      if (!hasSameItems(filtered, selectedAdducts)) {
        notifySelectionChange(filtered);
      }
    }

    previousAvailableRef.current = availableAdducts;
  }, [availableAdducts, selectedAdducts, onSelectionChange]);

  const handleToggleAll = (event) => {
    if (event.target.checked) {
      notifySelectionChange(availableAdducts);
    } else {
      notifySelectionChange([]);
    }
  };

  const handleToggleAdduct = (adduct) => {
    const nextSelection = selectedAdducts.includes(adduct)
      ? selectedAdducts.filter((entry) => entry !== adduct)
      : [...selectedAdducts, adduct];
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
