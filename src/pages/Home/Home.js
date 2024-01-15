import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../../context";
import Elipsis from "./Elipsis";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

import {
  faEllipsis,
  faHeart,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Comments from "../Comments/Comments";
// import "./Home.css";

const Home = () => {
  const { you, setYou } = useGlobalContext();
  const nav = useNavigate();
  const [newComment, setComment] = useState({
    comment: [],
    email: localStorage.getItem("username"),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isComLoading, setIsComLoading] = useState(true);
  const [isLikeLoading, setIsLikeLoading] = useState(true);
  const { setIndex, loggedIn, setLoggedIn } = useGlobalContext();
  const [user, setUser] = useState([]);
  let thisone = false;
  const [post, setPost] = useState([]);
  const [elipsis, setElipsis] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [valid, setValid] = useState(false);
  let temped = [];
  let temped2 = [];

  useEffect(() => {
    setYou(localStorage.getItem("username"));
    setIsLikeLoading(true);
    if (localStorage.getItem("loggedIn")) {
      fetchImages();
      setLoggedIn(true);
      setUser(localStorage.getItem("username"));
    } else {
      localStorage.setItem("loggedIn", false);
    }
  }, []);

  const cld = new Cloudinary({
    cloud: {
      cloudName: "dcchunhwy",
    },
  });
  useEffect(() => {
    setIndex(0);
    fetchImages();
  }, []);

  const fetchImages = () => {
    fetch(`${process.env.REACT_APP_API_URL}/posts`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        setPost(res.reverse());
        temped = [];
        temped2 = [];
        res.forEach((x, i) => {
          let count = 0;
          if (x.likes.length == 0) {
            temped.push({ ...x, isLiked: false });
            count++;
          }
          x.likes.forEach((y, b) => {
            if (count == 0 && y.email == localStorage.getItem("username")) {
              temped.push({ ...x, isLiked: true });
              count++;
            } else if (count == 0 && b == x.likes.length - 1) {
              count++;
              temped.push({ ...x, isLiked: false });
            }
          });
          if (i == res.length - 1) {
            setPost(temped);
            // console.log(temped);
            temped.forEach((c, j) => {
              let count2 = 0;
              if (c.user.followers.length == 0) {
                temped2.push({ ...c, isFollowed: false });
              }
              c.user.followers.forEach((n, k) => {
                if (
                  count2 == 0 &&
                  n.email == localStorage.getItem("username")
                ) {
                  temped2.push({ ...c, isFollowed: true });
                  count2++;
                } else if (k == c.user.followers.length - 1) {
                  count2++;
                  temped2.push({ ...c, isFollowed: false });
                }
              });
              if (j == temped.length - 1) {
                setPost(temped2);
                console.log(temped2);
              }
            });
          }
        });
      })
      .then(() => {
        setIsLikeLoading(false);
        setIsComLoading(false);
        setIsLoading(false);
      });
  };

  const fetchLikes = () => {
    fetch(`${process.env.REACT_APP_API_URL}/posts`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        setPost(res.reverse());
      })
      .then(() => {});
  };

  const likeIt = (postId) => {
    fetch(`${process.env.REACT_APP_API_URL}/like/${postId}`, {
      method: "PUT",
      body: JSON.stringify({ email: newComment.email }),
      headers: { "Content-Type": "Application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.status == "ACCEPTED") {
          fetchLikes();
        }
        if (res.status == "BAD_REQUEST") {
          fetch(`${process.env.REACT_APP_API_URL}/unlike/${postId}`, {
            method: "PUT",
            body: JSON.stringify({
              email: newComment.email,
            }),
            headers: { "Content-Type": "Application/json" },
          })
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              console.log(res);
              if (res.message == "UNLIKED") {
                fetchLikes();
                // setLikes(likes - 1);
              }
            });
        }
        fetchLikes();
      });
  };

  const deleteIt = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        if (res.status == "OK") {
          fetchImages();
        }
      });
  };

  const follow = (id) => {
    fetch(
      `${process.env.REACT_APP_API_URL}/follow/${id}/${localStorage.getItem(
        "username"
      )}`,
      {
        method: "PUT",
        headers: { "Content-Type": "Application/json" },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message == "FOLLOWED") {
          fetchImages();
        }
        if (res.message == "ALREADY_FOLLOWED") {
          fetch(
            `${
              process.env.REACT_APP_API_URL
            }/unfollow/${id}/${localStorage.getItem("username")}`,
            {
              method: "DELETE",
            }
          )
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              if (res.message == "DELETED") {
                fetchImages();
              }
              console.log(res);
            });
        }
        console.log(res);
      });
  };

  return (
    <div className="container">
      {isLoading || isComLoading || isLikeLoading ? (
        <h4 style={{ textAlign: "left" }}>Loading...</h4>
      ) : (
        <div>
          <div className="explore">Explore.</div>
          {post.map((x) => {
            let myImage = cld.image(`${x.image}`);
            return (
              <div>
                <div className="homee">
                  <div style={{ marginTop: "10px" }} className="post">
                    <div className="profile">
                      <div
                        className="leftside"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          nav(`/${x.user.email}`);
                        }}
                      >
                        <div className="circle">
                          {x.user.email[0].toUpperCase()}
                        </div>
                        <div>{x.user.email}</div>
                      </div>
                      <div className="button">
                        {localStorage.getItem("username") == x.user.email ? (
                          <button
                            className="follow"
                            onClick={(e) => {
                              e.preventDefault();
                              nav(`${localStorage.getItem("username")}`);
                            }}
                          >
                            Profile
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              follow(x.user.id);
                            }}
                            className="follow"
                          >
                            {x.isFollowed ? `Following` : `Follow`}
                          </button>
                        )}
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        nav(`/${x.image}/${x.id}`);
                      }}
                      className="image"
                      style={{ cursor: "pointer" }}
                    >
                      <AdvancedImage className="img" cldImg={myImage} />
                    </div>
                    <div className="content">
                      <div className="header">
                        {x.user != null ? (
                          <span className="title">
                            <b>{x.title} / </b>
                            by <span className="username"> {x.user.email}</span>
                            <span className="little">
                              &nbsp;&nbsp;{` ` + x.description}
                            </span>
                          </span>
                        ) : (
                          `null`
                        )}
                        <div className="rightside">
                          {x.isLiked ? (
                            <FontAwesomeIcon
                              onClick={() => {
                                if (you == "login") {
                                  nav("/login");
                                }
                                nav(`/${x.image}/${x.id}`);
                              }}
                              className="heartLiked"
                              icon={faHeart}
                            ></FontAwesomeIcon>
                          ) : (
                            <FontAwesomeIcon
                              onClick={() => {
                                if (you == "login") {
                                  nav("/login");
                                }
                                nav(`/${x.image}/${x.id}`);
                              }}
                              className="heart"
                              icon={faHeart}
                            ></FontAwesomeIcon>
                          )}

                          {localStorage.getItem("username") == x.user.email ? (
                            <FontAwesomeIcon
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                deleteIt(x.id);
                              }}
                              className="trash"
                              icon={faTrash}
                            ></FontAwesomeIcon>
                          ) : (
                            <FontAwesomeIcon
                              onClick={() => {
                                nav(`/${x.image}/${x.id}`);
                              }}
                              style={{ cursor: "pointer" }}
                              className="trash"
                              icon={faEllipsis}
                            ></FontAwesomeIcon>
                          )}

                          <button onClick={(e) => {}} className="btndc">
                            Send
                          </button>
                        </div>
                      </div>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          nav(`/${x.image}/${x.id}`);
                        }}
                        className="likes"
                      >
                        {x.likes.length == 1
                          ? `${x.likes.length} like`
                          : `${x.likes.length} likes`}
                      </div>
                      <div
                        onClick={() => {
                          nav(`/${x.image}/${x.id}`);
                          // gotoPost(x.id);
                        }}
                        className="comd"
                      >
                        View all {x.comments.length} comments
                      </div>
                      <div className="input2">
                        <div className="cole">
                          <input
                            className="oka"
                            style={{
                              outline: "none",
                              border: "none",
                              width: "99.2%",
                              height: "39px",
                              textIndent: "50px",
                            }}
                            value={newComment.comment}
                            type="text"
                            name="comment"
                            onClick={() => {
                              nav(`/${x.image}/${x.id}`);
                            }}
                            placeholder="Add a comment..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
