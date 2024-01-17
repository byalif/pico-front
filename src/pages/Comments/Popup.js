import React from "react";
import "./Popup.css";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const Popup = ({ setTrigger, posts, trigger }) => {
  const nav = useNavigate();
  return trigger ? (
    <>
      <div className="bg"></div>
      <div className="popup">
        <div className="popup-inner">
          <div className="close">
            <FontAwesomeIcon
              onClick={() => {
                setTrigger(false);
              }}
              icon={faClose}
              style={{ cursor: "pointer" }}
            ></FontAwesomeIcon>
          </div>
          <div className="title">Liked by</div>
          <div className="opened">
            {posts.likes.map((x) => {
              return (
                <div data-testid="allLikes" className="like">
                  <div
                    onClick={() => {
                      nav(`/${x.email}`);
                    }}
                    className="circle"
                  >
                    {x.email[0].toUpperCase()}
                  </div>
                  <h2
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      nav(`/${x.email}`);
                    }}
                  >
                    {x.email}
                  </h2>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  ) : (
    ""
  );
};

export default Popup;
