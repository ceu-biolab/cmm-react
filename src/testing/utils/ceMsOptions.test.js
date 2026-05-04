import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import {
  __resetCeMsOptionsCache,
  getCeMsAllCompoundNames,
  getCeMsAvailableCompoundNames,
  getCeMsOptions,
  toCeMsApiPolarity,
  toCeMsMetadataIonizationMode,
} from "../../utils/ceMsOptions";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

beforeEach(() => {
  __resetCeMsOptionsCache();
  vi.clearAllMocks();
});

afterEach(() => {
  __resetCeMsOptionsCache();
});

describe("ceMsOptions helpers", () => {
  it("normalizes the metadata payload and caches the GET request", async () => {
    axios.get.mockResolvedValue({
      data: {
        conditions: [
          {
            buffer: {
              code: "FORMIC_ACID_1M",
            },
            temperature: 20,
            polarity: "Direct",
            ionizationMode: "Positive",
            markerCompounds: [
              { name: "Paracetamol" },
              { name: "L-Methionine sulfone" },
              { name: "Paracetamol" },
            ],
            rmtReferenceCompounds: [
              { name: "L-Methionine sulfone" },
              { name: "Paracetamol" },
            ],
          },
          {
            buffer: {
              code: "FORMIC_ACID_0DOT1M",
            },
            temperature: 20,
            polarity: "Reverse",
            ionizationMode: "Negative",
            markerCompounds: [{ name: "MES" }],
            rmtReferenceCompounds: [{ name: "MES" }],
          },
        ],
      },
    });

    const firstLoad = await getCeMsOptions();
    const secondLoad = await getCeMsOptions();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(firstLoad).toBe(secondLoad);
    expect(getCeMsAllCompoundNames(firstLoad, "markerCompounds")).toEqual([
      "Paracetamol",
      "L-Methionine sulfone",
      "MES",
    ]);
    expect(getCeMsAllCompoundNames(firstLoad, "rmtReferenceCompounds")).toEqual([
      "L-Methionine sulfone",
      "Paracetamol",
      "MES",
    ]);
  });

  it("filters available compounds by the current CE-MS selection", () => {
    const ceMsOptions = {
      conditions: [
        {
          bufferCode: "FORMIC_ACID_1M",
          temperature: 20,
          polarity: "Direct",
          ionizationMode: "Positive",
          markerCompounds: ["L-Methionine sulfone", "Paracetamol"],
          rmtReferenceCompounds: ["L-Methionine sulfone", "Paracetamol"],
        },
        {
          bufferCode: "FORMIC_ACID_1M",
          temperature: 25,
          polarity: "Direct",
          ionizationMode: "Positive",
          markerCompounds: ["Hippuric acid"],
          rmtReferenceCompounds: ["Hippuric acid"],
        },
        {
          bufferCode: "FORMIC_ACID_0DOT1M",
          temperature: 20,
          polarity: "Reverse",
          ionizationMode: "Negative",
          markerCompounds: ["MES"],
          rmtReferenceCompounds: ["MES"],
        },
      ],
      markerCompounds: [
        "L-Methionine sulfone",
        "Paracetamol",
        "Hippuric acid",
        "MES",
      ],
      rmtReferenceCompounds: [
        "L-Methionine sulfone",
        "Paracetamol",
        "Hippuric acid",
        "MES",
      ],
    };

    expect(
      getCeMsAvailableCompoundNames(ceMsOptions, "rmtReferenceCompounds", {
        bufferCode: "FORMIC_ACID_1M",
        temperature: 20,
        polarity: "Direct",
        ionizationMode: "Positive",
      })
    ).toEqual(["L-Methionine sulfone", "Paracetamol"]);

    expect(
      getCeMsAvailableCompoundNames(ceMsOptions, "markerCompounds", {
        bufferCode: "FORMIC_ACID_1M",
        polarity: "Direct",
        ionizationMode: "Positive",
      })
    ).toEqual([
      "L-Methionine sulfone",
      "Paracetamol",
      "Hippuric acid",
    ]);

    expect(toCeMsApiPolarity("Inverse")).toBe("Reverse");
    expect(toCeMsMetadataIonizationMode("negative")).toBe("Negative");
  });

  it("tolerates null metadata before the request resolves", () => {
    expect(getCeMsAllCompoundNames(null, "rmtReferenceCompounds")).toEqual([]);
    expect(
      getCeMsAvailableCompoundNames(null, "rmtReferenceCompounds", {
        bufferCode: "FORMIC_ACID_1M",
      })
    ).toEqual([]);
  });
});
