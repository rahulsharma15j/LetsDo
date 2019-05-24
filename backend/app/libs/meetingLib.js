const shortId = require("shortid");
const mongoose = require("mongoose");
const momentz = require("moment-timezone");
const moment = require("moment");
const time = require("../libs/timeLib");
const logger = require("../libs/loggerLib");
const response = require("../libs/responseLib");
const mailer = require("../libs/mailerLib");
const check = require("../libs/checkLib");
const userLib = require("../libs/userLib");
const Meeting = require("../models/Meeting");
const User = mongoose.model("User");

let meetingList = [];

let create = (req, res) => {
  return new Promise((resolve, reject) => {
    let meeting = new Meeting({
      meetingId: shortId.generate(),
      subject: req.body.subject,
      description: req.body.description,
      adminId: req.body.adminId,
      adminName: req.body.adminName,
      userId: req.body.userId,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      location: req.body.location,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });

    meeting.save((err, newMeeting) => {
      if (err) {
        logger.error(
          err.message,
          "meetingController: createMeeting()/create()",
          10
        );
        reject(
          response.generate(
            true,
            "Error occured while creating meeting.",
            500,
            null
          )
        );
      } else {
        let newMeetingObj = newMeeting.toObject();
        setTimeout(
          () => mailer.sendMeetingConfirmationEmail(newMeetingObj),
          1500
        );
        resolve(newMeetingObj);
      }
    });
  });
};

let findMeeting = (req, res) => {
  return new Promise((resolve, reject) => {
    if (check.isEmpty(req.body.meetingId)) {
      logger.info(
        "Meeting Id is missing.",
        "meetingController: updateMeeting()/findMeeting()",
        7
      );
      reject(response.generate(true, "Parameter(s) is missing.", 400, null));
    } else {
      Meeting.findOne({ meetingId: req.body.meetingId }).exec(
        (err, meetingDetails) => {
          if (err) {
            logger.error(
              err.message,
              "meetingController/meetingLib: findMeeting()",
              10
            );
            reject(
              response.generate(
                true,
                "Error occured while finding meeting.",
                500,
                null
              )
            );
          } else if (check.isEmpty(meetingDetails)) {
            logger.info(
              "Meeting not found.",
              "meetingController/meetingLib: findMeeting()",
              7
            );
            reject(response.generate(true, "Meeting not found.", 404, null));
          } else {
            console.log(meetingDetails);
            resolve(meetingDetails);
          }
        }
      );
    }
  });
};

let update = (req, meetingDetails) => {
  return new Promise((resolve, reject) => {
    req.body.updatedOn = time.getLocalTime();
    let options = req.body;
    Meeting.update({ meetingId: meetingDetails.meetingId }, options).exec(
      (err, result) => {
        if (err) {
          logger.error(
            err.message,
            "meetingController: updateMeeting()/update()",
            10
          );
          reject(
            response.generate(
              true,
              "Error occured while updating meeting.",
              500,
              null
            )
          );
        } else if (check.isEmpty(result)) {
          logger.info(
            "Meeting not found.",
            "meetingController: updateMeeting()/udpate()",
            7
          );
          reject(response.generate(true, "Meeting not found.", 404, null));
        } else {
          setTimeout(() =>
            mailer.sendMeetingUpdateEmail(meetingDetails, options)
          );

          resolve(result);
        }
      }
    );
  });
};

let deleteMeeting = meetingDetails => {
  return new Promise((resolve, reject) => {
    Meeting.remove({ meetingId: meetingDetails.meetingId }).exec(
      (err, result) => {
        if (err) {
          logger.error(
            err.message,
            "meetingController: deleteMeeting()/deleteMeetingDetails()",
            10
          );
          reject(
            response.generate(
              true,
              "Error occured while deleting meeting.",
              500,
              null
            )
          );
        } else if (check.isEmpty(result)) {
          logger.info(
            "Meeting not found.",
            "meetingController:deleteMeeting()/deleteMeetingDetails()",
            7
          );
          reject(response.generate(true, "Meeting not found.", 404, null));
        } else {
          setTimeout(() => mailer.sendMeetingDeleteEmail(meetingDetails));
          resolve(result);
        }
      }
    );
  });
};

let findAllMeetings = userDetails => {
  return new Promise((resolve, reject) => {
    Meeting.find({ userId: userDetails.userId })
      .select()
      .lean()
      .exec((err, allMeetingDetails) => {
        if (err) {
          logger.error(
            err.message,
            "meetingController: getAllMeetings()/findAllMeetings()",
            10
          );
          reject(
            response.generate(
              true,
              "Error occured while finding all meetings.",
              500,
              null
            )
          );
        } else if (check.isEmpty(allMeetingDetails)) {
          logger.info(
            "Meetings not found.",
            "meetingController: getAllMeetings()/findAllMeetings()",
            7
          );
          reject(response.generate(true, "Meetings not found.", 404, null));
        } else {
          resolve(allMeetingDetails);
        }
      });
  });
};

module.exports = {
  create: create,
  update: update,
  findMeeting: findMeeting,
  findAllMeetings: findAllMeetings,
  deleteMeeting: deleteMeeting
};
