import React, { useEffect, useState, useRef } from "react";
import Popup from "./Popup";
import { useGlobalContext } from "../../context";
import "./Comments.css";
import { AdvancedImage } from "@cloudinary/react";
import { useNavigate } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import {
  faEllipsis,
  faHeart,
  faThumbsUp,
  faMinus,
  faHeartCircleBolt,
  faTrash,
  fasend,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { autoLeft } from "@cloudinary/url-gen/qualifiers/rotationMode";
import { useParams } from "react-router-dom";

const Comments = () => {
  const { setIndex, index } = useGlobalContext();
  const [liked, setLiked] = useState(false);
  let temp = [];
  const heartt = useRef(null);
  const comme = useRef(null);
  const comm = useRef(null);
  const box = useRef(null);
  const input = useRef(null);
  const btn = useRef(null);
  const [done, setDone] = useState(true);
  let temped = [];
  const [display, setDisplay] = useState(false);
  const [valid, setValid] = useState(true);
  const { you, setYou } = useGlobalContext();
  const [newComment, setComment] = useState({
    comment: "",
    email: localStorage.getItem("username"),
  });
  const [likes, setLikes] = useState(0);
  const [showLikes, setShowLikes] = useState(false);
  const [postUser, setPostUser] = useState("");
  const [post, setPost] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likeLoading, likeIsLoading] = useState(true);
  const [authorLoading, setAuthorLoading] = useState(true);
  const [comLoading, comIsLoading] = useState(true);
  const { postId, image } = useParams();
  const nav = useNavigate();

  const getAuthor = () => {
    fetch(`${process.env.REACT_APP_API_URL}/getUser/${postId}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res) {
          setAuthorLoading(false);
          setPostUser(res.email);
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
          getThePost();
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
                getThePost();
              }
              console.log(res);
            });
        }
        console.log(res);
      });
  };

  const getThePost = () => {
    fetch(`${process.env.REACT_APP_API_URL}/getPost/${postId}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res) {
          res.likes.forEach((x) => {
            if (x.email == localStorage.getItem("username")) {
              setLiked(true);
            }
          });
          let count2 = 0;
          temped = [];
          if (res.user.followers.length == 0) {
            setPost({ ...res, isFollowed: false });
            count2++;
          } else {
            res.user.followers.forEach((n, k) => {
              if (count2 == 0 && n.email == localStorage.getItem("username")) {
                setPost({ ...res, isFollowed: true });
                count2++;
              } else if (count2 == 0 && k == res.user.followers.length - 1) {
                count2++;
                setPost({ ...res, isFollowed: false });
              }
            });
          }
          if (count2 >= 1) {
            setIsLoading(false);
            console.log(temped);
          }
        }
      });
  };
  const getComments = () => {
    fetch(`${process.env.REACT_APP_API_URL}/${postId}/allComments`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        comIsLoading(false);
        let ar = res.reverse();
        setData(ar);
        console.log(res);
      });
  };
  useEffect(() => {
    setIndex(4);
    setYou(localStorage.getItem("username"));
    getComments();
    getLikes();
    getAuthor();
    getThePost();
  }, []);

  const newCom = (e) => {
    e.preventDefault();
    if (newComment.comment.length > 0) {
      fetch(`${process.env.REACT_APP_API_URL}/comment/${postId}`, {
        method: "PUT",
        body: JSON.stringify({
          comment: newComment.comment,
          email: localStorage.getItem("username"),
        }),
        headers: { "Content-Type": "Application/json" },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.status == "ACCEPTED") {
            setComment({
              comment: "",
              email: localStorage.getItem("username"),
            });
            getComments();
          }
          if (res.message == "LOGIN") {
            console.log(res);
          }
        });
    }
  };

  const getLikes = () => {
    fetch(`${process.env.REACT_APP_API_URL}/${postId}/getLikes`, {
      method: "GET",
      headers: { "Content-Type": "Application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        likeIsLoading(false);
        setLikes(res.length);
        //   console.log(res);
      });
  };
  const commentOn = (e) => {
    e.preventDefault();
    setComment({
      [e.target.name]: e.target.value,
    });
  };

  const likeIt = () => {
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
          setDone(true);
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
                setLiked(false);
                getLikes();
              }
              getThePost();
            });
        }
        getLikes();
        getThePost();
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
          nav("/home");
        }
      });
  };

  const likeCom = ({ id, email }) => {
    fetch(`${process.env.REACT_APP_API_URL}/addComLike/${id}/${email}`, {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.message == "VALID") {
          getComments();
        } else if ((res.message = "LIKED_ALREADY")) {
          fetch(
            `${process.env.REACT_APP_API_URL}/deleteComLike/${id}/${email}`,
            {
              method: "DELETE",
            }
          )
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              if (res.message == "UNLIKED") {
                getComments();
              }
            });
        }
      });
  };

  const deleteCom = ({ commentId }) => {
    fetch(
      `${process.env.REACT_APP_API_URL}/${postId}/deleteComment/${commentId}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.message == "DELETED") {
          getComments();
        }
      });
  };

  const cld = new Cloudinary({
    cloud: {
      cloudName: "dcchunhwy",
    },
  });
  let myImage = cld.image(`${image}`);
  return (
    <>
      {authorLoading || isLoading || comLoading || likeLoading ? (
        <h4 style={{ textAlign: "center" }}>Loading...</h4>
      ) : (
        <div className="home">
          <div style={{ marginTop: "10px" }} className="postt">
            <div className="profile">
              <div
                className="leftside"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  nav(`/${post.user.email}`);
                }}
              >
                <div className="circle">{post.user.email[0].toUpperCase()}</div>
                <div>{post.user.email}</div>
              </div>
              <div className="button">
                {localStorage.getItem("username") == post.user.email ? (
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
                      follow(post.user.id);
                    }}
                    className="follow"
                  >
                    {post.isFollowed ? `Following` : `Follow`}
                  </button>
                )}
              </div>
            </div>
            <Popup
              trigger={showLikes}
              setTrigger={setShowLikes}
              posts={post}
            ></Popup>
            <div className="image">
              <AdvancedImage className="img" cldImg={myImage} />
            </div>
            {/* <Popup trigger={true}>
              <h3>my popup</h3>
            </Popup> */}
            <div className="content">
              <div className="header">
                {postUser != null ? (
                  <span className="title">
                    <b>{post.title} / </b>
                    by <span className="username"> {postUser}</span>
                    <span className="little">
                      &nbsp;&nbsp;{post.description}
                    </span>
                  </span>
                ) : (
                  `null`
                )}
                <div className="rightsidee">
                  {!liked ? (
                    <FontAwesomeIcon
                      onClick={() => {
                        setValid(!valid);
                        if (you == "login") {
                          nav("/login");
                        }
                        likeIt();
                      }}
                      ref={heartt}
                      className="heart"
                      icon={faHeart}
                    ></FontAwesomeIcon>
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => {
                        setValid(!valid);
                        if (you == "login") {
                          nav("/login");
                        }
                        likeIt();
                      }}
                      ref={heartt}
                      className="heartLiked"
                      icon={faHeart}
                    ></FontAwesomeIcon>
                  )}
                  {localStorage.getItem("username") == postUser && (
                    <FontAwesomeIcon
                      onClick={() => {
                        deleteIt(postId);
                      }}
                      className="trash"
                      icon={faTrash}
                    ></FontAwesomeIcon>
                  )}
                  {newComment.comment.length == 0 ? (
                    <button
                      ref={btn}
                      onClick={(e) => {
                        newCom(e);
                      }}
                      className="btnd"
                    >
                      Send
                    </button>
                  ) : (
                    <button
                      ref={btn}
                      onClick={(e) => {
                        newCom(e);
                      }}
                      className="btnd1"
                    >
                      Send
                    </button>
                  )}
                </div>
              </div>

              <div
                className="likes"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  console.log(post);
                  setShowLikes(!showLikes);
                }}
              >
                {likes == 1
                  ? `Liked by ${likes} person..`
                  : `Liked by ${likes} people..`}
              </div>

              <div
                onClick={(e) => {
                  let val = e.target.getBoundingClientRect();
                  console.log(val);
                  if (display) {
                    setDisplay(false);
                    box.current.className = "input8";
                    btn.current.style.top = "103px";
                    input.current.className = "input2";
                    comme.current.className = "comments";
                    comm.current.innerText = `View all ${data.length} comments`;
                    comm.current.className = "com";
                  }
                  if (!display) {
                    setDisplay(true);
                    box.current.className = "input9";
                    btn.current.style.top = "206px";
                    input.current.className = "input";
                    comm.current.innerHTML = `&nbsp;<i class="fa fa-eye-slash" aria-hidden="true"></i>&nbsp;${
                      data.length == 0 ? `No comments yet` : `Hide comments`
                    } `;
                    comm.current.className = "com2";
                    comme.current.className = "comments2";
                  }
                }}
                className="com"
                ref={comm}
              >
                {data.length == 0
                  ? `No comments yet`
                  : `View all ${data.length} comments`}
              </div>
              <div ref={comme} className="comments">
                {data.map((x) => {
                  return (
                    <div className="comment">
                      <div>
                        <p
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            nav(`/${x.email}`);
                          }}
                        >
                          {x.email}
                        </p>
                        <p
                          style={{
                            marginLeft: "2px",
                            color: "black",
                            fontWeight: "lighter",
                            fontSize: "15px",
                            marginTop: "-17px",
                            paddingBottom: "8px",
                          }}
                        >
                          {x.like.length == 1
                            ? `${x.like.length} like`
                            : `${x.like.length} likes`}
                        </p>
                      </div>
                      &nbsp;&nbsp;&nbsp;
                      <h4 style={{ fontSize: "small" }}>{x.comment}</h4>
                      <div className="show">
                        {/* <p>{x.like.length} likes</p> */}
                        <FontAwesomeIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            if (you == "login") {
                              nav("/login");
                            } else {
                              likeCom({ email: you, id: x.id });
                            }
                          }}
                          className="comLike"
                          icon={faHeart}
                        ></FontAwesomeIcon>
                        {localStorage.getItem("username") == x.email ? (
                          <FontAwesomeIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              if (you == "login") {
                                nav("/login");
                              } else {
                                deleteCom({
                                  postId,
                                  commentId: x.id,
                                });
                              }
                            }}
                            className="comLike"
                            icon={faTrash}
                          ></FontAwesomeIcon>
                        ) : (
                          <FontAwesomeIcon
                            className="comLike"
                            icon={faEllipsis}
                          ></FontAwesomeIcon>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div ref={input} className="input2">
              <div className="cole">
                <input
                  ref={box}
                  className="input8"
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
                  onChange={(e) => {
                    commentOn(e);
                  }}
                  placeholder="Add a comment..."
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Comments;
