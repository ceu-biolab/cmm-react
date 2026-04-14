import { describe, expect, it } from "vitest";
import {
  buildCsvContent,
  buildExcelContent,
  buildJsonContent,
} from "../../utils/fileDownloadExport";

const headers = ["ID", "Name"];
const keys = ["compoundId", "compoundName"];
const groups = [
  {
    label: "Feature 1",
    compounds: [{ compoundId: 1, compoundName: "Compound A" }],
  },
  {
    label: "Feature 2",
    compounds: [{ compoundId: 2, compoundName: "Compound B" }],
  },
];

describe("FileDownload grouped exports", () => {
  it("adds feature columns to grouped CSV exports", () => {
    const csv = buildCsvContent({ headers, keys, groups });

    expect(csv.split("\n")[0]).toBe('"Feature Index","Feature","ID","Name"');
    expect(csv).toContain('"1","Feature 1","1","Compound A"');
    expect(csv).toContain('"2","Feature 2","2","Compound B"');
  });

  it("adds a features level to grouped JSON exports", () => {
    const parsed = JSON.parse(buildJsonContent({ groups }));

    expect(parsed.features).toHaveLength(2);
    expect(parsed.features[0]).toMatchObject({
      featureIndex: 1,
      featureLabel: "Feature 1",
      compounds: [{ compoundId: 1, compoundName: "Compound A" }],
    });
  });

  it("creates one Excel worksheet per feature for grouped exports", () => {
    const excel = buildExcelContent({ headers, keys, groups });

    expect(excel).toContain('<Worksheet ss:Name="Feature 1">');
    expect(excel).toContain('<Worksheet ss:Name="Feature 2">');
    expect(excel).toContain("Compound A");
    expect(excel).toContain("Compound B");
  });
});
