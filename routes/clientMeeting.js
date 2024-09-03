const express = require("express");
const addMeeting = require("../controller/clientMeeting/Addmeeting");
const getAllMeetings = require("../controller/clientMeeting/GetallmeetingfroClients");
const updateMeeting = require("../controller/clientMeeting/Updatemeeting");
const getMeetingByID = require("../controller/clientMeeting/getSapsficMeeting");
const uinqDataMeeting = require("../controller/clientMeeting/uinqDataMeeting")
const deleteMeeting = require("../controller/clientMeeting/DeeletClientMeeting");
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
router.get("/uinqData" , uinqDataMeeting)
router
  .route("/:id")
  .put(
    authorizationMW("canUpdateMeeting"),
    updateMeeting
  )
  .get(authorizationMW("canAddMeeting"), getMeetingByID)
  .delete(authorizationMW("canDeleteMeeting"), deleteMeeting);

module.exports = router;
