import axios from "axios";

const FALLBACK_CCS_ADDUCTS = {
  positive: ["[M+Na]+", "[M+H]+"],
  negative: ["[M-H]-", "[M+Na-2H]-", "[M-H2O-H]-"],
};

let cachedCcsAdducts = null;
let ccsAdductsPromise = null;

const normalizeMode = (value) => {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("pos")) return "positive";
  if (normalized.includes("neg")) return "negative";
  return null;
};

const normalizeAdduct = (value) => {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    return value.adduct || value.code || value.name || null;
  }

  return null;
};

const normalizeAdductList = (value) =>
  Array.isArray(value) ? value.map(normalizeAdduct).filter(Boolean) : [];

const normalizeAdductsPayload = (payload) => {
  const positive = normalizeAdductList(payload?.positive);
  const negative = normalizeAdductList(payload?.negative);

  if (!positive.length && !negative.length) {
    return null;
  }

  return { positive, negative };
};

export const getCcsAdducts = async () => {
  if (cachedCcsAdducts) {
    return cachedCcsAdducts;
  }

  if (!ccsAdductsPromise) {
    ccsAdductsPromise = axios
      .get(`${import.meta.env.VITE_API_URL}get/ccs-adducts`)
      .then((response) => {
        const normalized = normalizeAdductsPayload(response.data);
        cachedCcsAdducts = normalized || FALLBACK_CCS_ADDUCTS;
        return cachedCcsAdducts;
      })
      .catch(() => {
        cachedCcsAdducts = FALLBACK_CCS_ADDUCTS;
        return cachedCcsAdducts;
      })
      .finally(() => {
        ccsAdductsPromise = null;
      });
  }

  return ccsAdductsPromise;
};

export const getCcsAdductOrder = async (ionizationMode) => {
  const modeKey = normalizeMode(ionizationMode);
  if (!modeKey) {
    return [];
  }
  const adducts = await getCcsAdducts();
  return adducts?.[modeKey] || [];
};

export const sortAdductEntries = (entries, order) => {
  if (!Array.isArray(entries) || entries.length < 2 || !Array.isArray(order)) {
    return entries;
  }

  const orderByAdduct = new Map(order.map((adduct, index) => [adduct, index]));

  return [...entries].sort(([left], [right]) => {
    const leftIndex = orderByAdduct.has(left)
      ? orderByAdduct.get(left)
      : Number.MAX_SAFE_INTEGER;
    const rightIndex = orderByAdduct.has(right)
      ? orderByAdduct.get(right)
      : Number.MAX_SAFE_INTEGER;

    if (leftIndex !== rightIndex) {
      return leftIndex - rightIndex;
    }

    return String(left).localeCompare(String(right));
  });
};

