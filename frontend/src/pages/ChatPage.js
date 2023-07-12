
import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
//import { Flex } from "@chakra-ui/react";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        d="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && (
          <Box  marginRight="10px" >
            <MyChats fetchAgain={fetchAgain} />
          </Box>
        )}
        {user && (
          <Box  marginLeft="10px" >
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </Box>
        )}
      </Box>
    </div>
    
  );
};

export default Chatpage;


