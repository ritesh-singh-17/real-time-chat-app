require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes")
const socket = require("socket.io");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

const db = process.env.MONGO_URL;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connection to mongodb is successfull")
}).catch((e) => {
    console.log("connection not successfull");
}); 

const server = app.listen(port, () => {
    console.log(`listening to port no. ${port}`)
})

const io = socket(server, {
    cors: {
        origin: "https://chat-app-374l.onrender.com",
        credentials: true,
    },
})

global.onlineUsers = new Map();

io.on("connection", (socket)=> {
    global.chatSocket = socket;
    socket.on("add-user", (userId)=> {
        onlineUsers.set(userId, socket.id);
    })

    socket.on("send-msg", (data)=> {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-receive", data.message)
        }
    })
})