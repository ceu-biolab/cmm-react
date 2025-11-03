import React from "react";

const FileDownload = ({ data, headers, keys, filename = "results.csv" }) => {
  const downloadCSV = () => {
    const csvRows = [];

    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = keys.map((key) => {
        let val = row[key] ?? "";
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
