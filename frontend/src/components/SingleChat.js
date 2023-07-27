import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import {
  IconButton,
  Spinner,
  useToast,
 
  InputGroup,
  InputRightElement,
  Flex,
} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"; // Import SpeechRecognition directly
import { IoMdMicrophone, IoIosSend } from "react-icons/io";

import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
// const ENDPOINT = "https://anokhi-chat.onrender.com";
const ENDPOINT = "https://anokhi-chat.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const [listening, setListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();

 useEffect(() => {
   if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
     console.error("Speech recognition is not supported in this browser.");
   }
 }, []);

 useEffect(() => {
   // Do something with the 'transcript' value when it changes (e.g., handleVoiceInput())
   handleVoiceInput(transcript);
 }, [transcript]);

 const handleMicClick = () => {
   if (listening) {
     SpeechRecognition.stopListening();
   } else {
     SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
   }
   setListening(!listening);
 };

 const handleVoiceInput = (text) => {
   // Do something with the 'text' received from speech recognition
   // For example, update the input field or send the message
   setNewMessage(text);
 };

  // Create a ref for the messages container
  const messagesContainerRef = useRef(null);

  // Scroll to the bottom of the messages container when new messages are added
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async () => {
    // Remove the event parameter
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        resetTranscript();
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };


  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };


  // const handleSendMessage = () => {
  //   // Handle sending the message (e.g., with a socket.emit() or API call)
  //   // using the 'newMessage' state
  //   console.log("Sending message:", newMessage);
  //   // Clear the input field or perform any other required actions
  //   setNewMessage("");
  //   // Reset the transcript after sending the message
  //   resetTranscript();
  // };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="900px"
            borderRadius="lg"
            overflowY="scroll"
            position="relative"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div
                className="messages"
                style={{
                  overflowY: "auto",
                  maxHeight: "calc(100% - 3rem)", // Adjust the height for input
                }}
                ref={messagesContainerRef} // Ref for scrolling
              >
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                marginBottom: "1rem", // Margin to prevent overlapping
              }}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <InputGroup>
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                  pr="4.5rem" // Add right padding to accommodate the microphone icon
                />
                <InputRightElement width="9rem">
                  {" "}
                  {/* Increase width to accommodate both icons */}
                  <Flex align="center">
                    <IconButton
                      icon={<IoMdMicrophone />}
                      aria-label="Microphone"
                      size="sm"
                      onClick={handleMicClick}
                      color={listening ? "red.500" : "gray.500"}
                    />
                    <IconButton
                      icon={<IoIosSend />}
                      aria-label="Send"
                      size="sm"
                      onClick={sendMessage}
                      ml={2} // Add margin to separate the two icons
                    />
                  </Flex>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
