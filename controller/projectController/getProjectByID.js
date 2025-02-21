const projectSchema = require("../../model/projectSchema");
const getProjectByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await projectSchema.findById(id).populate("customers").populate("section")

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
module.exports = getProjectByID;
