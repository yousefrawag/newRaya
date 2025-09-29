const mongoose = require("mongoose");
const file = mongoose.Schema(
  {
    fileURL: String,
    fileID: String,
  },
  { _id: false }
);
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
    endcontact:{

    type:String
    },
   notes:{
    type:String
   },
    docsURLs: [file],

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("deailyemployeeReport", DeailyemployeeReportsmodule);
