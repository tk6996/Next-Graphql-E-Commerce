import React, { useContext } from "react";
import { AuthContext } from "../appState/AuthProvider";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <div>
        <div style={{ textAlign: "center", fontSize: "3em" }}>
          Welcome to Tea Shop.
        </div>
        {user && (
          <div style={{ textAlign: "center", fontSize: "2em" }}>
            {user.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
