
import './App.css';
import {Route} from 'react-router-dom'
import Homepage from './pages/Homepage';
import Chatpage from './pages/ChatPage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
 <Route path="/" component={Homepage} exact/>
 <Route path="/chats" component={Chatpage} /> 
 {/* home is also rendred and chat is also rendered if we type localhost:3000/chats because / path is included in /chats path also */}

<ToastContainer />

    </div>
  );
}

export default App;
