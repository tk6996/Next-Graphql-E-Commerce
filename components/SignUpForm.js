import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import Link from "next/link";
import Loading from "./Loading";
import { SIGN_UP } from "../schema/mutation";

const SignUpForm = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState(false);

  const [signup, { loading, error }] = useMutation(SIGN_UP, {
    variables: { ...userInfo },
    onCompleted: (data) => {
      if (data) {
        setSuccess(true);
        setUserInfo({ name: "", email: "", password: "" });
      }
    },
  });

  const handleChange = (e) =>
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setSuccess(false);
      await signup();
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
          background-color: #0cc;
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
          color: #070;
        }
        a:hover {
          color: #f8f;
        }
      `}</style>
      <form onSubmit={handleSubmit}>
        <h1 style={{ textAlign: "center" }}>Sign Up Form</h1>
        <input
          type="text"
          name="name"
          placeholder="Username"
          value={userInfo.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userInfo.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userInfo.password}
          onChange={handleChange}
        />
        <button disabled={loading}>Submit</button>
      </form>
      {success && (
        <div style={{ color: "#0a0", marginTop: "15px" }}>
          You Successfully{" "}
          <Link href="/signin">
            <a>signed up</a>
          </Link>
          , please
        </div>
      )}
      {error && (
        <p style={{ color: "#f33" }}>{error.graphQLErrors[0].message}</p>
      )}
      {loading && <Loading />}
    </div>
  );
};

export default SignUpForm;
