import axios from "axios";

const FALLBACK_BUFFERS = ["FORMIC_ACID_1M", "N2", "He"];

let cachedBuffers = null;
let buffersPromise = null;

const normalizeBuffers = (data) => {
  if (Array.isArray(data)) {
    return data.filter(Boolean);
  }

  if (Array.isArray(data?.buffers)) {
    return data.buffers.filter(Boolean);
  }

  if (Array.isArray(data?.items)) {
    return data.items.filter(Boolean);
  }

  if (Array.isArray(data?.values)) {
    return data.values.filter(Boolean);
  }

  return null;
};

export const getCeMsBuffers = async () => {
  if (cachedBuffers) {
    return cachedBuffers;
  }

  if (!buffersPromise) {
    buffersPromise = axios
      .get(`${import.meta.env.VITE_API_URL}get/ce-ms-buffers`)
      .then((response) => {
        const normalized = normalizeBuffers(response.data);
        cachedBuffers =
          normalized && normalized.length ? normalized : FALLBACK_BUFFERS;
        return cachedBuffers;
      })
      .catch(() => {
        cachedBuffers = FALLBACK_BUFFERS;
        return cachedBuffers;
      })
      .finally(() => {
        buffersPromise = null;
      });
  }

  return buffersPromise;
};

export const defaultCeMsBuffers = FALLBACK_BUFFERS;
