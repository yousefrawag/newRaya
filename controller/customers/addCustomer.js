const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");
function normalizePhoneNumber(phone) {
  if (!phone) return "";
  return phone.replace(/[^\d]/g, ""); // Remove everything except digits
}

const addCustomer = async (req, res, next) => {

    try {
      // Save the single customer data from req.body
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
       
        // customer.addBy = req.token.id
      await customer.save();
     res.status(200).json({
        message: `${customer.clientStatus} created successfully`,
        customer,
      });
      const admins = await userSchema.find({ type: "admin" });
      console.log(customer);
      // ✅ Create notifications properly
      const notifications = admins.map((admin) => {
        const notification = {
          user: admin._id,  // Ensure this is a number if required
          employee: req.token?.id,
          levels: "clients",
          type: "add",
          allowed: customer._id, // Use customer._id
          message: "تم إضافة عميل جديد",
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

module.exports = addCustomer;
