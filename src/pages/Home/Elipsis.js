import React from "react";
import "./ec.css";

const Elipsis = ({ trigger, setTrigger }) => {
  return trigger ? (
    <div className="ec-container">
      <div className="items">
        <div>
          <h4>follow</h4>
        </div>
        <div>
          <h4>view profile</h4>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default Elipsis;
