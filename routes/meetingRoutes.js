const express = require("express");
const addMeeting = require("../controller/meeting/addMeeting");
const getAllMeetings = require("../controller/meeting/getAllMeetings");
const updateMeeting = require("../controller/meeting/updateMeeting");
const getMeetingByID = require("../controller/meeting/getMeetingByID");
const deleteMeeting = require("../controller/meeting/deleteMeeting");
const validationResult = require("../middleware/validations/validatorResult");
const {
  insert,
  update,
} = require("../middleware/validations/meetingValidator");
const authorizationMW = require("../middleware/authorizationMW");

const router = express.Router();

router
  .route("/")
  .get(authorizationMW("canViewAllMeetings"), getAllMeetings)
  .post(authorizationMW("canAddMeeting"), insert, validationResult, addMeeting)
  .put(authorizationMW("canUpdateMeeting"), update, validationResult, updateMeeting);

router
  .route("/:id")
  .get(authorizationMW("canViewMeetingByID"), getMeetingByID)
  .delete(authorizationMW("canDeleteMeeting"), deleteMeeting);

module.exports = router;
