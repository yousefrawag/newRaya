const projectStatuts = require("../../model/projectStatuts")
const getAllStatuts = async (req , res) => {
    const allStatuts = await projectStatuts.find({}).sort({ createdAt: -1 })
    res.status(200).json({allStatuts})
}
module.exports = getAllStatuts