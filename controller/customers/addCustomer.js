const cloudinary = require("../../middleware/cloudinary");
const customerSchema = require("../../model/customerSchema");
const addCustomer = async (req, res, next) => {
  try {
    let customer = new customerSchema(req.body);
    if (req.file) {
      let { imageURL, imageID } = await cloudinary.upload(
        req.file.path,
        "customerImages"
      );
      customer.imageURL = imageURL;
      customer.imageID = imageID;
    }

    await customer.save();
    return res
      .status(200)
      .json({ message: `${customer.type} created successfully`, customer });
  } catch (error) {
    next(error);
  }
};

module.exports = addCustomer;
