// connecting with sockets.
const socket = io('http://localhost:3000');

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Ik1RcU9SMFFtSyIsImlhdCI6MTU1MjQ1NzYwODA4MywiZXhwIjoxNTUyNTQ0MDA4LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJtZWV0aW5nLXBsYW5uZXIiLCJkYXRhIjp7InVzZXJUeXBlIjoibm9ybWFsIiwiaXNWZXJpZmllZCI6dHJ1ZSwidXNlcklkIjoiSDBNSXd0MWV0IiwiZmlyc3ROYW1lIjoiQWpheSIsImxhc3ROYW1lIjoic2hpbmciLCJlbWFpbCI6InJhaHVsc2hhcm1hMTVqQGdtYWlsLmNvbSIsInVzZXJOYW1lIjoicmFodWxzaGFybWExNWoiLCJtb2JpbGUiOiI3Nzc3Nzc3Nzc3In19.ZGbJK1qPkmYkhBn4WczOms057XoYdoUSYD3b5sTosUM"
const userId = "H0MIwt1et"

/*let chatMessage = {
  createdOn: Date.now(),
  receiverId: 'SJ-iectqM',//putting user2's id here 
  receiverName: "Aditya Kumar",
  senderId: userId,
  senderName: "Mr Xyz"
}*/

let chatSocket = () => {

  socket.on('verify-user', (data) => {

    console.log("socket trying to verify user");

    socket.emit("set-user", authToken);

  });

 /* socket.on(userId, (data) => {

    console.log("you received a message from "+data.senderName)
    console.log(data.message)

  });*/

  socket.on('online-user-list', (data) => {

    console.log("Online user list is updated. some user can online or went offline")
    console.log(data)

  });

  /*socket.on("typing", (data) => {

    console.log(data+" is typing")
    
    
  });

  $("#send").on('click', function () {

    let messageText = $("#messageToSend").val()
    chatMessage.message = messageText;
    socket.emit("chat-msg",chatMessage)

  })

  $("#messageToSend").on('keypress', function () {

    socket.emit("typing","Mr Xyz")

  })*/




}// end chat socket function

chatSocket();
