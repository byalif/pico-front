import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context";
import "./Login.css";

const Login = () => {
  const { index, setIndex, loggedIn, setLoggedIn, you, setYou } =
    useGlobalContext();
  const nav = useNavigate();
  const em = useRef(null);
  const pass = useRef(null);
  const err = useRef(null);
  const emI = useRef(null);
  const passI = useRef(null);
  const [loading, setLoading] = useState(true);
  const [erreMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setIndex(1);
  });
  const login = () => {
    fetch(`${process.env.REACT_APP_API_URL}/login`, {
      body: JSON.stringify(user),
      method: "POST",
      headers: { "Content-Type": "Application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setLoading(false);
        if (res.loggedin) {
          setIndex(0);
          em.current.style.borderColor = "green";
          pass.current.style.borderColor = "green";
          emI.current.className = "iconsD green fas fa-check-circle";
          passI.current.className = "iconsDf green fas fa-check-circle";
          setTimeout(() => {
            nav("/");
          }, 500);
          setLoggedIn(true);
          setYou(localStorage.getItem("username"));
          localStorage.setItem("loggedIn", true);
          localStorage.setItem("username", res.email);
          console.log(res);
        } else {
          console.log(res);
          setErrorMessage(res.message);
          if (res.message == "NOT_FOUND") {
            em.current.style.borderColor = "red";
            pass.current.style.borderColor = "red";
            emI.current.className = "iconsD red fas fa-exclamation-circle";
            passI.current.className = "iconsDf red fas fa-exclamation-circle";
            // firstI.current.className =
            //   "iconD fas fa-exclamation-circle";
          }
        }
      });
  };
  const inputChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setUser({
      ...user,
      [e.target.name]: value,
    });
  };

  const signup = () => {
    nav("/register");
  };
  return (
    <>
      <div className="idk">
        <div className="container">
          <div>
            <div className="Registerr">
              <div className="page">
                <div>
                  <div style={{}}>
                    <h2
                      style={{
                        marginLeft: "120px",
                      }}
                    >
                      Log in
                    </h2>
                  </div>
                  <div className="Login">
                    <div className="inputs">
                      <label htmlFor="">Email</label>
                      <i ref={emI} className=""></i>
                      <input
                        ref={em}
                        onChange={(e) => {
                          inputChange(e);
                        }}
                        name="email"
                        value={user.email}
                        type="text"
                      />
                      <label htmlFor="">Password</label>
                      <i ref={passI} className=""></i>
                      <input
                        ref={pass}
                        onChange={(e) => {
                          inputChange(e);
                        }}
                        name="password"
                        value={user.password}
                        type="password"
                      />
                    </div>
                    <div className="btn">
                      <button onClick={login}>Log in</button>
                    </div>
                  </div>
                  <div className="low">
                    <h4
                      style={{
                        textAlign: "center",
                        maxWidth: "300px",
                      }}
                    >
                      Don’t have an account?{" "}
                      <span onClick={signup} className="signup">
                        Sign up
                      </span>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
