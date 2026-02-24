const Customer = require("../../model/customerSchema");

const customerEmployeePerformance = async (req, res, next) => {
  try {
    const { dateFilter, employeeId, clientStatus } = req.query;

    console.log("Received Filters:", { dateFilter, employeeId, clientStatus });

    /* ================== 1. تحديد التواريخ ================== */
    const now = new Date();
    let currentStart, currentEnd, previousStart, previousEnd;

    if (dateFilter === "daily") {
      // اليوم
      currentStart = new Date(now);
      currentStart.setHours(0, 0, 0, 0);
      currentEnd = new Date(now);
      currentEnd.setHours(23, 59, 59, 999);
      
      // أمس
      previousStart = new Date(currentStart);
      previousStart.setDate(previousStart.getDate() - 1);
      previousEnd = new Date(currentStart);
      previousEnd.setSeconds(previousEnd.getSeconds() - 1);
    } 
    else if (dateFilter === "weekly") {
      // آخر 7 أيام
      currentEnd = new Date(now);
      currentEnd.setHours(23, 59, 59, 999);
      currentStart = new Date(now);
      currentStart.setDate(currentStart.getDate() - 7);
      currentStart.setHours(0, 0, 0, 0);
      
      // الـ 7 أيام قبل كده
      previousEnd = new Date(currentStart);
      previousEnd.setHours(23, 59, 59, 999);
      previousStart = new Date(currentStart);
      previousStart.setDate(previousStart.getDate() - 7);
      previousStart.setHours(0, 0, 0, 0);
    } 
    else if (dateFilter === "monthly") {
      // الشهر الحالي
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      currentStart.setHours(0, 0, 0, 0);
      currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      currentEnd.setHours(23, 59, 59, 999);
      
      // الشهر اللي فات
      previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousStart.setHours(0, 0, 0, 0);
      previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      previousEnd.setHours(23, 59, 59, 999);
    } 
    else if (dateFilter === "yearly") {
      // السنة الحالية
      currentStart = new Date(now.getFullYear(), 0, 1);
      currentStart.setHours(0, 0, 0, 0);
      currentEnd = new Date(now.getFullYear(), 11, 31);
      currentEnd.setHours(23, 59, 59, 999);
      
      // السنة اللي فاتت
      previousStart = new Date(now.getFullYear() - 1, 0, 1);
      previousStart.setHours(0, 0, 0, 0);
      previousEnd = new Date(now.getFullYear() - 1, 11, 31);
      previousEnd.setHours(23, 59, 59, 999);
    } 
    else {
      // افتراضي: monthly
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      currentStart.setHours(0, 0, 0, 0);
      currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      currentEnd.setHours(23, 59, 59, 999);
      
      previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousStart.setHours(0, 0, 0, 0);
      previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      previousEnd.setHours(23, 59, 59, 999);
    }

    console.log("Current Period:", currentStart, "to", currentEnd);

    /* ================== 2. دالة جلب بيانات المتابعات ================== */
    const getFollowUpData = async (start, end) => {
      // بناء الـ match للمتابعات فقط
      const matchStage = {
        "SectionFollow.createdAt": { $gte: start, $lte: end }
      };

      if (employeeId) {
        matchStage["SectionFollow.user"] = Number(employeeId);
      }
      
      if (clientStatus) {
        matchStage["SectionFollow.CustomerDealsatuts"] = clientStatus;
      }

      const pipeline = [
        { $unwind: { path: "$SectionFollow", preserveNullAndEmptyArrays: false } },
        { $match: matchStage },
        {
          $addFields: {
            callResult: {
              $ifNull: [
                "$SectionFollow.ReportTypeDescriep",
                "$SectionFollow.ReportType"
              ]
            },
            isFollowUp: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$SectionFollow.nextReminderDate", null] },
                    { $ne: ["$SectionFollow.nextReminderDate", ""] }
                  ]
                },
                1,
                0
              ]
            }
          }
        },
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,
                  totalContacts: { $sum: 1 },
                  responses: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $ne: ["$callResult", "لا يرد"] },
                            { $ne: ["$callResult", null] },
                            { $ne: ["$callResult", ""] }
                          ]
                        },
                        1,
                        0
                      ]
                    }
                  },
                  noAnswer: {
                    $sum: {
                      $cond: [
                        { $eq: ["$callResult", "لا يرد"] },
                        1,
                        0
                      ]
                    }
                  },
                  followUps: { $sum: "$isFollowUp" }
                }
              }
            ],
            employees: [
              {
                $group: {
                  _id: "$SectionFollow.user",
                  totalCalls: { $sum: 1 },
                  responses: {
                    $sum: {
                      $cond: [
                        { $ne: ["$callResult", "لا يرد"] },
                        1,
                        0
                      ]
                    }
                  },
                  noAnswer: {
                    $sum: {
                      $cond: [
                        { $eq: ["$callResult", "لا يرد"] },
                        1,
                        0
                      ]
                    }
                  },
                  followUps: { $sum: "$isFollowUp" }
                }
              },
              {
                $project: {
                  employeeId: "$_id",
                  _id: 0,
                  totalCalls: 1,
                  responses: 1,
                  noAnswer: 1,
                  followUps: 1
                }
              }
            ],
            clients: [
              {
                $group: {
                  _id: "$_id",
                  fullName: { $first: "$fullName" },
                  phoneNumber: { $first: "$phoneNumber" },
                  currentDealStatus: { $first: "$SectionFollow.CustomerDealsatuts" },
                  callResult: { $first: "$callResult" },
                  lastContact: { $first: "$SectionFollow.createdAt" },
                  employeeId: { $first: "$SectionFollow.user" },
                  hasFollowUp: { $first: "$isFollowUp" }
                }
              },
              { $sort: { lastContact: -1 } }
            ]
          }
        }
      ];

      const result = await Customer.aggregate(pipeline);
      return result[0] || { summary: [{}], employees: [], clients: [] };
    };

    /* ================== 3. دالة جلب بيانات الاجتماعات ================== */
    const getMeetingsData = async (start, end) => {
      // الاجتماعات على مستوى العميل باستخدام customerDate
      const matchStage = {
        customerDate: { $gte: start, $lte: end }  // هنا بقى customerDate بتاع العميل نفسه
      };

      if (employeeId) {
        // محتاج نعرف إزاي الاجتماع مربوط بالموظف
        // هل في حقل بيدل على مين الموظف المسؤول عن الاجتماع؟
        // مؤقتاً هسيبها كده لحد ما تقولي
      }

      const pipeline = [
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalMeetings: { $sum: 1 },
            clients: { $addToSet: "$_id" }
          }
        }
      ];

      const result = await Customer.aggregate(pipeline);
      return {
        totalMeetings: result[0]?.totalMeetings || 0,
        clientsWithMeetings: result[0]?.clients || []
      };
    };

    /* ================== 4. جلب البيانات ================== */
    const [currentFollowUps, previousFollowUps, currentMeetings, previousMeetings] = await Promise.all([
      getFollowUpData(currentStart, currentEnd),
      getFollowUpData(previousStart, previousEnd),
      getMeetingsData(currentStart, currentEnd),
      getMeetingsData(previousStart, previousEnd)
    ]);

    console.log("Current FollowUps Summary:", currentFollowUps.summary);
    console.log("Current Meetings:", currentMeetings.totalMeetings);

    /* ================== 5. تجهيز النتائج ================== */
    const currentSummary = currentFollowUps.summary[0] || {
      totalContacts: 0,
      responses: 0,
      noAnswer: 0,
      followUps: 0
    };
    
    const previousSummary = previousFollowUps.summary[0] || {
      totalContacts: 0,
      responses: 0,
      followUps: 0
    };

    // دالة حساب النسبة المئوية للتغير
    const calculatePercentChange = (current, previous) => {
      if (previous === 0) return current > 0 ? "+100%" : "0%";
      const change = ((current - previous) / previous) * 100;
      return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
    };

    /* ================== 6. إخراج النتيجة النهائية ================== */
    res.status(200).json({
      summary: {
        totalContacts: currentSummary.totalContacts,
        responses: currentSummary.responses,
        noAnswer: currentSummary.noAnswer,
        meetings: currentMeetings.totalMeetings,    // هنا بقى من customerDate
        followUps: currentSummary.followUps,
        convertedClients: 0,
        conversionRate: "0%"
      },
      employees: currentFollowUps.employees || [],
      clients: (currentFollowUps.clients || []).map(client => ({
        id: client._id,
        fullName: client.fullName || "غير معروف",
        phone: client.phoneNumber || "غير متوفر",
        currentDealStatus: client.currentDealStatus || "غير محدد",
        callResult: client.callResult || "لا يوجد",
        lastContact: client.lastContact,
        employeeId: client.employeeId,
        hasFollowUp: client.hasFollowUp === 1,
        hasMeeting: currentMeetings.clientsWithMeetings.includes(client._id) // هل عنده اجتماع في الفترة دي؟
      })),
      comparison: {
        current: {
          totalContacts: currentSummary.totalContacts,
          responses: currentSummary.responses,
          meetings: currentMeetings.totalMeetings,
          followUps: currentSummary.followUps,
          convertedClients: 0
        },
        previous: {
          totalContacts: previousSummary.totalContacts,
          responses: previousSummary.responses,
          meetings: previousMeetings.totalMeetings,
          followUps: previousSummary.followUps,
          convertedClients: 0
        },
        change: {
          totalContacts: calculatePercentChange(
            currentSummary.totalContacts,
            previousSummary.totalContacts
          ),
          responses: calculatePercentChange(
            currentSummary.responses,
            previousSummary.responses
          ),
          meetings: calculatePercentChange(
            currentMeetings.totalMeetings,
            previousMeetings.totalMeetings
          ),
          followUps: calculatePercentChange(
            currentSummary.followUps,
            previousSummary.followUps
          ),
          convertedClients: "0%"
        }
      },
      period: {
        current: { from: currentStart, to: currentEnd },
        previous: { from: previousStart, to: previousEnd }
      }
    });

  } catch (error) {
    console.error("Error in customerEmployeePerformance:", error);
    next(error);
  }
};

module.exports = customerEmployeePerformance;