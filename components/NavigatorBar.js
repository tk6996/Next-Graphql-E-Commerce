import React, { useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import { AuthContext } from "../appState/AuthProvider";
import { ME } from "../schema/query";

const NavigatorBar = () => {
  const router = useRouter();
  const { user, signout, setAuthUser } = useContext(AuthContext);
  const { data } = useQuery(ME);

  const activeStyle = {
    background: "#eee",
    color: "#333",
    boxShadow: "none",
    fontSize: "x-large",
  };

  useEffect(() => {
    let prevScrollpos = 0;
    window.onscroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        document.getElementById("nav-bar").style.top = "0";
      } else {
        document.getElementById("nav-bar").style.top = "-60px";
      }
      prevScrollpos = currentScrollPos;
    };
  }, []);

  useEffect(() => {
    if (data) setAuthUser(data.user);
  }, [data]);

  return (
    <>
      <style jsx>{`
        nav {
          display: flex;
          background-color: #333;
          justify-content: center;
          box-shadow: 0 0 2px 0px #3333;
          position: sticky;
          top: 0;
          transition: top 0.3s;
        }
        ul {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 1200px;
          padding: 0;
        }
        ul > li {
          list-style: none;
          text-align: center;
          vertical-align: bottom;
          height: 60px;
          flex: 1;
          display: flex;
        }
        ul > li > a {
          text-decoration: none;
          padding: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          color: #fff;
          font-weight: bold;
          font-size: larger;
        }
        ul > li > a:hover {
          color: #000;
          background-color: #ccc;
          box-shadow: 0 0 5px 3px #ccc7;
        }
      `}</style>
      <nav id="nav-bar">
        <ul>
          <li>
            <Link href="/">
              <a style={router.pathname.match(/^\/$/) && activeStyle}>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/products">
              <a style={router.pathname.match(/^\/products/) && activeStyle}>
                Products
              </a>
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link href="/cart">
                  <a style={router.pathname.match(/^\/cart$/) && activeStyle}>
                    Cart [
                    {user?.carts?.length
                      ? user.carts.reduce((sum, cart) => sum + cart.quantity, 0)
                      : 0}
                    ]
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/manageproduct">
                  <a
                    style={
                      router.pathname.match(/^\/manageproduct$/) && activeStyle
                    }
                  >
                    Manage Product
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a onClick={signout}>Sign Out</a>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/signin">
                  <a style={router.pathname.match(/^\/signin/) && activeStyle}>
                    Sign In
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/signup">
                  <a style={router.pathname.match(/^\/signup$/) && activeStyle}>
                    Sign Up
                  </a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
};

export default NavigatorBar;
