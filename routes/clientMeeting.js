const express = require("express");
const addMeeting = require("../controller/clientMeeting/Addmeeting");
const getAllMeetings = require("../controller/clientMeeting/GetallmeetingfroClients");
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
  .get(getAllMeetings)
  .post(authorizationMW("canAddMeeting"), addMeeting);

router
  .route("/:id")
  .put(
    authorizationMW("canUpdateMeeting"),
    update,
    validationResult,
    updateMeeting
  )
  .get(authorizationMW("canAddMeeting"), getMeetingByID)
  .delete(authorizationMW("canDeleteMeeting"), deleteMeeting);

module.exports = router;
