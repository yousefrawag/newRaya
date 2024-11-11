const express = require("express");
const AddpayVoucher = require("../controller/payVoucherController/AddpayVoucher");
const GetallPaymentVoucher = require("../controller/payVoucherController/GetallPaymentVoucher");
const UpdatePaymentvoucher = require("../controller/payVoucherController/UpdatePaymentvoucher");
const DeletePaymentVoucher = require("../controller/payVoucherController/DeletePaymentVoucher");
const SinagelPyemntVoucher = require("../controller/payVoucherController/SinagelPyemntVoucher");
const validationResult = require("../middleware/validations/validatorResult");
const {
  insert,
  update,
} = require("../middleware/validations/invoiceValidation");
const authorizationMW = require("../middleware/authorizationMW");

const router = express.Router();

router
  .route("/")
  .get(authorizationMW("canViewInvoices"), GetallPaymentVoucher)
  .post(
    authorizationMW("canAddInvoices"),
    AddpayVoucher
  );

router
  .route("/:id")
  .put(
    authorizationMW("canEditInvoices"),
    UpdatePaymentvoucher
  )
  .get(authorizationMW("canViewInvoices"), SinagelPyemntVoucher)
  .delete(authorizationMW("canDeleteInvoices"), DeletePaymentVoucher);

module.exports = router;
