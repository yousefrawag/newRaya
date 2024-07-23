const express = require('express')
const Addpermission = require("../controler/permissions/Addpermission")
const Getallpermission = require('../controler/permissions/Getallpermission')
const Updatepermission = require('../controler/permissions/Updatepermission')
const DeletePermission = require('../controler/permissions/DeletePermission')
const Spacficpermission = require("../controler/permissions/Spacficpermission")
const autentcatuserLogin = require('../miidelware/authentcateuser')
const router = express.Router()
router.post("/add-permission" ,autentcatuserLogin ,Addpermission )
router.get('/' , autentcatuserLogin ,Getallpermission)
router.route('/:id').put(autentcatuserLogin,Updatepermission).delete(autentcatuserLogin,DeletePermission).get( autentcatuserLogin,Spacficpermission)
module.exports = router