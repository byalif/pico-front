import React, { createContext, useContext, useState } from "react";
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [postId, setPostId] = useState("");
  const [index, setIndex] = useState(0);
  const [you, setYou] = useState("login");
  return (
    <AppContext.Provider
      value={{
        index,
        setIndex,
        you,
        setYou,
        postId,
        setPostId,
        loggedIn,
        setLoggedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export default AppProvider;
