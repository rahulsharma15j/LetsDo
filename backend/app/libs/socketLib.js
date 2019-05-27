const socketIo = require("socket.io");
const tokenLib = require("../libs/tokenLib");
const logger = require("../libs/loggerLib");
const redisLib = require("../libs/redisLib");
const event = require("./eventsLib");

let setServer = server => {
  let io = socketIo.listen(server);
  let myIo = io.of("/");

  myIo.on("connection", socket => {
    console.log("on connection emitting verify user.");
    socket.emit("verify-user", "");

    socket.on("set-user", authToken => {
      console.log("set user called.");
      tokenLib.verifyTokenWithoutSecret(authToken, (err, user) => {
        if (err) {
          socket.emit("auth-error", {
            status: 500,
            error: "Please provide correct authToken."
          });
        } else {
          console.log("user is verifyied setting details.");
          let currentUser = user.data;

          //setting userid to socket
          socket.userId = currentUser.userId;
          let fullName = `${currentUser.firstName} ${currentUser.lastName}`;
          let key = currentUser.userId;
          let value = fullName;

          let setUserOnline = redisLib.setNewOnlineUserInHash(
            "OnlineUsers",
            key,
            value,
            (err, result) => {
              if (err) {
                logger.error(
                  err.message,
                  "socketLib: setNewOnlineUserInHash().",
                  10
                );
              } else {
                redisLib.getAllUsersInHash("OnlineUsers", (err, result) => {
                  if (err) {
                    logger.error(
                      err.message,
                      "socketLib: getAllUsersInHash().",
                      10
                    );
                  } else {
                    socket.broadcast.emit("online-user-list", result);
                  }
                });
              }
            }
          );
        }
      });
    });

    event.on("Welcome", data => {
      socket.emit("Welcome", data);
    });
    event.on("Update-user", data => {
      socket.emit("notify", data);
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        redisLib.deleteUserFromHash("onlineUsers", socket.userId);
        redisLib.getAllUsersInHash("onlineUsers", (err, result) => {
          if (err) {
            logger.error(err.message, "socketLib: getAllUsersInHash().", 10);
          } else {
            socket.broadcast.emit("online-user-list", result);
          }
        });
      }
    });
  });
};

module.exports = {
  setServer: setServer
};
