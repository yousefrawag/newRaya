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
  .get(authorizationMW("canViewExpenses"), getAllExpenses)
  .post(
    authorizationMW("canAddExpenses"),
    insert,
    validationResult,
    addExpense
  );

router
  .route("/:id")
  .put(
    authorizationMW("canEditExpenses"),
    update,
    validationResult,
    updateExpense
  )
  .get(authorizationMW("canViewExpenses"), getExpenseByID)
  .delete(authorizationMW("canDeleteExpenses"), deleteExpense);

module.exports = router;
