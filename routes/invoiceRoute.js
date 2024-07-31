const express = require("express");
const addInvoice = require("../controller/invoices/addInvoice");
const getAllInvoices = require("../controller/invoices/getAllInvoices");
const updateInvoice = require("../controller/invoices/updateInvoice");
const deleteInvoice = require("../controller/invoices/deleteInvoice");
const getInvoiceByID = require("../controller/invoices/getInvoiceByID");
const validationResult = require("../middleware/validations/validatorResult");
const {
  insert,
  update,
} = require("../middleware/validations/invoiceValidation");
const authorizationMW = require("../middleware/authorizationMW");

const router = express.Router();

router
  .route("/")
  .get(authorizationMW("canViewAllInvoices"), getAllInvoices)
  .post(authorizationMW("canAddInvoice"), insert, validationResult, addInvoice)
  .put(
    authorizationMW("canUpdateInvoice"),
    update,
    validationResult,
    updateInvoice
  );

router
  .route("/:id")
  .get(authorizationMW("canViewInvoiceByID"), getInvoiceByID)
  .delete(authorizationMW("canDeleteInvoice"), deleteInvoice);

module.exports = router;
