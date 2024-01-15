import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import {
  faArrowCircleRight,
  faArrowRight,
  faArrowTurnRight,
  faArrowUpRightDots,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalContext } from "../../context";

const Register = () => {
  const { setIndex } = useGlobalContext();
  const navi = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const firstI = useRef(null);
  const lastI = useRef(null);
  const emailI = useRef(null);
  const passI = useRef(null);
  const firstP = useRef(null);
  const lastP = useRef(null);
  const emailP = useRef(null);
  const passP = useRef(null);
  const firstC = useRef(null);
  const lastC = useRef(null);
  const emailC = useRef(null);
  const passC = useRef(null);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (errorMessage != null) {
      if (errorMessage == "VALID") {
        firstP.current.innerText = "";
        firstI.current.className = "icon fas fa-check-circle";
        firstC.current.style.borderColor = "green";
        lastP.current.innerText = "";
        lastI.current.className = "icon fas fa-check-circle";
        lastC.current.style.borderColor = "green";
        emailC.current.style.borderColor = "green";
        emailP.current.style.display = "none";
        emailI.current.className = "icon fas fa-check-circle";
        passC.current.style.borderColor = "green";
        passP.current.style.display = "inline-block";
        passP.current.style.color = "green";
        passP.current.className = "success";
        passI.current.className = "icon fas fa-check-circle";
        passP.current.innerText = "Account created! Redirecting..";
      } else {
        if (errorMessage != "F_BLANK") {
          firstP.current.innerText = "";
          firstP.current.style.display = "none";
          firstI.current.className = "icon fas fa-check-circle";
          firstC.current.style.borderColor = "green";
          if (errorMessage != "L_BLANK") {
            lastP.current.innerText = "";
            lastP.current.style.display = "none";
            lastI.current.className = "icon fas fa-check-circle";
            lastC.current.style.borderColor = "green";
            if (errorMessage != "E_BLANK") {
              if (errorMessage != "E_EXISTS") {
                if (errorMessage != "E_INVALID") {
                  emailC.current.style.borderColor = "green";
                  emailP.current.style.display = "none";
                  emailI.current.className = "icon fas fa-check-circle";
                  if (errorMessage != "P_BLANK") {
                    if (errorMessage != "P_LENGTH") {
                      passC.current.style.borderColor = "green";
                      passP.current.style.display = "none";

                      passI.current.className = "icon fas fa-check-circle";
                    } else {
                      passC.current.style.borderColor = "red";
                      passP.current.style.display = "inline-block";
                      passP.current.innerText =
                        "Length must be greater then 3..";
                      passI.current.className =
                        "iconE fas fa-exclamation-circle";
                    }
                  } else {
                    passC.current.style.borderColor = "red";
                    passP.current.style.display = "inline-block";
                    passP.current.innerText = "Password cannot be blank..";
                    passI.current.className = "iconE fas fa-exclamation-circle";
                  }
                } else {
                  emailC.current.style.borderColor = "red";
                  emailP.current.style.display = "inline-block";
                  emailP.current.innerText = "Invalid email address..";
                  emailI.current.className = "iconE fas fa-exclamation-circle";
                }
              } else {
                emailC.current.style.borderColor = "red";
                emailP.current.style.display = "inline-block";
                emailP.current.innerText =
                  "Account with email already exists..";
                emailI.current.className = "iconE fas fa-exclamation-circle";
              }
            } else {
              emailC.current.style.borderColor = "red";
              emailP.current.style.display = "inline-block";
              emailP.current.innerText = "Email is required";
              emailI.current.className = "iconE fas fa-exclamation-circle";
            }
          } else {
            lastC.current.style.borderColor = "red";
            lastP.current.style.display = "inline-block";
            lastP.current.innerText = "min length of 1";
            lastI.current.className = "iconE fas fa-exclamation-circle";
          }
        } else {
          firstC.current.style.borderColor = "red";
          firstP.current.style.display = "inline-block";
          firstP.current.innerText = "min length of 1";
          firstI.current.className = "iconD fas fa-exclamation-circle";
        }
      }
    }
  }, [errorMessage]);

  useEffect(() => {
    setIndex(2);
  });

  const post = () => {
    fetch(`${process.env.REACT_APP_API_URL}/register`, {
      body: JSON.stringify(user),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.registered) {
          setErrorMessage("VALID");
          setTimeout(() => {
            navi("/login");
          }, 1700);
        } else {
          setErrorMessage(res.message);
        }
        console.log(res);
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
  return (
    <>
      <div className="container">
        <div>
          <div className="Register">
            <div className="page">
              <div className="leftside">
                <div>
                  <h4 style={{ marginLeft: "5px" }}>
                    <FontAwesomeIcon icon={faArrowUpRightDots} />
                    &nbsp;&nbsp;Join the community and start your{" "}
                    <span>picto journey today...</span>
                  </h4>
                  <ul>
                    <li>
                      <FontAwesomeIcon icon={faArrowRight} /> Share pictures
                      with friends and family
                    </li>
                    <li>
                      {" "}
                      <FontAwesomeIcon icon={faArrowRight} /> Journal your
                      favorite food adventures.
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faArrowRight} /> Keep up with the
                      new and hot trends on the <span>explore page</span>.
                    </li>{" "}
                    <li>
                      <FontAwesomeIcon icon={faArrowRight} /> Interact on and
                      share pictures with friends and family.
                    </li>{" "}
                  </ul>
                </div>
              </div>
              <div>
                <div style={{}}>
                  <h2
                    style={{
                      marginLeft: "92px",
                    }}
                  >
                    Register now!
                  </h2>
                </div>
                <div className="RegisterForm">
                  <div className="inputs">
                    <label htmlFor="">First Name</label>
                    <input
                      ref={firstC}
                      onChange={(e) => {
                        inputChange(e);
                      }}
                      name="firstName"
                      value={user.firstName}
                      type="text"
                    />
                    <div>
                      <p ref={firstP} className="pl-12 error">
                        Error
                      </p>
                    </div>
                    <i ref={firstI} className=""></i>
                    <label htmlFor="">Last Name</label>
                    <input
                      ref={lastC}
                      onChange={(e) => {
                        inputChange(e);
                      }}
                      name="lastName"
                      value={user.lastName}
                      type="text"
                    />

                    <i ref={lastI} className=""></i>
                    <div>
                      <p ref={lastP} className="pl-12 error">
                        Error
                      </p>
                    </div>
                    <label htmlFor="">Email</label>
                    <input
                      ref={emailC}
                      onChange={(e) => {
                        inputChange(e);
                      }}
                      name="email"
                      value={user.email}
                      type="text"
                    />
                    <i ref={emailI} className=""></i>
                    <div>
                      <p ref={emailP} className="pl-12 error">
                        Error
                      </p>
                    </div>
                    <label htmlFor="">Password</label>
                    <input
                      ref={passC}
                      onChange={(e) => {
                        inputChange(e);
                      }}
                      name="password"
                      value={user.password}
                      type="password"
                    />
                    <i ref={passI} className=""></i>
                    <div>
                      <p ref={passP} className="pl-12 error">
                        Error
                      </p>
                    </div>
                    <div className="btn">
                      <button onClick={post}>Sign up</button>
                      <h4 style={{ paddingBottom: "10px" }}>
                        By clicking “Sign up”, you agree to our{" "}
                        <span>terms of service</span>,{" "}
                        <span>privacy policy</span> and
                        <span> cookie policy</span>
                      </h4>
                    </div>
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

export default Register;
