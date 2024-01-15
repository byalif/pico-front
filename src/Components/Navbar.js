import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalContext } from "../context";

const Navbar = () => {
  const nav = useNavigate();
  const { setIndex, index, loggedIn, setLoggedIn } = useGlobalContext();

  useEffect(() => {
    setLoggedIn(localStorage.getItem("loggedIn"));
  }, [localStorage.getItem("loggedIn")]);
  return (
    <div className="ol">
      <div className="color">
        <div className="container">
          <div className="Navbar">
            <div className="left">
              <Link
                onClick={() => {
                  setIndex(0);
                }}
                className={`${index == 0 && "picked"}`}
                to="/"
              >
                <FontAwesomeIcon
                  style={{ marginRight: "8px" }}
                  icon={faHome}
                ></FontAwesomeIcon>{" "}
                Home
              </Link>
            </div>
            <div className="right">
              {!localStorage.getItem("username") ? (
                <div>
                  <Link
                    onClick={() => {
                      setIndex(1);
                    }}
                    className={`${index == 1 && "picked"}`}
                    to="/login"
                  >
                    Login
                  </Link>
                  <a
                    onClick={() => {
                      setIndex(2);
                    }}
                    className={`${index == 2 && "picked"}`}
                    href="/register"
                  >
                    Register
                  </a>
                </div>
              ) : (
                <div>
                  <Link
                    onClick={() => {
                      setIndex(1);
                    }}
                    className={`${index == 1 && "picked"}`}
                    to="/upload"
                  >
                    Upload
                  </Link>
                  <a
                    href={`/${localStorage.getItem("username")}`}
                    className={`${index == 2 && "picked"}`}
                  >
                    Profile
                  </a>
                  <a
                    href="/login"
                    className={`${index == 3 && "picked"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setIndex(0);
                      setLoggedIn(false);
                      localStorage.removeItem("username");
                      localStorage.setItem("loggedIn", false);
                      window.location.reload();
                    }}
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
