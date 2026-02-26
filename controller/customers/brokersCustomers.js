const customerSchema = require("../../model/customerSchema");
const projectschema = require("../../model/projectSchema")
const userSchema = require("../../model/userSchema")
const brokersCustomers = async (req, res, next) => {
  try {
    const { field, searTerm , startDate , endDate } = req.query;
    const id = req.token.id
    const user = await userSchema.findById(id)
    const CurrentPermission = user?.role === 9
    
    let filters = { 
      ArchievStatuts: { $in: [false, null] },
      moduleType: "underReview"  // فقط underReview
    };
    
    if(!(user.type === "admin" || CurrentPermission)) {
      // لو مش أدمن، يضيف فلتر باسم المستخدم
      filters = {
        ...filters,
        addBy: {
          $regex: new RegExp(`(^|\\s|\\/)+${user?.fullName.trim()}($|\\s|\\/)`, 'i')
        }
      };     
    }
    
    const clients = await customerSchema.aggregate([
      {
        $match: {
          ...filters,
          ...(startDate && endDate && {
            SectionFollow: {
              $elemMatch: {
                detailsDate: {
                  $gte: new Date(startDate),
                  $lte: new Date(endDate)
                }
              }
            }
          })
        }
      },
      {
        $addFields: {
          lastFollowUpdate: {
            $max: "$SectionFollow.createdAt"
          }
        }
      },
      { $sort: { lastFollowUpdate: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "SectionFollow.user",
          foreignField: "_id",
          as: "SectionFollowUsers"
        }
      }
    ]);

    res.status(200).json({ data: clients });
  } catch (error) {
    next(error);
  }
};

module.exports = brokersCustomers;