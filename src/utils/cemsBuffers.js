import axios from "axios";

const createBufferOption = (value, label = value) => ({
  value: String(value),
  label: String(label),
});

const FALLBACK_BUFFERS = [
  createBufferOption("FORMIC_ACID_1M"),
  createBufferOption("N2"),
  createBufferOption("He"),
];

let cachedBuffers = null;
let buffersPromise = null;

const firstNonEmpty = (...values) =>
  values.find((value) => typeof value === "string" && value.trim() !== "") || null;

const normalizeBufferOption = (value) => {
  if (typeof value === "string" && value.trim() !== "") {
    return createBufferOption(value.trim());
  }

  if (value && typeof value === "object") {
    const code = firstNonEmpty(
      value.code,
      value.bufferCode,
      value.value,
      value.name
    );
    const description = firstNonEmpty(
      value.description,
      value.label,
      value.displayName,
      value.name
    );

    if (!code) {
      return null;
    }

    return createBufferOption(code, description || code);
  }

  return null;
};

const normalizeBufferArray = (value) =>
  Array.isArray(value)
    ? value
        .map(normalizeBufferOption)
        .filter(Boolean)
        .filter(
          (option, index, array) =>
            array.findIndex((entry) => entry.value === option.value) === index
        )
    : null;

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
      .get(`${import.meta.env.VITE_API_URL}metadata/ce-ms-buffers`)
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
