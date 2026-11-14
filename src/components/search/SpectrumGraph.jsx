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
          border: "none",
          padding: "8px",
          color: "#626277",
          borderRadius: "4px",
        }}
      >
        <div style={{ fontWeight: "bold", color: "#626277" }}>m/z: {mz}</div>
        <div style={{ color: "#8d86b7" }}>
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
      <ComposedChart width={1400} height={400} data={peaks}>
        <CartesianGrid stroke="#ccc" />
        <XAxis
          dataKey="mz"
          stroke="#626277"
          tick={{ fill: "#626277", fontSize: 12 }}
          label={{
            value: "m/z",
            position: "insideBottom",
            offset: -5,
            fill: "#626277",
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
