import { useState } from "react";

const MirroredSpectrum = ({ data }) => {
  const [selectedCompoundIndex, setSelectedCompoundIndex] = useState(0);

  const feature = data?.gcmsFeatures?.[0];
  if (!feature) return <div>No GCMS features available.</div>;

  const experimentalPeaks =
    feature.gcmsSpectrumExperimental?.spectrum?.map(
      ({ mzValue, intensity }) => ({
        mz: mzValue,
        intensity,
      })
    ) || [];

  const compounds = feature.gcmsAnnotations || [];
  const selectedCompound = compounds[selectedCompoundIndex];

  const compoundPeaks =
    selectedCompound?.gcmsCompound?.gcmsspectrum?.[0]?.spectrum?.map(
      ({ mzValue, intensity }) => ({ mz: mzValue, intensity }) // mirrored later
    ) || [];

  if (!experimentalPeaks.length && !compoundPeaks.length)
    return <div>No spectrum data available.</div>;

  const width = 1150;
  const height = 600;
  const yCenter = height / 2;
  const padding = 50;

  const allMz = [
    ...experimentalPeaks.map((p) => p.mz),
    ...compoundPeaks.map((p) => p.mz),
  ];

  const basePeak = experimentalPeaks.find((p) => p.intensity === 100);

  const centerMz = basePeak
    ? basePeak.mz
    : (Math.min(...allMz) + Math.max(...allMz)) / 2;

  const mzRange = Math.max(...allMz) - Math.min(...allMz);
  const displayRange = mzRange;

  const minMz = centerMz - displayRange / 2;
  const maxMz = centerMz + displayRange / 2;

  const scaleX = (mz) =>
    ((mz - minMz) / (maxMz - minMz)) * (width - 2 * padding) + padding;

  const scaleY = (val) => (val / 100) * (height / 2 - padding);

  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="graph-div">
      <label className="compound-select-label">
        <select
          className="compound-select"
          value={selectedCompoundIndex}
          onChange={(e) => setSelectedCompoundIndex(Number(e.target.value))}
        >
          {compounds.map((c, idx) => (
            <option key={idx} value={idx}>
              {c.gcmsCompound?.compoundName || `Compound ${idx + 1}`}
            </option>
          ))}
        </select>
      </label>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "20px",
          marginBottom: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        }}
      >
        <svg
          width={width}
          height={height}
          style={{
            border: "none",
            marginTop: "20px",
          }}
          onMouseLeave={() => setTooltip(null)}
        >
          {/* X-axis (center line) */}
          <line
            x1={padding}
            x2={width - padding}
            y1={yCenter}
            y2={yCenter}
            stroke="#000"
          />

          {/* 🆕 Y-axis gridlines and labels */}
          {Array.from({ length: 6 }, (_, i) => i * 20).map((tick) => {
            const yTop = yCenter - scaleY(tick);
            const yBottom = yCenter + scaleY(tick);
            return (
              <g key={tick}>
                {/* Top gridline */}
                <line
                  x1={padding}
                  x2={width - padding}
                  y1={yTop}
                  y2={yTop}
                  stroke="#ccc"
                  strokeDasharray="3,3"
                />
                {/* Bottom gridline */}
                {tick > 0 && ( // avoid duplicating the center line
                  <line
                    x1={padding}
                    x2={width - padding}
                    y1={yBottom}
                    y2={yBottom}
                    stroke="#ccc"
                    strokeDasharray="3,3"
                  />
                )}
                {/* Labels on left side */}
                <text
                  x={padding - 10}
                  y={yTop + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#555"
                >
                  {tick}
                </text>
                {tick > 0 && (
                  <text
                    x={padding - 10}
                    y={yBottom + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#555"
                  >
                    {tick}
                  </text>
                )}
              </g>
            );
          })}

          {/* Experimental peaks */}
          {experimentalPeaks.map((p, idx) => {
            const x = scaleX(p.mz);
            const y = yCenter - scaleY(p.intensity);
            return (
              <line
                key={`exp-${idx}`}
                x1={x}
                x2={x}
                y1={yCenter}
                y2={y}
                stroke="#0074D9"
                strokeWidth={2}
                onMouseEnter={() =>
                  setTooltip({
                    mz: p.mz,
                    intensity: p.intensity,
                    type: "Experimental",
                    x,
                    y,
                  })
                }
              />
            );
          })}

          {/* Compound peaks */}
          {compoundPeaks.map((p, idx) => {
            const x = scaleX(p.mz);
            const y = yCenter + scaleY(p.intensity);
            return (
              <line
                key={`cmp-${idx}`}
                x1={x}
                x2={x}
                y1={yCenter}
                y2={y}
                stroke="#FF4136"
                strokeWidth={2}
                onMouseEnter={() =>
                  setTooltip({
                    mz: p.mz,
                    intensity: p.intensity,
                    type: "Compound",
                    x,
                    y,
                  })
                }
              />
            );
          })}

          {/* Tooltip */}
          {tooltip && (
            <g>
              <rect
                x={tooltip.x + 10}
                y={tooltip.y - 40}
                width={120}
                height={50}
                fill="white"
                stroke="#617475"
                rx={4}
              />
              <text
                x={tooltip.x + 15}
                y={tooltip.y - 25}
                fill="#617475"
                fontSize={12}
              >
                {tooltip.type}
              </text>
              <text
                x={tooltip.x + 15}
                y={tooltip.y - 10}
                fill="#617475"
                fontSize={12}
              >
                m/z: {tooltip.mz.toFixed(2)}
              </text>
              <text
                x={tooltip.x + 15}
                y={tooltip.y + 5}
                fill="#617475"
                fontSize={12}
              >
                Intensity: {tooltip.intensity.toFixed(2)}
              </text>
            </g>
          )}

          {/* Axis labels */}
          <text
            x={width / 2}
            y={height - 5}
            textAnchor="middle"
            fontSize="12"
            fill="#333"
          >
            m/z
          </text>
          <text
            x={padding / 3}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90 ${padding / 3} ${height / 2})`}
            fontSize="12"
            fill="#333"
          >
            Intensity
          </text>
        </svg>
      </div>
    </div>
  );
};

export default MirroredSpectrum;
