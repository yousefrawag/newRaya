const User = require("../../model/userSchema");

const customerEmployeePerformance = async (req, res, next) => {
  try {
    const { dateFilter = "monthly", employeeId } = req.query;

    /* ================= DATE ================= */
    const now = new Date();
    let currentStart, prevStart, prevEnd;

    if (dateFilter === "daily") {
      currentStart = new Date(now.setHours(0, 0, 0, 0));
      prevStart = new Date(currentStart);
      prevStart.setDate(prevStart.getDate() - 1);
      prevEnd = new Date(currentStart);
    } else if (dateFilter === "weekly") {
      const day = now.getDay();
      currentStart = new Date(now);
      currentStart.setDate(now.getDate() - day);
      currentStart.setHours(0, 0, 0, 0);

      prevStart = new Date(currentStart);
      prevStart.setDate(prevStart.getDate() - 7);
      prevEnd = new Date(currentStart);
    } else {
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEnd = new Date(currentStart);
    }

    let match = { type: "employee" };
    if (employeeId) match._id = Number(employeeId);

    const employees = await User.aggregate([
      { $match: match },

      /* ================= CLIENTS ================= */
      {
        $lookup: {
          from: "clients",
          let: { name: "$fullName" },
          pipeline: [
            { $match: { $expr: { $eq: ["$addBy", "$$name"] } } },
            {
              $facet: {
                current: [
                  { $match: { createdAt: { $gte: currentStart } } }
                ],
                previous: [
                  {
                    $match: {
                      createdAt: { $gte: prevStart, $lt: prevEnd }
                    }
                  }
                ]
              }
            }
          ],
          as: "clientsData"
        }
      },

      /* ================= FOLLOWUPS ================= */
      {
        $lookup: {
          from: "clients",
          let: { empId: "$_id" },
          pipeline: [
            { $unwind: "$SectionFollow" },
            {
              $match: {
                $expr: { $eq: ["$SectionFollow.user", "$$empId"] }
              }
            },
            {
              $facet: {
                current: [
                  {
                    $match: {
                      "SectionFollow.createdAt": { $gte: currentStart }
                    }
                  }
                ],
                previous: [
                  {
                    $match: {
                      "SectionFollow.createdAt": {
                        $gte: prevStart,
                        $lt: prevEnd
                      }
                    }
                  }
                ]
              }
            }
          ],
          as: "followData"
        }
      },

      /* ================= MISSIONS ================= */
      {
        $lookup: {
          from: "missions",
          let: { empId: "$_id" },
          pipeline: [
            {
              $addFields: {
                assignedSafe: {
                  $cond: [
                    { $isArray: "$assignedTo" },
                    "$assignedTo",
                    [{ $ifNull: ["$assignedTo", null] }]
                  ]
                }
              }
            },
            {
              $facet: {
                assignedCurrent: [
                  {
                    $match: {
                      $expr: { $in: ["$$empId", "$assignedSafe"] },
                      createdAt: { $gte: currentStart }
                    }
                  }
                ],
                assignedPrevious: [
                  {
                    $match: {
                      $expr: { $in: ["$$empId", "$assignedSafe"] },
                      createdAt: {
                        $gte: prevStart,
                        $lt: prevEnd
                      }
                    }
                  }
                ],
                createdCurrent: [
                  {
                    $match: {
                      $expr: { $eq: ["$assignedBy", "$$empId"] },
                      createdAt: { $gte: currentStart }
                    }
                  }
                ],
                createdPrevious: [
                  {
                    $match: {
                      $expr: { $eq: ["$assignedBy", "$$empId"] },
                      createdAt: {
                        $gte: prevStart,
                        $lt: prevEnd
                      }
                    }
                  }
                ]
              }
            }
          ],
          as: "missionData"
        }
      },

      /* ================= REPORTS ================= */
      {
        $lookup: {
          from: "deailyemployeereports",
          let: { empId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$addedBy", "$$empId"] }
              }
            },
            {
              $facet: {
                current: [
                  { $match: { createdAt: { $gte: currentStart } } }
                ],
                previous: [
                  {
                    $match: {
                      createdAt: { $gte: prevStart, $lt: prevEnd }
                    }
                  }
                ]
              }
            }
          ],
          as: "reportData"
        }
      },

      /* ================= FINAL SHAPE ================= */
      {
        $project: {
          fullName: 1,
          imageURL: 1,

          clients: {
            current: {
              $size: {
                $ifNull: [
                  { $arrayElemAt: ["$clientsData.current", 0] },
                  []
                ]
              }
            },
            previous: {
              $size: {
                $ifNull: [
                  { $arrayElemAt: ["$clientsData.previous", 0] },
                  []
                ]
              }
            }
          },

          followups: {
            totalCalls: {
              current: {
                $size: {
                  $ifNull: [
                    { $arrayElemAt: ["$followData.current", 0] },
                    []
                  ]
                }
              },
              previous: {
                $size: {
                  $ifNull: [
                    { $arrayElemAt: ["$followData.previous", 0] },
                    []
                  ]
                }
              }
            },

            meetings: {
              current: {
                $size: {
                  $filter: {
                    input: {
                      $ifNull: [
                        { $arrayElemAt: ["$followData.current", 0] },
                        []
                      ]
                    },
                    as: "f",
                    cond: {
                      $ifNull: ["$$f.SectionFollow.meeting", false]
                    }
                  }
                }
              },
              previous: {
                $size: {
                  $filter: {
                    input: {
                      $ifNull: [
                        { $arrayElemAt: ["$followData.previous", 0] },
                        []
                      ]
                    },
                    as: "f",
                    cond: {
                      $ifNull: ["$$f.SectionFollow.meeting", false]
                    }
                  }
                }
              }
            },

            requestedFollowups: {
              current: {
                $size: {
                  $filter: {
                    input: {
                      $ifNull: [
                        { $arrayElemAt: ["$followData.current", 0] },
                        []
                      ]
                    },
                    as: "f",
                    cond: {
                      $ifNull: [
                        "$$f.SectionFollow.nextReminderDate",
                        false
                      ]
                    }
                  }
                }
              },
              previous: {
                $size: {
                  $filter: {
                    input: {
                      $ifNull: [
                        { $arrayElemAt: ["$followData.previous", 0] },
                        []
                      ]
                    },
                    as: "f",
                    cond: {
                      $ifNull: [
                        "$$f.SectionFollow.nextReminderDate",
                        false
                      ]
                    }
                  }
                }
              }
            },

            uniqueClients: {
              current: {
                $size: {
                  $setUnion: [
                    {
                      $map: {
                        input: {
                          $ifNull: [
                            {
                              $arrayElemAt: ["$followData.current", 0]
                            },
                            []
                          ]
                        },
                        as: "f",
                        in: "$$f._id"
                      }
                    }
                  ]
                }
              },
              previous: {
                $size: {
                  $setUnion: [
                    {
                      $map: {
                        input: {
                          $ifNull: [
                            {
                              $arrayElemAt: ["$followData.previous", 0]
                            },
                            []
                          ]
                        },
                        as: "f",
                        in: "$$f._id"
                      }
                    }
                  ]
                }
              }
            }
          },

          missions: {
            assigned: {
              current: {
                $size: {
                  $ifNull: [
                    { $arrayElemAt: ["$missionData.assignedCurrent", 0] },
                    []
                  ]
                }
              },
              previous: {
                $size: {
                  $ifNull: [
                    { $arrayElemAt: ["$missionData.assignedPrevious", 0] },
                    []
                  ]
                }
              }
            },
            created: {
              current: {
                $size: {
                  $ifNull: [
                    { $arrayElemAt: ["$missionData.createdCurrent", 0] },
                    []
                  ]
                }
              },
              previous: {
                $size: {
                  $ifNull: [
                    { $arrayElemAt: ["$missionData.createdPrevious", 0] },
                    []
                  ]
                }
              }
            }
          },

          reports: {
            current: {
              $size: {
                $ifNull: [
                  { $arrayElemAt: ["$reportData.current", 0] },
                  []
                ]
              }
            },
            previous: {
              $size: {
                $ifNull: [
                  { $arrayElemAt: ["$reportData.previous", 0] },
                  []
                ]
              }
            }
          }
        }
      }
    ]);

    res.json({ success: true, data: employees });

  } catch (err) {
    next(err);
  }
};

module.exports = customerEmployeePerformance;