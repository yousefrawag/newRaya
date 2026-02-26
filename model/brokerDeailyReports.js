const mongoose = require("mongoose");
const file = mongoose.Schema(
  {
    fileURL: String,
    fileID: String,
  },
  { _id: false }
);
const deailyeBrokerReport = mongoose.Schema(
  {
    
    ReportType: {
      type: String,
    
    },
    ReportTypeDescriep:{
 type: String,
    } ,
   Customer:    {
      type: mongoose.Schema.Types.ObjectId,
           ref: "clients",
      },
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
    imagesURLs: [file],
    videosURLs: [file],
    docsURLs: [file],

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("deailyeBrokerReport", deailyeBrokerReport);
