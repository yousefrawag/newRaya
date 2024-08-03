const express = require("express");
const router = express.Router();
const addCustomer = require("../controller/customers/addCustomer");
const getCustomers = require("../controller/customers/getCustomers");
const getCustomerByID = require("../controller/customers/getCustomerByID");
const updateCustomer = require("../controller/customers/updateCustomer");
const deleteCustomer = require("../controller/customers/deleteCustomer");
const validationResult = require("../middleware/validations/validatorResult");
const {
  insert,
  update,
} = require("../middleware/validations/customerValidator");
const multerUpload = require("../middleware/multer");

const authorizationMW = require("../middleware/authorizationMW");

router
  .route("/")
  .get(authorizationMW("canViewAllCustomers"), getCustomers)
  .post(
    authorizationMW("canAddCustomer"),
    multerUpload.single("image"),
    insert,
    validationResult,
    addCustomer
  )
  .put(
    authorizationMW("canUpdateCustomer"),
    multerUpload.single("image"),
    update,
    validationResult,
    updateCustomer
  );

router
  .route("/:id")
  .get(authorizationMW("canViewCustomerByID"), getCustomerByID)
  .delete(authorizationMW("canDeleteCustomer"), deleteCustomer);

module.exports = router;
