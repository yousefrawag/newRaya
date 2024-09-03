const express = require("express");
const addInvoice = require("../controller/invoices/addInvoice");
const getAllInvoices = require("../controller/invoices/getAllInvoices");
const updateInvoice = require("../controller/invoices/updateInvoice");
const deleteInvoice = require("../controller/invoices/deleteInvoice");
const getInvoiceByID = require("../controller/invoices/getInvoiceByID");
const getUnquedata = require("../controller/invoices/getUnquedata")
const getInvoiceAndMissionDates = require("../controller/invoices/getInvoiceAndMissionDates");
const validationResult = require("../middleware/validations/validatorResult");
const {
  insert,
  update,
} = require("../middleware/validations/invoiceValidation");
const authorizationMW = require("../middleware/authorizationMW");

const router = express.Router();
router.route("/getInvoiceAndMissionDates").get(getInvoiceAndMissionDates);
router
  .route("/")
  .get(authorizationMW("canViewInvoices"), getAllInvoices)
  .post(
    authorizationMW("canAddInvoices"),
    insert,
    validationResult,
    addInvoice
  );
router.get("/uinqData" , getUnquedata)
router
  .route("/:id")
  .put(
    authorizationMW("canEditInvoices"),
    update,
    validationResult,
    updateInvoice
  )
  .get(authorizationMW("canViewInvoices"), getInvoiceByID)
  .delete(authorizationMW("canDeleteInvoices"), deleteInvoice);

module.exports = router;
