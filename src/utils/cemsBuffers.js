import axios from "axios";

const FALLBACK_BUFFERS = ["FORMIC_ACID_1M", "N2", "He"];

let cachedBuffers = null;
let buffersPromise = null;

const normalizeBufferCode = (value) => {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    return value.code || value.bufferCode || value.name || null;
  }

  return null;
};

const normalizeBufferArray = (value) =>
  Array.isArray(value) ? value.map(normalizeBufferCode).filter(Boolean) : null;

const normalizeBuffers = (data) => {
  const directList = normalizeBufferArray(data);
  if (directList && directList.length) {
    return directList;
  }

  const bufferList = normalizeBufferArray(data?.buffers);
  if (bufferList && bufferList.length) {
    return bufferList;
  }

  const itemList = normalizeBufferArray(data?.items);
  if (itemList && itemList.length) {
    return itemList;
  }

  const valueList = normalizeBufferArray(data?.values);
  if (valueList && valueList.length) {
    return valueList;
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
