import React from "react";

const ProgressRing = ({ matched, total, size = 60, strokeWidth = 2, color = "#00acc1", bgColor = "#eee" }) => {
  const percentage = total > 0 ? (matched / total) * 100 : 0;

  return (
    <div className="progress-ring-container">
      <svg width={size} height={size} viewBox="0 0 36 36" className="circular-chart">
        <path
          className="circle-bg"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <path
          className="circle"
          strokeDasharray={`${percentage}, 100`}
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <text
          x="18"
          y="20.35"
          className="percentage-text"
          textAnchor="middle"
        >
          {matched}/{total}
        </text>
      </svg>
    </div>
  );
};

export default ProgressRing;