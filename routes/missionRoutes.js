const express = require("express");
const addMission = require("../controller/missions/addMission");
const getAllMissions = require("../controller/missions/getAllMissions");
const updateMission = require("../controller/missions/updateMission");
const deleteMission = require("../controller/missions/deleteMission");
const getMissionByID = require("../controller/missions/getMissionByID");
const userMissions = require("../controller/missions/userMissions");
const validationResult = require("../middleware/validations/validatorResult");
const {
  insert,
  update,
} = require("../middleware/validations/missionValidator");
const authorizationMW = require("../middleware/authorizationMW");
const missionsAddedToday = require("../controller/missions/missionsAddedToday");

const router = express.Router();

router.route("/users/:id").get(userMissions);
router.route("/missionsToday").get(missionsAddedToday);

router
  .route("/")
  .get(authorizationMW("canViewMissions"), getAllMissions)
  .post(
    authorizationMW("canAddMissions"),
    insert,
    validationResult,
    addMission
  );

router
  .route("/:id")
  .get(getMissionByID)
  .delete(authorizationMW("canDeleteMissions"), deleteMission)
  .put(
    authorizationMW("canEditMissions"),
    update,
    validationResult,
    updateMission
  );

module.exports = router;
