const AplicationModule= require("../../model/AplicationModule")
const GetAplicationId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await AplicationModule.findById(id)

    res.status(200).json({mesg:"get full aplication data" ,  data });
  } catch (error) {
    next(error);
  }
};
module.exports = GetAplicationId;
