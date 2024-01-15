import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../../context";
import { useNavigate, useParams } from "react-router-dom";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

import "./profile.css";

import {
  faEllipsis,
  faHeart,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Comments from "../Comments/Comments";
// import "./Home.css";

const Profile = () => {
  const { email } = useParams();
  const [theAuthor, setTheAuthor] = useState({});
  const { you, setYou, index, setIndex } = useGlobalContext();
  const nav = useNavigate();
  const [newComment, setComment] = useState({
    comment: [],
    email: localStorage.getItem("username"),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isComLoading, setIsComLoading] = useState(true);
  const [isLikeLoading, setIsLikeLoading] = useState(true);
  const { loggedIn, setLoggedIn } = useGlobalContext();
  const [user, setUser] = useState([]);
  let thisone = false;
  const [post, setPost] = useState([]);
  const [following, setFollowing] = useState(0);
  let temped = [];
  let temped2 = [];

  useEffect(() => {
    setIndex(5);
    setYou(localStorage.getItem("username"));
    setIsLikeLoading(true);
    if (localStorage.getItem("loggedIn")) {
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
    if (localStorage.getItem("username") == email) {
      setIndex(2);
    }
    fetchImages();
  }, []);

  const fetchImages = () => {
    fetch(`${process.env.REACT_APP_API_URL}/userPosts/${email}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.length == 0) {
          fetch(`${process.env.REACT_APP_API_URL}/userByemail/${email}`, {
            method: "GET",
          })
            .then((x) => {
              return x.json();
            })
            .then((r) => {
              setTheAuthor(r);
              let countz = 0;
              r.followers.forEach((j, o) => {
                if (
                  countz == 0 &&
                  j.email == localStorage.getItem("username")
                ) {
                  setTheAuthor({ ...r, isFollowed: true });
                  countz++;
                } else if (countz == 0 && o == r.followers.length - 1) {
                  setTheAuthor({ ...r, isFollowed: false });
                  countz++;
                }
              });
              console.log("no posts");
              setIsLikeLoading(false);
              setIsComLoading(false);
              setIsLoading(false);
              // setPost([...theAuthor]);
              return;
            });
        }
        console.log(res);
        setPost(res.reverse());

        temped = [];
        temped2 = [];
        fetch(`${process.env.REACT_APP_API_URL}/following/${res[0].user.id}`, {
          method: "GET",
        })
          .then((x) => {
            return x.json();
          })
          .then((data) => {
            setFollowing(data.length);
          });

        res.forEach((x, i) => {
          let count = 0;
          if (x.likes.length == 0) {
            temped.push({ ...x, isLiked: false });
          } else {
            x.likes.forEach((y, b) => {
              if (count == 0 && y.email == localStorage.getItem("username")) {
                temped.push({ ...x, isLiked: true });
                count++;
              } else if (count == 0 && b == x.likes.length - 1) {
                count++;
                temped.push({ ...x, isLiked: false });
              }
            });
          }
          if (i == res.length - 1) {
            setPost(temped);
            // console.log(temped);
            temped.forEach((c, j) => {
              let count2 = 0;
              if (c.user.followers.length == 0) {
                temped2.push({ ...c, isFollowed: false });
              } else {
                c.user.followers.forEach((n, k) => {
                  if (
                    count2 == 0 &&
                    n.email == localStorage.getItem("username")
                  ) {
                    temped2.push({ ...c, isFollowed: true });
                    count2++;
                  } else if (count2 == 0 && k == c.user.followers.length - 1) {
                    count2++;
                    temped2.push({ ...c, isFollowed: false });
                  }
                });
              }
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
          console.log(post);
          if (post.length == 1) {
            window.location.reload();
          } else {
            fetchImages();
          }
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
          {post.length == 0 ? (
            <div>
              <div className="no-post">
                <div
                  // style={{ backgroundImage: `url(${profile2})` }}
                  className="person"
                >
                  <div className="circleto">
                    <h4>{theAuthor.email[0].toUpperCase()}</h4>
                  </div>
                  <div className="whole">
                    <div className="rs">
                      <div></div>
                      <div className="posts">
                        <h4>0</h4>
                        <h4>Posts</h4>
                      </div>
                      <div className="followers">
                        <h4>{theAuthor.followers.length}</h4>
                        <h4>Followers</h4>
                      </div>
                      <div className="following">
                        <h4>{theAuthor.following.length}</h4>
                        <h4>Following</h4>
                      </div>
                    </div>
                    {theAuthor.email == localStorage.getItem("username") ? (
                      <button
                        onClick={() => {
                          nav("/upload");
                        }}
                        className="follow"
                      >
                        Upload
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          follow(theAuthor.id);
                        }}
                        className="follow"
                      >
                        {theAuthor.isFollowed ? `Following` : `Follow`}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  fontFamily: "sans-serif",
                  fontWeight: "lighter",
                }}
              >
                {localStorage.getItem("username") == email
                  ? `Get started and post something!`
                  : `No posts yet..`}
              </div>
            </div>
          ) : (
            <div className="prof">
              <div
                // style={{ backgroundImage: `url(${profile})` }}
                className="person"
              >
                <div className="circletop">
                  <h4>{post[0].user.email[0].toUpperCase()}</h4>
                </div>
                <div className="whole">
                  <div className="rs">
                    <div className="posts">
                      <h4>{post.length}</h4>
                      <h4> {post.length == 1 ? `Post` : `Posts`}</h4>
                    </div>
                    <div className="followers">
                      <h4>{post[0].user.followers.length}</h4>
                      <h4>Followers</h4>
                    </div>
                    <div className="following">
                      <h4>{following}</h4>
                      <h4>Following</h4>
                    </div>
                  </div>
                  {post[0].user.email == localStorage.getItem("username") ? (
                    <button
                      onClick={() => {
                        nav("/upload");
                      }}
                      className="follow"
                    >
                      Upload
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        follow(post[0].user.id);
                      }}
                      className="follow"
                    >
                      {post[0].isFollowed ? `Following` : `Follow`}
                    </button>
                  )}
                </div>
              </div>
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
                                by{" "}
                                <span className="username">
                                  {" "}
                                  {x.user.email}
                                </span>
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

                              {localStorage.getItem("username") ==
                                x.user.email && (
                                <FontAwesomeIcon
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    deleteIt(x.id);
                                  }}
                                  className="trash"
                                  icon={faTrash}
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
      )}
    </div>
  );
};

export default Profile;
