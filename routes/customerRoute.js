const express = require("express");
const router = express.Router();
const addCustomer = require("../controller/customers/addCustomer");
const getCustomers = require("../controller/customers/getCustomers");
const getCustomerByID = require("../controller/customers/getCustomerByID");
const updateCustomer = require("../controller/customers/updateCustomer");
const deleteCustomer = require("../controller/customers/deleteCustomer");
const SelectCustomer = require("../controller/customers/SelectCustomer")
const getUserCustomer = require("../controller/customers/userCustomer")
const uinqCoustomerData = require("../controller/customers/uinqCoustomerData")
const deleteSectionfloow = require("../controller/customers/delateCustomerflow")
const insertMany = require("../controller/customers/insertMany")
const validationResult = require("../middleware/validations/validatorResult");
const CustomerArchive = require("../controller/customers/Customerstatuts")
const GetCustomerArchived = require("../controller/customers/GetCustomerArchived")
const CustomerSales  = require("../controller/customers/CustomerSales")
const GetCustomerLeads = require("../controller/customers/GetCustomerLeads")
const protect = require("../middleware/authenticationMW")
const ConvertLead =  require("../controller/customers/ConvertLead")
const {advancedSearch} = require("../controller/customers/CustomerRecomandion")
const UserNextcustomernotvcation = require("../controller/customers/UserNextcustomernotvcation")
const CustomerSectionFlowTiemLine = require("../controller/customers/CustomerSectionFlowTiemLine")
const customerEmployeePreformance = require("../controller/customers/customerEmployeePreformance")
const brokersCustomers = require("../controller/customers/brokersCustomers")
const {
  insert,
  update,
} = require("../middleware/validations/customerValidator");
const multerUpload = require("../middleware/multer");

const authorizationMW = require("../middleware/authorizationMW");
// router.use(protect)
router.get("/journey-analytics" ,     protect ,
    authorizationMW("canViewClients"), CustomerSectionFlowTiemLine)
   router.get("/borkers-customers" ,     protect ,
    authorizationMW("canViewClients"), brokersCustomers) 
    router.get("/employee-customers-preforance" ,     protect ,
    authorizationMW("canViewClients"), customerEmployeePreformance)
router
  .route("/")
  .get( 
    protect ,
    authorizationMW("canViewClients"),
    getCustomers)
  .post(
      protect ,
    authorizationMW("canAddClients"),
    addCustomer
  )
  router.get("/recomandion" , advancedSearch)
  router.get("/nextreminder" ,protect , UserNextcustomernotvcation)
  router.put("/lead-convert/:id" , protect , ConvertLead)
  router.route("/leads").post(CustomerSales).get(protect ,GetCustomerLeads )
  router.post("/many" , protect , authorizationMW("canAddClients"), insertMany);
  // where any can select customers
router.get("/selectCustomer" ,protect , SelectCustomer )
router.get("/uinqData"  ,protect , uinqCoustomerData)
router.get("/userCustomer" ,protect ,  getUserCustomer)
router.put("/sectionfloow/:id" ,protect , deleteSectionfloow)
router.route("/customer-archive/:id").put(protect , CustomerArchive)
router.get("/customer-archived" ,protect , GetCustomerArchived)
router
  .route("/:id")
  .put(
    protect ,
    authorizationMW("canEditClients"),
 
    updateCustomer
  )
  .get(
    protect, 
    authorizationMW("canViewClients"), 
  getCustomerByID)
  .delete(
    protect ,
    authorizationMW("canDeleteClients"), 
    deleteCustomer);

module.exports = router;
