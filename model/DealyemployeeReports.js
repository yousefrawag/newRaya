const mongoose = require("mongoose");

const DeailyemployeeReportsmodule = mongoose.Schema(
  {
    
    ReportType: {
      type: String,
    
    },
   Customers:[
        {
      type: mongoose.Schema.Types.ObjectId,
           ref: "clients",
      }
   ],
      addedBy: {
      type: Number,
   
         ref: "users",
    },
   notes:{
    type:String
   },


  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("deailyemployeeReport", DeailyemployeeReportsmodule);
