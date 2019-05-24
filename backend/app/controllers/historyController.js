/**Libraries */
const listLib = require("./../libs/listLib");
const response = require("./../libs/responseLib");
const check = require("./../libs/checkLib");
const itemLib = require("./../libs/itemLib");
const logger = require("./../libs/loggerLib");
const time = require("./../libs/timeLib");
const shortId = require("shortid");

/**Models */
const List = require("./../models/List");
const User = require("./../models/User");
const History = require("./../models/History");

let createHistory = (req, res) => {
  let validateUserInput = () => {
    return new Promise((resolve, reject) => {
      if (check.isEmpty(req.body.listId) || check.isEmpty(req.body.key)) {
        reject(
          response.generate(true, "One or more field(s) is empty.", 400, null)
        );
      } else if (req.body.key === "Add Item") {
        resolve(null);
      } else {
        resolve(req);
      }
    });
  };

  let updateHistory = itemDetails => {
    return new Promise((resolve, reject) => {
      let newHistory = new History({
        historyId: shortId.generate(),
        listId: req.body.listId,
        itemId: req.body.itemId,
        subItemId: req.body.subItemId,
        key: req.body.key,
        itemValues: itemDetails,
        createdOn: time.now()
      });
      console.log(newHistory);
      newHistory.save((err, newHistory) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "historyController: createHistory()", 10);
          reject(
            response.generate(true, "Failed to create history.", 500, null)
          );
        } else {
          resolve(newHistory.toObject());
        }
      });
    });
  };

  validateUserInput(req, res)
    .then(resolve => itemLib.findItem(resolve.body.itemId))
    .then(resolve => updateHistory(resolve))
    .then(result => {
      delete result._id;
      delete result.__v;
      res.send(response.generate(false, "History created.", 200, result));
    })
    .catch(err => {
      res.send(err);
    });
};

let deleteHistory = (req, res) => {
  let findHistory = req => {
    return new Promise((resolve, reject) => {
      History.findOne({ listId: req.body.listId | 123 })
        .sort({ $natural: -1 })
        .exec((err, historyDetails) => {
          if (err) {
            logger.error(err.message, "historyLib: findHistory()", 10);
            reject(
              response.generate(true, "Failed to find history.", 500, null)
            );
          } else if (check.isEmpty(historyDetails)) {
            logger.info("History not found.", "historyLib: findHistory()", 7);
            reject(response.generate(true, "History not found.", 404, null));
          } else {
            resolve(historyDetails);
          }
        });
    });
  };

  let updateHistory = historyDetails => {
    return new Promise((resolve, reject) => {
      History.findOneAndRemove({ historyId: historyDetails.historyId }).exec(
        (err, result) => {
          if (err) {
            logger.error(err.message, "historyController: deleteHistory()", 10);
            reject(
              response.generate(true, "Failed to delete history.", 500, null)
            );
          } else if (check.isEmpty(result)) {
            logger.info(
              "History not found.",
              "historyController: deleteHistory()",
              7
            );
            reject(response.generate(true, "History not deleted.", 404, null));
          } else {
            resolve(result);
          }
        }
      );
    });
  };

  findHistory(req, res)
    .then(updateHistory)
    .then(result => {
      res.send(response.generate(false, "History deleted.", 200, result));
    })
    .catch(err => {
      res.send(err);
    });
};

let getHistory = (req, res) => {
  let findHistory = req => {
    return new Promise((resolve, reject) => {
      History.find()
        .sort({ $natural: -1 })
        .select("-_id -__v")
        .exec((err, historyDetails) => {
          if (err) {
            logger.error(err.message, "historyLib: findHistory()", 10);
            reject(
              response.generate(true, "Failed to find history.", 500, null)
            );
          } else if (check.isEmpty(historyDetails)) {
            logger.info("History not found.", "historyLib: findHistory()", 7);
            reject(response.generate(true, "History not found.", 404, null));
          } else {
            resolve(historyDetails);
          }
        });
    });
  };

  findHistory(req, res)
    .then(result => {
      res.send(
        response.generate(false, "History found and listed.", 200, result)
      );
    })
    .catch(err => {
      res.send(err);
    });
};

module.exports = {
  createHistory: createHistory,
  deleteHistory: deleteHistory,
  getHistory: getHistory
};
