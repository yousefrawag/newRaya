const DeailyReportsmodule = require("../../model/DeailyReports");
const addNewdeaily = async ( id ) => {
    const loginTime = new Date(); // Current time
    try {
      const userDaily = await DeailyReportsmodule.create({
        employeeID: id,
        login: loginTime,
      });
      return userDaily;
    } catch (error) {
      throw new Error("Error creating daily report: " + error.message);
    }
};
module.exports = addNewdeaily;
