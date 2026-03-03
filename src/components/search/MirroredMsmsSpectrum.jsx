import { useState } from "react";

const normalizePeaks = (peaks) => {
  if (!Array.isArray(peaks) || peaks.length === 0) {
    return [];
  }

  const maxIntensity = peaks.reduce((max, peak) => {
    const intensity = Number(peak?.intensity) || 0;
    return Math.max(max, intensity);
  }, 0);

  if (!maxIntensity) {
    return peaks.map((peak) => ({
      mz: peak?.mz,
      intensity: 0,
    }));
  }

  return peaks.map((peak) => ({
    mz: peak?.mz,
    intensity: ((Number(peak?.intensity) || 0) / maxIntensity) * 100,
  }));
};

const MirroredMsmsSpectrum = ({
  experimentalPeaks,
  compoundPeaks,
  title,
}) => {
  const [tooltip, setTooltip] = useState(null);
  const normalizedExperimental = normalizePeaks(experimentalPeaks);
  const normalizedCompound = normalizePeaks(compoundPeaks);

  if (!normalizedExperimental.length && !normalizedCompound.length) {
    return <div>No spectrum data available.</div>;
  }

  const width = 1150;
  const height = 600;
  const yCenter = height / 2;
  const padding = 50;

  const allMz = [
    ...normalizedExperimental.map((p) => p.mz),
    ...normalizedCompound.map((p) => p.mz),
  ].filter((mz) => Number.isFinite(mz));

  if (!allMz.length) {
    return <div>No spectrum data available.</div>;
  }

  const basePeak = normalizedExperimental.reduce((max, peak) => {
    if (!max || peak.intensity > max.intensity) {
      return peak;
    }
    return max;
  }, null);

  const minMz = Math.min(...allMz);
  const maxMz = Math.max(...allMz);
  const centerMz = basePeak?.mz ?? (minMz + maxMz) / 2;
  const displayRange = maxMz - minMz || 1;

  const scaleX = (mz) =>
    ((mz - (centerMz - displayRange / 2)) / displayRange) *
      (width - 2 * padding) +
    padding;

  const scaleY = (val) => (val / 100) * (height / 2 - padding);

  return (
    <div className="graph-div">
      {title && <h3>{title}</h3>}
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
          <line
            x1={padding}
            x2={width - padding}
            y1={yCenter}
            y2={yCenter}
            stroke="#000"
          />

          {Array.from({ length: 6 }, (_, i) => i * 20).map((tick) => {
            const yTop = yCenter - scaleY(tick);
            const yBottom = yCenter + scaleY(tick);
            return (
              <g key={tick}>
                <line
                  x1={padding}
                  x2={width - padding}
                  y1={yTop}
                  y2={yTop}
                  stroke="#ccc"
                  strokeDasharray="3,3"
                />
                {tick > 0 && (
                  <line
                    x1={padding}
                    x2={width - padding}
                    y1={yBottom}
                    y2={yBottom}
                    stroke="#ccc"
                    strokeDasharray="3,3"
                  />
                )}
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

          {normalizedExperimental.map((peak, idx) => {
            const x = scaleX(peak.mz);
            const y = yCenter - scaleY(peak.intensity);
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
                    mz: peak.mz,
                    intensity: peak.intensity,
                    type: "Experimental",
                    x,
                    y,
                  })
                }
              />
            );
          })}

          {normalizedCompound.map((peak, idx) => {
            const x = scaleX(peak.mz);
            const y = yCenter + scaleY(peak.intensity);
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
                    mz: peak.mz,
                    intensity: peak.intensity,
                    type: "Compound",
                    x,
                    y,
                  })
                }
              />
            );
          })}

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
                m/z: {tooltip.mz?.toFixed(2)}
              </text>
              <text
                x={tooltip.x + 15}
                y={tooltip.y + 5}
                fill="#617475"
                fontSize={12}
              >
                Intensity: {tooltip.intensity?.toFixed(2)}
              </text>
            </g>
          )}

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

export default MirroredMsmsSpectrum;
