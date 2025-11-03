import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { mz, intensity } = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #617475",
          padding: "8px",
          color: "#617475",
          borderRadius: "4px",
        }}
      >
        <div style={{ fontWeight: "bold", color: "#617475" }}>m/z: {mz}</div>
        <div style={{ color: "#879a9c" }}>
          Intensity: {(intensity * 100).toFixed(2)}%
        </div>
      </div>
    );
  }

  return null;
};

const SpectrumGraph = ({ peaks }) => {
  return (
    <div>
      <ComposedChart width={1200} height={400} data={peaks}>
        <CartesianGrid stroke="#ccc" />
        <XAxis
          dataKey="mz"
          stroke="#617475" 
          tick={{ fill: "#617475", fontSize: 12 }}
          label={{
            value: "m/z",
            position: "insideBottom",
            offset: -5,
            fill: "#617475",
          }}
        />
        <YAxis
          label={{ value: "Intensity", angle: -90, position: "insideLeft" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="intensity" fill="#FF0000" barSize={2} />
      </ComposedChart>
    </div>
  );
};

export default SpectrumGraph;
