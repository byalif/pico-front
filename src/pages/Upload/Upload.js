import React, { useEffect, useRef, useState } from "react";
import "./Upload.css";
import { useNavigate } from "react-router-dom";
import { faGroupArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalContext } from "../../context";

const Upload = () => {
  const nav = useNavigate();
  const [status, setStatus] = useState("");
  const uploaded = useRef(null);
  const [post, setPost] = useState({
    title: "",
    description: "",
    image: "",
    email: localStorage.getItem("username"),
  });
  const { index, setIndex } = useGlobalContext();

  const HandleChange = (e) => {
    let val = e.target.value;
    setPost({
      ...post,
      [e.target.name]: val,
    });
  };

  useEffect(() => {
    setIndex(1);
  });

  const uploadImage = (files) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "bzmruulb");

    fetch(`https://api.cloudinary.com/v1_1/dcchunhwy/image/upload`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.public_id != "") {
          setPost({
            ...post,
            ["image"]: data.public_id,
          });
          console.log(post);
        }
      });
  };

  const postImage = () => {
    fetch(`${process.env.REACT_APP_API_URL}/upload`, {
      method: "POST",
      body: JSON.stringify(post),
      headers: { "Content-Type": "Application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setStatus(res);
        console.log(res);
        if (res.message == "UPLOADED") {
          uploaded.current.style.display = "inline-block";
          uploaded.current.innerText = "Post uploaded!";
          setTimeout(() => {
            nav("/");
          }, 1700);
        } else if (res.message == "NOT_FOUND") {
          uploaded.current.style.display = "inline-block";
          uploaded.current.innerText = "Sign in to make a post!";
        } else {
          uploaded.current.style.display = "inline-block";
          uploaded.current.innerText = "Oops.. Try again";
        }
      });
  };

  return (
    <>
      <div className="upload">
        <div className="container">
          <div>
            <div className="Registerr">
              <div className="page">
                <div>
                  <div>
                    <h2 className="crea">Create post.</h2>
                  </div>
                  <div className="upl">
                    <div className="inputs">
                      {/* <p>Post uploaded!</p> */}
                      <input
                        placeholder="Title..."
                        name="title"
                        value={post.title}
                        onChange={(e) => {
                          HandleChange(e);
                        }}
                        type="text"
                      />
                      <input
                        placeholder="Description..."
                        name="description"
                        value={post.description}
                        onChange={(e) => {
                          HandleChange(e);
                        }}
                        type="text"
                      />
                    </div>
                    <div className="file">
                      <input
                        onChange={(e) => {
                          uploadImage(e.target.files);
                        }}
                        type="file"
                      ></input>
                    </div>
                    <div className="btn">
                      <button onClick={postImage} style={{ fontSize: "16px" }}>
                        Post
                      </button>
                      <p ref={uploaded}>Post uploaded!</p>
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

export default Upload;
