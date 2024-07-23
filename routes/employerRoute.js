const express = require('express')
const router = express.Router()
const AddEmployer = require('../controler/employer/AddEmployer')
const GetallEmployer = require("../controler/employer/GetallEmployer")
const spasficEmployer = require('../controler/employer/spasficEmployer')
const updateEmployer = require('../controler/employer/updateEmployer')
const DeleteEmployer = require('../controler/employer/DeleteEmployer')
router.post("/add-employer" , AddEmployer)
router.get("/" , GetallEmployer)
router.route('/:id').get(spasficEmployer).put(updateEmployer).delete(DeleteEmployer)
module.exports = router