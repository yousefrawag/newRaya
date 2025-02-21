const Mission = require("../model/missionSchema");
const User = require("../model/userSchema");
const Project = require("../model/projectSchema");
const Customer = require("../model/customerSchema");
const Service = require("../model/Services");
const Visa = require("../model/Visamodule");
const privetProjectschema = require("../model/privetProjectschema");

const getDashboardStats = async (req, res) => {
  try {
    // 🔹 Mission Stats
    const completedTasks = await Mission.countDocuments({ status: "مكتملة" });
    const inProgressTasks = await Mission.countDocuments({ status: "فى تقدم" });
    const closedTasks = await Mission.countDocuments({ status: "مغلقة" });
    const totalMissions = await Mission.countDocuments();
    const customerFinancialStats = await Customer.aggregate([
      {
        $group: {
          _id: null, // Group all documents together
          totalSum: { $sum: "$total" }, // Sum of all "total" fields
          totalArrivedCash: { $sum: "$Arrievcashe" }, // Sum of all "Arrievcashe" fields
          totalInProgressCash: { $sum: "$inprocessCashe" }, // Sum of all "inprocessCashe" fields
        },
      },
    ]);
    
    // If there are no customers, return default values
    const stats = customerFinancialStats[0] || { totalSum: 0, totalArrivedCash: 0, totalInProgressCash: 0 }
    
    // 🔹 General Stats
    const totalCustomers = await Customer.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalEmployees = await User.countDocuments({ type: "employee" });
    const totalAdmins = await User.countDocuments({ type: "admin" });
    const totlaProjects = await Project.countDocuments()
    const totalPrivetproject = await privetProjectschema.countDocuments()
    const totalVisa = await Visa.countDocuments()
    const sectionCustomerCounts = await Project.aggregate([
      {
        $lookup: {
          from: "sections", // Join with the 'sections' collection
          localField: "section",
          foreignField: "_id",
          as: "sectionDetails",
        },
      },
      { $unwind: "$sectionDetails" }, // Convert array to object
      {
        $group: {
          _id: "$section",
          sectionName: { $first: "$sectionDetails.name" },
          sectionId: { $first: "$sectionDetails._id" },
          customerCount: { $sum: 1 }, // Count customers in each section
        },
      },
      { $sort: { customerCount: -1 } } // Sort by most customers
    ]);
    
    // Now return it in the response

    // 🔹 Get Top 10 Users Who Added the Most Customers
    const topUsers = await Customer.aggregate([
      { $group: { _id: "$addBy", totalCustomers: { $sum: 1 } } }, // Count customers per user
      { $sort: { totalCustomers: -1 } }, // Sort by most customers added
      { $limit: 10 }, // Get top 10 users
      {
        $lookup: {
          from: "users", // Join with users collection
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" }, // Convert array to object
      {
        $project: {
          _id: 1,
          totalCustomers: 1,
          "userDetails.name": 1,
          "userDetails.imageURL": 1, // Get name and image
        },
      },
    ]);

    // 🔹 Send Response
    res.json({
      success: true,
      missionStats: {
        completedTasks,
        inProgressTasks,
        closedTasks,
        totalMissions,
      },
      
      generalStats: {
        totalCustomers,
        totalServices,
        totalUsers,
        totalEmployees,
        totalAdmins,
        totlaProjects,
        totalPrivetproject,
        totalVisa
      },
      topUsers,
      sectionCustomerCounts ,
      financialStats: stats,
     
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getDashboardStats };
