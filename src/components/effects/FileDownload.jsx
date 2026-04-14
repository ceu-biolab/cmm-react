import React from "react";
import {
  buildCsvContent,
  buildExcelContent,
  buildJsonContent,
  normalizeExportGroups,
} from "../../utils/fileDownloadExport";

const FileDownload = ({
  data,
  headers,
  keys,
  filename = "results.csv",
  groups,
}) => {
  const normalizedGroups = normalizeExportGroups(groups);
  const exportGroups = normalizedGroups.length ? normalizedGroups : null;

  const triggerDownload = (blob, name) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const csvContent = buildCsvContent({
      data,
      headers,
      keys,
      groups: exportGroups,
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, filename);
  };

  const downloadJSON = () => {
    const jsonContent = buildJsonContent({
      data,
      groups: exportGroups,
    });
    const blob = new Blob([jsonContent], { type: "application/json" });
    triggerDownload(blob, filename.replace(/\.csv$/, ".json"));
  };

  const downloadExcel = () => {
    const excelContent = buildExcelContent({
      data,
      headers,
      keys,
      groups: exportGroups,
    });
    const blob = new Blob([excelContent], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    triggerDownload(blob, filename.replace(/\.csv$/, ".xls"));
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
