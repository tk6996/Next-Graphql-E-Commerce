import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useMutation } from "@apollo/react-hooks";
import Loading from "./Loading";
import { RESET_PASSWORD } from "../schema/mutation";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [resetPassword, { loading, error }] = useMutation(RESET_PASSWORD, {
    variables: { password, token: router?.query?.resetPasswordToken || "" },
    onCompleted: (data) => {
      if (data) {
        setMessage(data.resetPassword.message);
      }
    },
  });

  const handleChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setMessage("");
      await resetPassword();
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
          background-color: #03c;
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
        a {
          text-decoration: none;
          font-weight: bold;
          color: #03c;
        }
        a:hover {
          color: #fc3;
        }
      `}</style>
      <form onSubmit={handleSubmit}>
        <h1 style={{ textAlign: "center" }}>Reset Password</h1>
        <p style={{ color: "#03c", textAlign: "center" }}>
          Please Enter your new password below.
        </p>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
        />
        <button disabled={loading}>Submit</button>
      </form>
      {message && (
        <p style={{ color: "#33f", textAlign: "center" }}>
          {message}
          <br />
          <br />
          <Link href="/signin">
            <a>Back to Sign In Page.</a>
          </Link>
        </p>
      )}
      {error && (
        <p style={{ color: "#f33" }}>{error.graphQLErrors[0].message}</p>
      )}
      {loading && <Loading />}
    </div>
  );
};

export default ResetPasswordForm;
