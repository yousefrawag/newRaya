const {PrivacySecurity} = require("../model/PrivcySecurty");

const PrivcyControlleGet = async (req, res) => {
    try {
      const data = await PrivacySecurity.find({});
      res.status(200).json({ mesg: "privacy get" , data });
    } catch (error) {
      res.status(500).json({ mesg: "Error fetching privacy data", error });
    }
  };
  
  const PrivcyControllerUpdate = async (req, res) => {
    try {
      const { id } = req.params;
      const { details } = req.body;
  
      const updateNew = await PrivacySecurity.findByIdAndUpdate(
        id,
        { details },
        { new: true }
      );
  
      if (!updateNew) {
        return res.status(404).json({ mesg: "Policy not found" });
      }
  
      res.status(200).json({ mesg: "details updated", updateNew });
    } catch (error) {
      res.status(500).json({ mesg: "Error updating policy", error });
    }
  };
  
  module.exports = { PrivcyControllerUpdate, PrivcyControlleGet };
  