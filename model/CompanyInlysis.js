const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
 
    TotalpaymentVoucherMonthly: {
      type: Number,
   
    },
    TotalpaymentToday:{
      type:Number,
      default:0
      
    },
    TotalpaymentToday:{
        type:Number,
        default:0
        
      },
      TotalInvoicesMonthly:{
        type: Number,
        default:0
      },
      TotalInvoicestoday:{
        type: Number,
        default:0

      },
      TotalInvoices:{
        type: Number,
        default:0
      },
      TotalPaymentVoucher:{
        type: Number,
        default:0
      }
      
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("company", chatSchema);
