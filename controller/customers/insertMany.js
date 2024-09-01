const customerSchema = require("../../model/customerSchema");
const insertMany  = async (req  ,res) => {
    try {
        const custmoers = req.body;
    
        await customerSchema.insertMany(custmoers);
      } catch (err) {
        console.error("jokes-bulk-insert error: ", err);
        res.status(500).json({ success: false, message: "internal_server_error" });
      }
   
}
module.exports = insertMany