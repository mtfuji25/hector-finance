import React, { VFC } from "react";
interface ProgressBar {
  bgcolor: string;
  completed: number;
}

function ProgressBar({ bgcolor, completed }: ProgressBar) {
  const containerStyles = {
    height: 15,
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: 50,
  };

  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
    transition: "width 1s ease-in-out",
    textAlign: "right" as "right",
  };

  const labelStyles = {
    padding: "0 5px",
    color: "black",
    fontWeight: "bold",
    height: "100%",
    display: "grid",
    alignItems: "center" as "center",
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <div style={labelStyles}>{`${completed}%`}</div>
      </div>
    </div>
  );
}

export default ProgressBar;
