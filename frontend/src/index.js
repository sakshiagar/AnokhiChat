import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./Context/ChatProvider";
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(

    <ChakraProvider>
      <BrowserRouter>
        <ChatProvider>
          <App />
        </ChatProvider>
      </BrowserRouter>
    </ChakraProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
  //Now we gonna connect our frontend from backend and get a API call from backend to frontend , it will give a corse error as backend is running on port 5000 and frontend on 3000 .. to run the API from frontend to backend 
  // we need to have same origin so we need to provide a proxy to our frontend app
  //http://127.0.0.1 is the proxy server for react

  //react router dom is for multiple pages connected with single page
  // to use this wew gonna wrap whole of the app in browser router

  //in order to use await we need to use async function

  //useEffect is a hook in react which is used when a component is rendered for the first time
//if u want to write javascript in htm using react , we will use {}
  //this useState is used to store this data
  //it has two variables 
  //1. chats= to dislau the data
  //2. setchats- to change the data

  //we have use map to get display chat 
  //but it gives an error as we have not given a unique key so we have provided id as unique key and sucessfuky it display the name of every user
  //this is how we ftech the data from backend and display at frontend

  //SCHEMAS AND MODELS
  //we gonna use mongoose to create schemas



