const mongoose = require("mongoose");

const DeailyReportsmodule = mongoose.Schema(
  {
    
    employeeID: {
      type: Number,
      ref: "users",
    },
   login:{
    type:Date
   },
   logout:{
    type:Date
   },
   totaHours:{
    type:Number
   }

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("deailyReport", DeailyReportsmodule);
