import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const history = useHistory();

  
  useEffect(() => {
    const fetchUserData = async () => {
      const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);
      if (!userInfo) {
        history("/");
      }
    };
    fetchUserData();
  }, [history])


  

  return (
    <ChatContext.Provider
      value={{
         user,
        setUser,
        selectedChat,
        setSelectedChat,
         chats,
        setChats,
        notification,
        setNotification,
        
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;