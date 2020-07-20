import React from "react";

const Loading = () => {
  return (
    <div
      style={{
        position: "fixed",
        backgroundColor: "#9999",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
      }}
    >
      <style jsx>{`
        .loader {
          border: 16px solid #f3f3f3;
          border-top: 16px solid #777777;
          border-radius: 50%;
          width: 100px;
          height: 100px;
          animation: spin 2s linear infinite;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -50px;
          margin-left: -50px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
