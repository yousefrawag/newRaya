const companyschema = require("../model/CompanyInlysis")
const InvoicesSchema = require("../model/invoiceSchema")
const expensess = require("../model/expensesSchema")
const pymentVoucher = require("../model/paymentVoucher")
const project = require("../model/projectSchema")
const privetProjectschema = require("../model/privetProjectschema")
const mission = require("../model/missionSchema")
const customersSchema = require("../model/customerSchema")
const userSchema = require("../model/userSchema")
const CompanyInlysis = async (req , res , next) =>{
const Totalexpenss = await expensess.find({})
const pymentVoucherTotal = await pymentVoucher.find({})
const invoicesTotal = await InvoicesSchema.find({})
const projecTotal = await project.find({})
const privetTotal = await privetProjectschema.find({})
const missionTotal = await mission.find({})
const customersTotal = await customersSchema.find({})
const users = await userSchema.find({})
const admins = users.filter((item) => item.type === "admin" );
const emplpyee = users.filter((item) => item.type === "employee")
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0); // Start of today
const todayEnd = new Date();
todayEnd.setHours(23, 59, 59, 999); // End of today

// Start and End of the Current Month
const monthStart = new Date(todayStart);
monthStart.setDate(1); // Start of the month
const monthEnd = new Date(monthStart);
monthEnd.setMonth(monthEnd.getMonth() + 1); // Move to the next month
monthEnd.setDate(0); // Last day of the current month
monthEnd.setHours(23, 59, 59, 999); // End of the current month
const Company = new companyschema()

Company.TotalpaymentVoucherMonthly = 0
Company.TotalpaymentToday = 0
Company.TotalInvoicesMonthly = 0
Company.TotalInvoicestoday = 0
Company.TotalInvoices = 0
Company.TotalPaymentVoucher = 0
const pymentVoucherToday = await pymentVoucher.aggregate([
    {
      $match: {
        createdAt: { $gte: todayStart, $lte: todayEnd }, // Filter by today
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$TotalPriceDolar" }, // Sum the "TotalPriceDolar" field
      },
    },
  ]);

  // Calculate Total Payment Vouchers for the Current Month
  const pymentVoucherMonthly = await pymentVoucher.aggregate([
    {
      $match: {
        createdAt: { $gte: monthStart, $lte: monthEnd }, // Filter by this month
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$TotalPriceDolar" },
      },
    },
  ]);

  // Calculate Total Invoices Today
  const invoicesToday = await InvoicesSchema.aggregate([
    {
      $match: {
        createdAt: { $gte: todayStart, $lte: todayEnd }, // Filter by today
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$TotalPriceDolar" }, // Sum the "TotalAmount" field
      },
    },
  ]);

  // Calculate Total Invoices for the Current Month
  const invoicesMonthly = await InvoicesSchema.aggregate([
    {
      $match: {
        createdAt: { $gte: monthStart, $lte: monthEnd }, // Filter by this month
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$TotalPriceDolar" },
      },
    },
  ]);
const TotalInvoices = await InvoicesSchema.aggregate([
    {
        $group: {
          _id: null,
          total: { $sum: "$TotalPriceDolar" }, // Sum the "TotalAmount" field
        },
      },
])
const TotalPaymentVoucher = await pymentVoucher.aggregate([
    {
        $group: {
          _id: null,
          total: { $sum: "$TotalPriceDolar" },
        },
      },  
])

  Company.TotalpaymentVoucherMonthly = pymentVoucherMonthly[0]?.total || 0
Company.TotalpaymentToday = pymentVoucherToday[0]?.total || 0
Company.TotalInvoicesMonthly = invoicesMonthly[0]?.total || 0
Company.TotalInvoicestoday = invoicesToday[0]?.total || 0
Company.TotalInvoices = TotalInvoices[0]?.total || 0
Company.TotalPaymentVoucher = TotalPaymentVoucher[0]?.total || 0
  await Company.save();
  res.status(200).json({Company ,pymentVoucherTotal:pymentVoucherTotal.length,invoicesTotal:invoicesTotal.length, customersTotal:customersTotal.length ,emplpyee:emplpyee.length ,admins:admins.length,missionTotal ,privetTotal:privetTotal.length, projecTotal:projecTotal.length,Totalexpenss:Totalexpenss.length ,pymentVoucherTotal:pymentVoucherTotal.length ,invoicesTotal:invoicesTotal.length  ,  })
}
module.exports = CompanyInlysis