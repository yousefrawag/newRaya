const customerSchema = require("../../model/ImportCustomers");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");


function normalizePhoneNumber(phone) {
  if (!phone) return "";
  return phone.replace(/[^\d]/g, ""); // Remove everything except digits
}

const AddImportClient = async (req, res, next) => {

    try {
      // Save the single customer data from req.body
         const id = req.token.id
          const user = await userSchema.findById(id)
      const {phoneNumber} = req.body

     const normalizedPhone = normalizePhoneNumber(phoneNumber);

    const foundUser = await customerSchema.findOne({
      phoneNumber: normalizedPhone,
    });
      if(foundUser) {
    
        
        return res.status(404).json({mesg:"userfound"})
      }
        req.body.phoneNumber = normalizedPhone;
      let customer = new customerSchema(req.body);
      if(req.body.SectionFollow){
        customer.SectionFollow[0].user = req.token.id
      }

      if(user?.type === "brokker") {
        //underReview
        customer.moduleType ="underReview"
      }else {
  customer.moduleType ="customer"
      }
     customer.addBy = id
        // customer.addBy = req.token.id
      await customer.save();
   
     res.status(200).json({
        message: `${customer.clientStatus} created successfully`,
        customer,
      });
    const admins = await userSchema.find({
  $or: [{ type: "admin" }, { role: 9 }]
});

      console.log(customer);
      // ✅ Create notifications properly
      const notifications = admins.map((admin) => {
        const notification = {
          user: admin._id,  // Ensure this is a number if required
          employee: req.token?.id,
          levels: "importclients",
          type: "add",
          allowed: customer._id, // Use customer._id
          message: "تم إضافة عميل استيراد وتصدير جديد",
        };
        console.log("Notification being created:", notification); // Log the notification
        return notification;
      });
      
      // ✅ Save notifications
      await notificationSchema.insertMany(notifications);
     
    } catch (error) {
      throw new Error(error)
    }
  
};

module.exports = AddImportClient;
