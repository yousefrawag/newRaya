const express = require('express')
const AddExpenses = require("../controler/expenses/AddExpenses")
const GetallExpenses = require('../controler/expenses/GetallExpenses')
const updateexpenses = require('../controler/expenses/updateexpenses')
const Deleteexpenses = require('../controler/expenses/Deleteexpenses')
const spasficExpenses = require("../controler/expenses/spasficExpenses")
const router = express.Router()
router.post("/add-expenses" , AddExpenses )
router.get('/' , GetallExpenses)
router.route('/:id').put(updateexpenses).delete(Deleteexpenses).get(spasficExpenses)
module.exports = router