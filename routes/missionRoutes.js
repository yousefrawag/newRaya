const express = require("express");
const router = express.Router();
const addMission = require("../controller/missions/addMission");
const getAllMissions = require("../controller/missions/getAllMissions");
const updateMission = require("../controller/missions/updateMission");
const deleteMission = require("../controller/missions/deleteMission");
const getMissionByID = require("../controller/missions/getMissionByID");
const userMissions = require("../controller/missions/userMissions");
const getProjectandusersmission = require("../controller/missions/getProjectandusersmission")
const validationResult = require("../middleware/validations/validatorResult");
const {
  insert,
  update,
} = require("../middleware/validations/missionValidator");
const authuserViewhasMission = require("../middleware/authuserViewhasMission")
const missionsAddedToday = require("../controller/missions/missionsAddedToday");
const protect = require("../middleware/authenticationMW")

const authorizationMW = require("../middleware/authorizationMW");

router.use(protect)
router.route("/users/:id").get(userMissions);
router.route("/missionsToday").get(missionsAddedToday);

router
  .route("/")
  .get(
    authorizationMW("canViewMissions"), 
  getAllMissions)
  .post(
    authorizationMW("canAddMissions"),
    // insert,
    // validationResult,
    addMission
  )
  router.get("/usersProjects" ,getProjectandusersmission)

router
  .route("/:id")
  .get(
    authuserViewhasMission("canViewMissions"), 
  getMissionByID)
  .delete(
    authorizationMW("canDeleteMissions"), 
  deleteMission)
  .put(
    authorizationMW("canEditMissions"),
    // update,
    // validationResult,
    updateMission
  );

module.exports = router;
