const express = require("express");
const router = express.Router();
const addCustomer = require("../controller/importexportCpntroller/AddImportClient");
const getCustomers = require("../controller/importexportCpntroller/GetImportClients");
const getCustomerByID = require("../controller/importexportCpntroller/CustomerOverview");
const updateCustomer = require("../controller/importexportCpntroller/UpdateCustomer");
const DelateClient = require("../controller/importexportCpntroller/DelateClient");
const protect = require("../middleware/authenticationMW")


const authorizationMW = require("../middleware/authorizationMW");
router.use(protect)


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
//   router.get("/customertpropertymatch/:id/:propertyId" ,GetmatchCustomersToProperties )
//   router.post("/broker-add" , protect ,  authorizationMW("canAddClients"), addCsutomerBroker)
//   router.get("/recomandion" , advancedSearch)
//   router.get("/nextreminder" ,protect , UserNextcustomernotvcation)
//   router.put("/lead-convert/:id" , protect , ConvertLead)
//   router.route("/leads").post(CustomerSales).get(protect ,GetCustomerLeads )
//   router.post("/drop-file" , protect , authorizationMW("canAddClients"), insertMany);
//   // where any can select customers
// router.get("/selectCustomer" ,protect , SelectCustomer )
// router.get("/uinqData"  ,protect , uinqCoustomerData)
// router.get("/userCustomer" ,protect ,  getUserCustomer)
// router.put("/sectionfloow/:id" ,protect , deleteSectionfloow)
// router.route("/customer-archive/:id").put(protect , CustomerArchive)
// router.get("/customer-archived" ,protect , GetCustomerArchived)
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
    DelateClient);

module.exports = router;
