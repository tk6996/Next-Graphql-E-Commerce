import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import Loading from "./Loading";
import { REQUEST_RESET_PASSWORD } from "../schema/mutation";

const RequestResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [requestResetPassword, { loading, error }] = useMutation(
    REQUEST_RESET_PASSWORD,
    {
      variables: { email },
      onCompleted: (data) => {
        if (data) {
          setMessage(data.requestResetPassword.message);
        }
      },
    }
  );

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log(email);
      setMessage("");
      await requestResetPassword();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "100px",
      }}
    >
      <style jsx>{`
        form {
          display: flex;
          flex-direction: column;
          width: 300px;
        }
        form > * {
          margin: 15px 0;
        }
        form > input {
          height: 30px;
          padding: 0 5px;
          font-size: 16px;
        }
        form > input:focus {
          outline-color: #00c;
        }
        form > button {
          height: 35px;
          background-color: #c00;
          color: #fff;
          border-radius: 5px;
          border: none;
          outline: none;
          cursor: pointer;
          font-weight: bold;
        }
        form > button:active {
          transform: scale(0.9, 0.9);
        }
      `}</style>
      <h1 style={{ textAlign: "center" }}>Request Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
        />
        <button disabled={loading}>Submit</button>
      </form>
      {message && <p style={{ color: "#33f" }}>{message}</p>}
      {error && (
        <p style={{ color: "#f33" }}>{error.graphQLErrors[0].message}</p>
      )}
      {loading && <Loading />}
    </div>
  );
};

export default RequestResetPasswordForm;
