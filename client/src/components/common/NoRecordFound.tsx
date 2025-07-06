import React from "react";


interface NoRecordFoundProps {
  message?: string;
}

const NoRecordFound: React.FC<NoRecordFoundProps> = ({ message = "No record found" }) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <p style={{ textAlign: "center" }}>{message}</p>
    </div>
  );
};

export default NoRecordFound;