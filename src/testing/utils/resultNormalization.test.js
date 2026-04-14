import { describe, expect, it } from "vitest";
import {
  extractPathwayEntries,
  normalizeAnnotation,
  normalizeCompound,
} from "../../utils/resultNormalization";

describe("resultNormalization pathways", () => {
  it("preserves KEGG pathway links from pre-normalized pathwayEntries", () => {
    const normalizedInput = {
      pathways: ["Fatty acid metabolism"],
      pathwayEntries: [
        {
          name: "Fatty acid metabolism",
          keggPathwayId: "map01212",
          keggPathwayUrl: "https://www.kegg.jp/kegg-bin/show_pathway?map01212",
        },
      ],
    };

    const normalized = normalizeCompound(normalizedInput);

    expect(normalized.pathwayEntries).toHaveLength(1);
    expect(normalized.pathwayEntries[0].keggPathwayId).toBe("map01212");
    expect(normalized.pathwayEntries[0].keggPathwayUrl).toBe(
      "https://www.kegg.jp/kegg-bin/show_pathway?map01212"
    );
  });

  it("supports species-specific KEGG pathway IDs", () => {
    const entries = extractPathwayEntries([
      {
        pathwayName: "Glycolysis / Gluconeogenesis",
        pathwayMap: "hsa00010",
      },
    ]);

    expect(entries).toHaveLength(1);
    expect(entries[0].keggPathwayId).toBe("hsa00010");
    expect(entries[0].keggPathwayUrl).toBe(
      "https://www.kegg.jp/kegg-bin/show_pathway?hsa00010"
    );
  });

  it("extracts KEGG network IDs from pathway names when map code is not present", () => {
    const entries = extractPathwayEntries([
      {
        pathwayName: "nt06210  ERK signaling",
        pathwayMap: "NETWORK",
      },
    ]);

    expect(entries).toHaveLength(1);
    expect(entries[0].keggPathwayId).toBe("nt06210");
    expect(entries[0].keggPathwayUrl).toBe(
      "https://www.kegg.jp/kegg-bin/show_pathway?nt06210"
    );
  });
});

describe("resultNormalization search metadata", () => {
  it("maps LC score entries to component score columns", () => {
    const normalized = normalizeAnnotation({
      compound: {
        compoundId: 123,
        compoundName: "L-palmitoylcarnitine",
      },
      scores: [
        {
          ionizationScore: 1,
          adductRelationScore: 1,
          rtScore: 0.75,
        },
      ],
    });

    expect(normalized.ionizationScore).toBe(1);
    expect(normalized.adductScore).toBe(1);
    expect(normalized.rtScore).toBe(0.75);
  });

  it("preserves direct LC component scores during repeated normalization", () => {
    const normalized = normalizeCompound({
      compoundId: 123,
      compoundName: "L-palmitoylcarnitine",
      ionizationScore: 1,
      adductScore: 1,
      rtScore: 0.75,
    });

    expect(normalized.ionizationScore).toBe(1);
    expect(normalized.adductScore).toBe(1);
    expect(normalized.rtScore).toBe(0.75);
  });

  it("keeps MS/MS spectrum source on normalized rows", () => {
    const normalized = normalizeCompound({
      compoundId: 520,
      compoundName: "Retinol",
      spectrumSource: "experimental",
    });

    expect(normalized.spectrumSource).toBe("experimental");
  });
});
