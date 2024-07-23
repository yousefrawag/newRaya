const express = require("express");
const router = express.Router();
const AddProject = require('../controler/projectController/AddProject')
const GetallProjects = require('../controler/projectController/GetProjects')
const GetspasficProject = require('../controler/projectController/GetspasficProject')
const DeleteProject = require('../controler/projectController/DeleteProject')
const updateProject = require('../controler/projectController/updateProject')
const UserProjects = require('../controler/projectController/UserProjects')
const autentcatuserLogin = require('../miidelware/authentcateuser')
router.post('/new-project' , autentcatuserLogin ,AddProject)
router.route('/').get(autentcatuserLogin,GetallProjects)
router.route('/:id').get(autentcatuserLogin,GetspasficProject).delete(autentcatuserLogin,DeleteProject).put(autentcatuserLogin,updateProject)
router.get('/project-by-user/:id' , autentcatuserLogin ,UserProjects)
module.exports = router;