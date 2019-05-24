// connecting with sockets.
const socket = io('http://localhost:3000');

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IjJWWWZSUHEyeCIsImlhdCI6MTU1MjQ1OTAwMzAxNywiZXhwIjoxNTUyNTQ1NDAzLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJtZWV0aW5nLXBsYW5uZXIiLCJkYXRhIjp7InVzZXJUeXBlIjoibm9ybWFsIiwiaXNWZXJpZmllZCI6dHJ1ZSwidXNlcklkIjoiYzNDSDFmSU96IiwiZmlyc3ROYW1lIjoiUmFodWwiLCJsYXN0TmFtZSI6IlNoYXJtYSIsImVtYWlsIjoicmFodWxzaGFybWEzMUBnbWFpbC5jb20iLCJ1c2VyTmFtZSI6InJhaHVsc2hhcm1hMzEiLCJtb2JpbGUiOiI5OTk5OTk5OTk5In19.ONl3tv4VqPiAV_gpNZ3BHcLk0mgbDiyVLgpZVS5V9WU"
const userId= "c3CH1fIOz"

let chatMessage = {
  createdOn: Date.now(),
  receiverId: 'H1pOQGY9M',//putting user2's id here 
  receiverName: "Mr Xyz",
  senderId: userId,
  senderName: "Aditya Kumar"
}

let chatSocket = () => {

  socket.on('verify-user', (data) => {

    console.log("socket trying to verify user");

    socket.emit("set-user", authToken);

  });

  socket.on(userId, (data) => {

    console.log("you received a message from "+data.senderName)
    console.log(data.message)

  });

  socket.on("online-user-list", (data) => {

    console.log("Online user list is updated. some user can online or went offline")
    console.log(data)

  });


  $("#send").on('click', function () {

    let messageText = $("#messageToSend").val()
    chatMessage.message = messageText;
    socket.emit("chat-msg",chatMessage)

  })

  $("#messageToSend").on('keypress', function () {

    socket.emit("typing","Aditya Kumar")

  })

  socket.on("typing", (data) => {

    console.log(data+" is typing")
    
    
  });



}// end chat socket function

chatSocket();
