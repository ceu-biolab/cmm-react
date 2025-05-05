const ManualPDF = () => {
  return (
    <div style={{ height: "80vh", backgroundColor: "#f1f7f9", padding: "1rem", borderRadius: "10px" }}>
      <iframe
        src="/CMM_manual_version_3.0.pdf"
        width="100%"
        height="100%"
        title="User Manual"
        style={{ border: "1px solid #ccc", borderRadius: "8px" }}
      />
    </div>
  );
};

export default ManualPDF;
