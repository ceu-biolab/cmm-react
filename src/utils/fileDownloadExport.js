const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const serializeExportValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join("; ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const escapeCsvValue = (value) => {
  const serialized = serializeExportValue(value);
  return `"${serialized.replace(/"/g, '""')}"`;
};

export const normalizeExportGroups = (groups = []) =>
  Array.isArray(groups)
    ? groups.map((group, index) => ({
        featureIndex: group?.featureIndex ?? index + 1,
        featureLabel:
          group?.featureLabel || group?.label || `Feature ${index + 1}`,
        compounds: Array.isArray(group?.compounds) ? group.compounds : [],
      }))
    : [];

const sanitizeWorksheetName = (name, index, usedNames) => {
  const fallback = `Feature ${index + 1}`;
  const cleanName = String(name || fallback)
    .replace(/[\]:*?/\\]/g, " ")
    .replace(/\[/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 31) || fallback;

  let nextName = cleanName;
  let suffix = 2;

  while (usedNames.has(nextName)) {
    const suffixText = ` ${suffix}`;
    nextName = `${cleanName.slice(0, 31 - suffixText.length)}${suffixText}`;
    suffix += 1;
  }

  usedNames.add(nextName);
  return nextName;
};

const buildTableRows = (data = [], keys = []) =>
  data
    .map((row) => {
      const cells = keys
        .map((key) => `<td>${escapeHtml(serializeExportValue(row[key]))}</td>`)
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

const buildSpreadsheetXmlCell = (value) => {
  const serialized = serializeExportValue(value);
  const cellType =
    typeof value === "number" && Number.isFinite(value) ? "Number" : "String";

  return `<Cell><Data ss:Type="${cellType}">${escapeXml(serialized)}</Data></Cell>`;
};

const buildSpreadsheetXmlRows = (data = [], headers = [], keys = []) => {
  const headerRow = `<Row>${headers
    .map((header) => buildSpreadsheetXmlCell(header))
    .join("")}</Row>`;
  const dataRows = data
    .map(
      (row) =>
        `<Row>${keys.map((key) => buildSpreadsheetXmlCell(row[key])).join("")}</Row>`
    )
    .join("");

  return `${headerRow}${dataRows}`;
};

export const buildCsvContent = ({
  data = [],
  headers = [],
  keys = [],
  groups,
}) => {
  const normalizedGroups = normalizeExportGroups(groups);

  if (normalizedGroups.length) {
    const csvHeaders = ["Feature Index", "Feature", ...headers];
    const csvRows = [csvHeaders.map(escapeCsvValue).join(",")];

    normalizedGroups.forEach((group) => {
      group.compounds.forEach((row) => {
        const values = [
          group.featureIndex,
          group.featureLabel,
          ...keys.map((key) => row[key]),
        ].map(escapeCsvValue);
        csvRows.push(values.join(","));
      });
    });

    return csvRows.join("\n");
  }

  const csvRows = [headers.map(escapeCsvValue).join(",")];

  data.forEach((row) => {
    const values = keys.map((key) => escapeCsvValue(row[key]));
    csvRows.push(values.join(","));
  });

  return csvRows.join("\n");
};

export const buildJsonContent = ({ data = [], groups }) => {
  const normalizedGroups = normalizeExportGroups(groups);

  if (normalizedGroups.length) {
    return JSON.stringify(
      {
        features: normalizedGroups.map((group) => ({
          featureIndex: group.featureIndex,
          featureLabel: group.featureLabel,
          compounds: group.compounds,
        })),
      },
      null,
      2
    );
  }

  return JSON.stringify(data, null, 2);
};

export const buildExcelContent = ({
  data = [],
  headers = [],
  keys = [],
  groups,
}) => {
  const normalizedGroups = normalizeExportGroups(groups);

  if (normalizedGroups.length) {
    const usedNames = new Set();
    const worksheets = normalizedGroups
      .map((group, index) => {
        const worksheetName = sanitizeWorksheetName(
          group.featureLabel,
          index,
          usedNames
        );
        const rows = buildSpreadsheetXmlRows(group.compounds, headers, keys);

        return `
          <Worksheet ss:Name="${escapeXml(worksheetName)}">
            <Table>${rows}</Table>
          </Worksheet>
        `;
      })
      .join("");

    return `<?xml version="1.0"?>
      <?mso-application progid="Excel.Sheet"?>
      <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
        xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:x="urn:schemas-microsoft-com:office:excel"
        xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
        ${worksheets}
      </Workbook>`;
  }

  const headerRow = headers
    .map((header) => `<th>${escapeHtml(header)}</th>`)
    .join("");
  const tableRows = buildTableRows(data, keys);

  return `
    <html>
      <head><meta charset="utf-8" /></head>
      <body>
        <table border="1">
          <thead><tr>${headerRow}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `;
};
