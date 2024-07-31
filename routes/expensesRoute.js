const express = require("express");
const addExpense = require("../controller/expenses/addExpense");
const getAllExpenses = require("../controller/expenses/getAllExpenses");
const updateExpense = require("../controller/expenses/updateExpense");
const deleteExpense = require("../controller/expenses/deleteExpense");
const getExpenseByID = require("../controller/expenses/getExpenseByID");
const validationResult = require("../middleware/validations/validatorResult");
const {
  insert,
  update,
} = require("../middleware/validations/expensesValidator");
const authorizationMW = require("../middleware/authorizationMW");

const router = express.Router();

router
  .route("/")
  .get(authorizationMW("canViewAllExpenses"), getAllExpenses)
  .post(authorizationMW("canAddExpense"), insert, validationResult, addExpense)
  .put(
    authorizationMW("canUpdateExpense"),
    update,
    validationResult,
    updateExpense
  );

router
  .route("/:id")
  .get(authorizationMW("canViewExpenseByID"), getExpenseByID)
  .delete(authorizationMW("canDeleteExpense"), deleteExpense);

module.exports = router;
