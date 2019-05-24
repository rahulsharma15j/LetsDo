const express = require("express");
const router = express.Router();
const historyController = require("./../controllers/historyController");
const appConfig = require("./../../config/appConfig");
const auth = require("./../middlewares/auth");

module.exports.setRouter = app => {
  let baseUrl = `${appConfig.apiVersion}/history`;

  app.post(
    `${baseUrl}/create-history`,
    auth.isAuthorized,
    historyController.createHistory
  );
  app.post(
    `${baseUrl}/delete-history`,
    auth.isAuthorized,
    historyController.deleteHistory
  );
  app.get(
    `${baseUrl}/get-history`,
    auth.isAuthorized,
    historyController.getHistory
  );
};
