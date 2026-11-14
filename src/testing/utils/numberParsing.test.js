import { describe, expect, it } from "vitest";
import {
  parseCompositeSpectra,
  parseFlexibleNumber,
  parseNumberList,
  parsePeakList,
} from "../../utils/numberParsing";

describe("numberParsing", () => {
  it("accepts decimal points and decimal commas", () => {
    expect(parseFlexibleNumber("126.23")).toBe(126.23);
    expect(parseFlexibleNumber("126,23")).toBe(126.23);
  });

  it("uses only newlines and semicolons for numeric lists", () => {
    expect(parseNumberList("126,23; 127.5\n128,75")).toEqual({
      values: [126.23, 127.5, 128.75],
      invalids: [],
    });

    expect(parseNumberList("126,23, 127.5").invalids).toEqual([
      "126,23, 127.5",
    ]);
  });

  it("parses spectra as mz:intensity pairs", () => {
    expect(parsePeakList("55,301:12,753; 67.237:14.611")).toEqual({
      peaks: [
        { mz: 55.301, intensity: 12.753 },
        { mz: 67.237, intensity: 14.611 },
      ],
      invalids: [],
    });
  });

  it("parses blank-line separated composite spectra", () => {
    expect(
      parseCompositeSpectra("400,3432:307034,88\n401.34576:73205.016\n\n422.32336:1562.73")
    ).toEqual({
      spectra: [
        {
          400.3432: 307034.88,
          401.34576: 73205.016,
        },
        {
          422.32336: 1562.73,
        },
      ],
      invalids: [],
    });
  });
});
