import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
import Router from "next/router";
import Cookies from "js-cookie";
import Loading from "./Loading";
import { AuthContext } from "../appState/AuthProvider";
import Link from "next/link";
import { LOG_IN } from "../schema/mutation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SignInForm = () => {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const { setAuthUser } = useContext(AuthContext);

  const [login, { loading, error }] = useMutation(LOG_IN, {
    variables: { ...userInfo },
    onCompleted: (data) => {
      if (data) {
        setAuthUser(data.login.user);
        Cookies.set("jwt", data.login.jwt);
        setUserInfo({ email: "", password: "" });
        Router.push("/products");
      }
    },
  });

  const handleChange = (e) =>
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await login();
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
        button {
          height: 35px;
          color: #fff;
          border-radius: 5px;
          border: none;
          outline: none;
          cursor: pointer;
          font-weight: bold;
        }
        button:active {
          transform: scale(0.9, 0.9);
        }
        form > button {
          background-color: #0c0;
        }
        a {
          text-decoration: none;
          font-weight: bold;
          color: #f33;
        }
        a:hover {
          color: #0cc;
        }
      `}</style>
      <form onSubmit={handleSubmit}>
        <h1 style={{ textAlign: "center" }}>Sign In Form</h1>
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
      {error && (
        <p style={{ color: "#f33" }}>{error.graphQLErrors[0].message}</p>
      )}
      <p style={{ color: "#f93" }}>
        Forgot Password ?{" "}
        <Link href="/signin/requestresetpassword">
          <a>Click Here!</a>
        </Link>
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          margin: "20px auto",
        }}
      >
        <button
          style={{
            margin: "10px auto",
            backgroundColor: "#4267b2",
            width: "300px",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          onClick={() => {
            window.location.href = "http://localhost:4000/auth/facebook";
          }}
        >
          <FontAwesomeIcon
            icon={["fab", "facebook-f"]}
            style={{ height: "20px" }}
          />
          <div style={{ width: "144px", textAlign: "left" }}>
            Sign In With Facebook
          </div>
        </button>
        <button
          style={{
            margin: "10px auto",
            backgroundColor: "#ea4335",
            width: "300px",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          onClick={() => {
            window.location.href = "http://localhost:4000/auth/google";
          }}
        >
          <FontAwesomeIcon
            icon={["fab", "google"]}
            style={{
              height: "20px",
            }}
          />
          <div style={{ width: "144px", textAlign: "left" }}>
            Sign In With Google
          </div>
        </button>
      </div>

      {loading && <Loading />}
    </div>
  );
};

export default SignInForm;
