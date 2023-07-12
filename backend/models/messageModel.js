// const mongoose = require('mongoose')


// //name of the sender or the id of the sender

// //content of the message

// //reference to the chat to which it belongs to
// const messageModel=mongoose.Schema(
//     {
//         sender:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
//         content:{
//             type:String,trim:true
//         },
//         chat:{
//             type:mongoose.Schema.Types.ObjectId,ref:"Chat"
//         },
//     },
//         {timestamps:true}
    
// );

// const Message=mongoose.model("Message",messageModel);

// module.exports = Message;
const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;