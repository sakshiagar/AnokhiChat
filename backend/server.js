// //starting of a our very own first server
// const express =require("express");
// const dotenv =require("dotenv");
// const {chats} =require("./data/data");
// const connectDB = require("./config/db");
// const colors=require("colors");
// const path=require("path");

// const app=express()//creating an instance for calling express
// dotenv.config()

// connectDB();
// //creating express js API
// //whenerver u get a '/' then do call back and this call back takes req and res
// app.get('/',(req,res)=>{
// res.send('API  is running sucessfully');
// })
// //after this when we type localhost:5000 in chrome , it will show API is runnig


// //Now let's create a little more complex API
// app.get('/api/chat',(req,res)=>{
//     res.send(chats);
// })//after this when we type localhoste:5000/api/chat in browser , it will show all the data of dat.js file//it is the official end point of this data


// //calling by id variable
// app.get('/api/chat/:id',(req,res)=>{
   
// //console.log(req);//this will not produce data of a particualr id but insted there is a huge request in the terminal where we have a params id
// console.log(req.params.id);//by this we get that params id

// const singleChat=chats.find((c)=>c._id===req.params.id);
// res.send(singleChat);

// })


// const PORT=process.env.PORT || 5000
// //now we will listen to the port
// //app.listen(5000,console.log("serevr has been started on port 5000")
// app.listen(5000,console.log(`serevr has been started on port ${PORT}`)

// )

const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data

// app.get("/", (req, res) => {
//   res.send("API Running!");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://lambent-marshmallow-2e8ebb.netlify.app/",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    if (userData && userData._id) {
      socket.join(userData._id);
      socket.emit("connected");
    } else {
      // Handle the case when userData or userData._id is missing
      socket.emit("setup_error", "Invalid user data");
    }
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
