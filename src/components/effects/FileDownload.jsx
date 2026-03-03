import React from "react";

const FileDownload = ({ data, headers, keys, filename = "results.csv" }) => {
  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const serializeValue = (value) => {
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

  const downloadCSV = () => {
    const csvRows = [];

    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = keys.map((key) => {
        let val = serializeValue(row[key]);
        if (typeof val === "string") {
          val = `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      csvRows.push(values.join(","));
    }

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, filename);
  };

  const downloadJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    triggerDownload(blob, filename.replace(/\.csv$/, ".json"));
  };

  const downloadExcel = () => {
    const tableRows = data
      .map((row) => {
        const cells = keys
          .map(
            (key) => `<td>${escapeHtml(serializeValue(row[key]))}</td>`
          )
          .join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");

    const headerRow = headers
      .map((header) => `<th>${escapeHtml(header)}</th>`)
      .join("");

    const htmlContent = `
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

    const blob = new Blob([htmlContent], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    triggerDownload(blob, filename.replace(/\.csv$/, ".xls"));
  };

  const triggerDownload = (blob, name) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="download-buttons">
      <button
        type="button"
        onClick={downloadCSV}
        className="button-download"
        title="Download CSV"
      >
        Download Compounds CSV
      </button>

      <button
        type="button"
        onClick={downloadExcel}
        className="button-download"
        title="Download Excel"
      >
        Download Compounds Excel
      </button>

      <button
        type="button"
        onClick={downloadJSON}
        className="button-download"
        title="Download JSON"
      >
        Download Compounds JSON
      </button>
    </div>
  );
};

export default FileDownload;
