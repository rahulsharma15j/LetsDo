const redis = require("redis");

let client = redis.createClient(
  "redis://:J11Bk6uwsVmKS4gE6ElGZoYhufFjj6ti@redis-14483.c8.us-east-1-3.ec2.cloud.redislabs.com:14483"
);

const logger = require("../libs/loggerLib");
const check = require("../libs/checkLib");

client.on("connect", () => {
  console.log("redis connection successfully open.");
});

let getAllUsersInHash = (hashName, callback) => {
  client.HGETALL(hashName, (err, result) => {
    if (err) {
      logger.error(err, "redisLib: getAllUsersInHash()", 10);
      callback(err, null);
    } else if (check.isEmpty(result)) {
      logger.info(
        "Online users list is empty.",
        "redisLib: getAllUsersInHash()",
        7
      );
      callback(null, {});
    } else {
      console.log("inside getall users in hash");
      console.log(result);
      callback(null, result);
    }
  });
};

let setNewOnlineUserInHash = (hashName, key, value, callback) => {
  client.HMSET(hashName, [key, value], (err, result) => {
    if (err) {
      logger.error(err, "redisLib: setNewOnlineUserInHash()", 10);
      callback(err, null);
    } else {
      console.log(result);
      callback(null, result);
    }
  });
};

let deleteUserFromHash = (hashName, key) => {
  client.HDEL(hashName, key);
  //return true;
};

module.exports = {
  getAllUsersInHash: getAllUsersInHash,
  setNewOnlineUserInHash: setNewOnlineUserInHash,
  deleteUserFromHash: deleteUserFromHash
};
