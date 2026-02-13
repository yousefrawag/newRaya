const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");
const mongoose = require("mongoose");

const CustomerSectionFlowTiemLine = async (req, res, next) => {
  try {
    const { 
      dateFilter = "all",
      clientStatus, 
      employeeId, 
      segmentType 
    } = req.query;
    
    const id = req.token.id;
    const user = await userSchema.findById(id);
    const CurrentPermission = user?.role === 9;
    
    // بناء فلتر العملاء الأساسي
    let customerFilters = {
      ArchievStatuts: { $in: [false, null] },
      moduleType: { $in: ["customer", null] }
    };
    
    if (!(user.type === "admin" || CurrentPermission)) {
      customerFilters.addBy = {
        $regex: new RegExp(`(^|\\s|\\/)+${user?.fullName?.trim()}($|\\s|\\/)`, 'i')
      };
    }

    // ✅ التحقق من صحة employeeId
    let employeeIdFilter = [];
    if (employeeId && employeeId !== 'all') {
      const employeeIdNumber = parseInt(employeeId);
      if (!isNaN(employeeIdNumber) && employeeIdNumber > 0) {
        employeeIdFilter = [{
          $match: {
            "SectionFollow.user": employeeIdNumber
          }
        }];
      }
    }

    // جلب العملاء
    const clients = await customerSchema.aggregate([
      { $match: customerFilters },
      
      {
        $addFields: {
          totalFollowups: { $size: { $ifNull: ["$SectionFollow", []] } }
        }
      },
      
      ...employeeIdFilter,
      
      ...(dateFilter !== 'all' ? [{
        $match: {
          "SectionFollow.createdAt": {
            $gte: getDateFilter(dateFilter)
          }
        }
      }] : []),
      
      {
        $lookup: {
          from: "users",
          localField: "SectionFollow.user",
          foreignField: "_id",
          as: "followUsers"
        }
      }
    ]);

    // تطبيق الفلاتر الإضافية
    let filteredClients = [...clients];
    
    if (clientStatus && clientStatus !== 'all') {
      filteredClients = filteredClients.filter(c => 
        c.SectionFollow?.some(f => f.CustomerDealsatuts === clientStatus)
      );
    }

    if (segmentType && segmentType !== 'all') {
      switch (segmentType) {
        case 'converted':
          filteredClients = filteredClients.filter(c => 
            c.SectionFollow?.some(f => f.CustomerDealsatuts === 'اشترى')
          );
          break;
        case 'vip':
          filteredClients = filteredClients.filter(c => 
            c.SectionFollow?.some(f => ['VIP', 'VIP+'].includes(f.CustomerDealsatuts))
          );
          break;
        case 'hot':
          filteredClients = filteredClients.filter(c => 
            c.SectionFollow?.some(f => ['محتمل', 'قيد التفاوض'].includes(f.CustomerDealsatuts))
          );
          break;
      }
    }

    // =============== التحليلات المطلوبة ===============
    
    const conversionRateByStatus = await calculateConversionRateByStatus(filteredClients);
    const employeePerformance = await evaluateEmployeePerformance(filteredClients);
    const customersNeedingFollowup = await analyzeCustomersNeedingFollowup(filteredClients);
    const successPaths = await analyzeSuccessPaths(filteredClients);
    const recommendations = await generateRecommendations(filteredClients, employeePerformance);
    const predictedConversions = await predictConversions(filteredClients);
    const advancedStats = await calculateAdvancedStats(filteredClients, employeePerformance);
    
    // ✅ الدوال الجديدة فقط - بدون تغيير أي شيء في الدوال القديمة
    const employeeFollowupClassification = await getEmployeeFollowupClassification(filteredClients);
    const employeeFollowupDetails = await getEmployeeFollowupDetails(filteredClients);

    res.status(200).json({
      success: true,
      data: {
        customers: filteredClients,
        analytics: {
          // ✅ القديم كما هو
          conversionRateByStatus,
          employeePerformance,
          customersNeedingFollowup,
          successPaths,
          recommendations,
          predictedConversions,
          advancedStats,
          
          // ✅ الجديد مضاف فقط
          employeeFollowupClassification,
          employeeFollowupDetails
        }
      },
      metadata: {
        totalCustomers: filteredClients.length,
        dateRange: dateFilter,
        clientStatus: clientStatus || 'all',
        segmentType: segmentType || 'all',
        employeeId: employeeId || 'all',
        generatedAt: new Date()
      }
    });
    
  } catch (error) {
    console.error("Error in CustomerSectionFlowTiemLine:", error);
    next(error);
  }
};

// =============== دالة مساعدة للفلترة الزمنية ===============
function getDateFilter(dateFilter) {
  const now = new Date();
  switch (dateFilter) {
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    case 'quarter':
      return new Date(now.setMonth(now.getMonth() - 3));
    default:
      return new Date(0);
  }
}

// =============== 1. معدل التحويل لكل حالة - كما هي ===============
async function calculateConversionRateByStatus(clients) {
  const statusOrder = [
    "عدم الاتصال",
    "تم التواصل",
    "غير محتمل",
    "محتمل",
    "قيد التفاوض (على السعر / الشروط)",
    "VIP",
    "VIP+"
  ];

  const result = {};
  
  for (const status of statusOrder) {
    const customersWithStatus = new Set();
    const convertedFromStatus = new Set();
    
    clients.forEach(client => {
      if (!client.SectionFollow?.length) return;
      
      const follows = [...client.SectionFollow]
        .filter(f => f.CustomerDealsatuts)
        .sort((a, b) => new Date(a.createdAt || a.detailsDate) - new Date(b.createdAt || b.detailsDate));
      
      const hasPurchased = follows.some(f => f.CustomerDealsatuts === 'اشترى');
      const firstOccurrence = follows.findIndex(f => f.CustomerDealsatuts === status);
      
      if (firstOccurrence !== -1) {
        customersWithStatus.add(client._id.toString());
        
        if (hasPurchased) {
          const purchaseIndex = follows.findIndex(f => f.CustomerDealsatuts === 'اشترى');
          if (purchaseIndex > firstOccurrence) {
            convertedFromStatus.add(client._id.toString());
          }
        }
      }
    });
    
    const total = customersWithStatus.size;
    const converted = convertedFromStatus.size;
    
    result[status] = {
      totalCustomers: total,
      convertedCustomers: converted,
      conversionRate: total > 0 ? Number(((converted / total) * 100).toFixed(1)) : 0,
      averageDaysToConvert: await calculateAverageDaysToConvertFromStatus(clients, status)
    };
  }
  
  return result;
}

async function calculateAverageDaysToConvertFromStatus(clients, status) {
  let totalDays = 0;
  let count = 0;
  
  clients.forEach(client => {
    if (!client.SectionFollow?.length) return;
    
    const follows = [...client.SectionFollow]
      .filter(f => f.CustomerDealsatuts)
      .sort((a, b) => new Date(a.createdAt || a.detailsDate) - new Date(b.createdAt || b.detailsDate));
    
    const statusIndex = follows.findIndex(f => f.CustomerDealsatuts === status);
    const purchaseIndex = follows.findIndex(f => f.CustomerDealsatuts === 'اشترى');
    
    if (statusIndex !== -1 && purchaseIndex > statusIndex) {
      const statusDate = new Date(follows[statusIndex].createdAt || follows[statusIndex].detailsDate);
      const purchaseDate = new Date(follows[purchaseIndex].createdAt || follows[purchaseIndex].detailsDate);
      
      if (!isNaN(statusDate.getTime()) && !isNaN(purchaseDate.getTime())) {
        const days = Math.round((purchaseDate - statusDate) / (1000 * 60 * 60 * 24));
        if (days >= 0) {
          totalDays += days;
          count++;
        }
      }
    }
  });
  
  return count > 0 ? Number((totalDays / count).toFixed(1)) : 0;
}

// =============== 2. تقييم أداء الموظفين - كما هي ===============
const STATUS_SCORE = {
  "عدم الاتصال": 1,
  "تم التواصل": 2,
  "غير محتمل": 3,
  "محتمل": 4,
  "قيد التفاوض (على السعر / الشروط)": 5,
  "VIP": 6,
  "VIP+": 7,
  "اشترى": 8
};

// =============== 2. تقييم أداء الموظفين - بعد التعديل ===============

async function evaluateEmployeePerformance(clients) {
  const employeeStats = {};
  
  clients.forEach(client => {
    if (!client.SectionFollow?.length) return;
    
    const customerFollows = [...client.SectionFollow]
      .filter(f => f.user && f.CustomerDealsatuts)
      .sort((a, b) => new Date(a.createdAt || a.detailsDate) - new Date(b.createdAt || b.detailsDate));
    
    customerFollows.forEach((follow, index) => {
      const userId = follow.user;
      if (!userId) return;
      
      const userIdStr = userId.toString();
      
      if (!employeeStats[userIdStr]) {
        employeeStats[userIdStr] = {
          userId: userId,
          employeeName: '',
          totalFollowups: 0,
          customersFollowed: new Set(),
          customersConverted: new Set(),
          statusImprovements: 0,
          statusDegradations: 0,
          statusMaintained: 0,
          successfulInteractions: 0,
          failedInteractions: 0,
          totalResponseTime: 0,
          responseCount: 0,
          followupsByStatus: {},
          customerHistory: {}
        };
      }
      
      const stats = employeeStats[userIdStr];
      stats.totalFollowups++;
      stats.customersFollowed.add(client._id.toString());
      
      const currentStatus = follow.CustomerDealsatuts?.trim();
      if (currentStatus) {
        stats.followupsByStatus[currentStatus] = (stats.followupsByStatus[currentStatus] || 0) + 1;
      }
      
      if (!stats.customerHistory[client._id]) {
        stats.customerHistory[client._id] = {
          lastStatus: null,
          lastDate: null
        };
      }
      
      const history = stats.customerHistory[client._id];
      
      // ✅ التصحيح هنا: تحديد المتابعة الناجحة فقط
      let isSuccessful = false;
      
      if (history.lastStatus && currentStatus) {
        const oldScore = STATUS_SCORE[history.lastStatus] || 0;
        const newScore = STATUS_SCORE[currentStatus] || 0;
        
        if (newScore > oldScore) {
          stats.statusImprovements++;
          isSuccessful = true;  // ✅ تحسن = نجاح
        } else if (newScore < oldScore) {
          stats.statusDegradations++;
          isSuccessful = false; // ❌ تدهور = فشل
        } else {
          stats.statusMaintained++;
          isSuccessful = false; // ❌ ثبات = فشل (مش نجاح)
        }
      }
      
      if (currentStatus === 'اشترى') {
        stats.customersConverted.add(client._id.toString());
        isSuccessful = true;  // ✅ تحويل = نجاح
      }
      
      // ✅ تحديث الإحصائيات بناءً على النجاح/الفشل
      if (isSuccessful) {
        stats.successfulInteractions++;
      } else {
        stats.failedInteractions++;
      }
      
      if (history.lastDate) {
        const responseTime = new Date(follow.createdAt || follow.detailsDate) - new Date(history.lastDate);
        if (responseTime > 0) {
          stats.totalResponseTime += responseTime;
          stats.responseCount++;
        }
      }
      
      history.lastStatus = currentStatus;
      history.lastDate = new Date(follow.createdAt || follow.detailsDate);
    });
  });

  const result = await Promise.all(
    Object.values(employeeStats).map(async (stats) => {
      const employee = await userSchema.findById(stats.userId);
      const employeeName = employee?.fullName || employee?.name || `موظف ${stats.userId}`;
      
      const totalEvaluated = stats.successfulInteractions + stats.failedInteractions;
      const successRate = totalEvaluated > 0 
        ? (stats.successfulInteractions / totalEvaluated) * 100 
        : 0;
      
      const avgResponseHours = stats.responseCount > 0 
        ? Number((stats.totalResponseTime / stats.responseCount / (1000 * 60 * 60)).toFixed(1))
        : 0;
      
      const performanceScore = calculateEmployeeScore(stats);
      
      return {
        employeeId: stats.userId,
        employeeName,
        
        totalFollowups: stats.totalFollowups,
        uniqueCustomers: stats.customersFollowed.size,
        customersConverted: stats.customersConverted.size,
        
        statusImprovements: stats.statusImprovements,
        statusDegradations: stats.statusDegradations,
        statusMaintained: stats.statusMaintained || 0,
        
        successfulInteractions: stats.successfulInteractions,
        failedInteractions: stats.failedInteractions,
        successRate: Number(successRate.toFixed(1)),
        
        averageResponseHours: avgResponseHours,
        performanceScore,
        performanceLevel: getEmployeePerformanceLevel(performanceScore),
        
        followupsByStatus: stats.followupsByStatus
      };
    })
  );
  
  return result.sort((a, b) => b.performanceScore - a.performanceScore);
}

function calculateEmployeeScore(stats) {
  let score = 0;
  
  score += stats.customersConverted.size * 50;
  score += stats.statusImprovements * 20;
  score -= stats.statusDegradations * 15;
  score += stats.successfulInteractions * 10;
  score -= stats.failedInteractions * 2;
  score += stats.customersFollowed.size * 5;
  
  if (stats.responseCount > 0) {
    const avgHours = stats.totalResponseTime / stats.responseCount / (1000 * 60 * 60);
    if (avgHours < 24) score += 30;
    else if (avgHours < 48) score += 20;
    else if (avgHours < 72) score += 10;
  }
  
  return Math.max(0, Math.round(score));
}

function getEmployeePerformanceLevel(score) {
  if (score >= 200) return 'ممتاز';
  if (score >= 150) return 'جيد جداً';
  if (score >= 100) return 'جيد';
  if (score >= 50) return 'متوسط';
  return 'بحاجة تحسين';
}

// =============== 3. تحليل العملاء المستحقين للمتابعة - كما هي ===============
async function analyzeCustomersNeedingFollowup(clients) {
  const needingFollowup = [];
  const now = new Date();
  
  clients.forEach(client => {
    if (!client.SectionFollow?.length) {
      needingFollowup.push({
        customerId: client._id,
        customerName: client.fullName || `عميل ${client._id.toString().slice(-4)}`,
        currentStatus: 'لم يتم التواصل',
        lastFollowupDate: null,
        daysSinceLastFollowup: null,
        priority: 'urgent',
        reason: 'لم يتم التواصل مع العميل بعد',
        suggestedAction: 'بدء التواصل الفوري',
        totalFollowups: 0,
        lastFollowupNote: 'لا توجد متابعات سابقة'
      });
      return;
    }
    
    const lastFollow = [...client.SectionFollow].sort((a, b) => 
      new Date(b.createdAt || b.detailsDate) - new Date(a.createdAt || a.detailsDate)
    )[0];
    
    const lastFollowDate = new Date(lastFollow.createdAt || lastFollow.detailsDate);
    const daysSinceLastFollow = Math.round((now - lastFollowDate) / (1000 * 60 * 60 * 24));
    
    let priority = 'normal';
    let reason = '';
    let suggestedAction = '';
    
    if (daysSinceLastFollow >= 14) {
      priority = 'urgent';
      reason = 'لم يتم المتابعة منذ أكثر من أسبوعين';
      suggestedAction = 'اتصال عاجل لتجديد الاهتمام';
    } else if (daysSinceLastFollow >= 7) {
      priority = 'high';
      reason = 'لم يتم المتابعة منذ أسبوع';
      suggestedAction = 'متابعة لتذكير العميل';
    } else if (daysSinceLastFollow >= 3) {
      priority = 'medium';
      reason = 'لم يتم المتابعة منذ ٣ أيام';
      suggestedAction = 'متابعة دورية';
    }
    
    const highValueStatuses = ['محتمل', 'قيد التفاوض (على السعر / الشروط)', 'VIP', 'VIP+'];
    if (highValueStatuses.includes(lastFollow.CustomerDealsatuts) && daysSinceLastFollow >= 2) {
      priority = priority === 'urgent' ? 'urgent' : 'high';
      reason = `عميل ${lastFollow.CustomerDealsatuts} - متابعة سريعة مطلوبة`;
      suggestedAction = 'اتصال فوري لاستغلال الفرصة';
    }
    
    if (priority !== 'normal') {
      needingFollowup.push({
        customerId: client._id,
        customerName: client.fullName || `عميل ${client._id.toString().slice(-4)}`,
        currentStatus: lastFollow.CustomerDealsatuts,
        lastFollowupDate: lastFollowDate,
        daysSinceLastFollow,
        priority,
        reason,
        suggestedAction,
        totalFollowups: client.SectionFollow?.length || 0,
        lastFollowupNote: lastFollow.details || 'لا توجد ملاحظات'
      });
    }
  });
  
  const priorityOrder = { urgent: 0, high: 1, medium: 2 };
  return needingFollowup.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

// =============== 4. مسارات النجاح - كما هي ===============
async function analyzeSuccessPaths(clients) {
  const successPaths = [];
  const pathStats = {};
  
  clients.forEach(client => {
    if (!client.SectionFollow?.length) return;
    
    const follows = [...client.SectionFollow]
      .filter(f => f.CustomerDealsatuts)
      .sort((a, b) => new Date(a.createdAt || a.detailsDate) - new Date(b.createdAt || b.detailsDate));
    
    const hasPurchased = follows.some(f => f.CustomerDealsatuts === 'اشترى');
    
    if (hasPurchased) {
      const path = follows.map(f => f.CustomerDealsatuts);
      const uniquePath = [...new Set(path)];
      const key = uniquePath.join(' → ');
      
      if (!pathStats[key]) {
        pathStats[key] = {
          path: uniquePath,
          count: 0,
          totalFollowups: 0,
          totalDays: 0,
          customers: []
        };
      }
      
      const firstDate = new Date(follows[0].createdAt || follows[0].detailsDate);
      const purchaseFollow = follows.find(f => f.CustomerDealsatuts === 'اشترى');
      const purchaseDate = new Date(purchaseFollow.createdAt || purchaseFollow.detailsDate);
      const daysToConvert = Math.round((purchaseDate - firstDate) / (1000 * 60 * 60 * 24));
      
      pathStats[key].count++;
      pathStats[key].totalFollowups += follows.length;
      pathStats[key].totalDays += daysToConvert;
      pathStats[key].customers.push({
        id: client._id,
        name: client.fullName,
        daysToConvert,
        followupsCount: follows.length
      });
    }
  });
  
  Object.entries(pathStats).forEach(([key, stats]) => {
    successPaths.push({
      path: stats.path,
      pathString: key,
      customersCount: stats.count,
      avgFollowups: Number((stats.totalFollowups / stats.count).toFixed(1)),
      avgDaysToConvert: Number((stats.totalDays / stats.count).toFixed(1)),
      successRate: clients.length > 0 ? Number(((stats.count / clients.length) * 100).toFixed(1)) : 0
    });
  });
  
  return successPaths.sort((a, b) => b.customersCount - a.customersCount);
}

// =============== 5. توصيات - كما هي ===============
async function generateRecommendations(clients, employeePerformance) {
  const recommendations = [];
  
  const lowPerformers = employeePerformance.filter(emp => emp.performanceLevel === 'بحاجة تحسين');
  if (lowPerformers.length > 0) {
    recommendations.push({
      type: 'employee_training',
      priority: 'high',
      title: 'برنامج تدريبي للموظفين',
      description: `${lowPerformers.length} موظفين بحاجة لتحسين أدائهم`,
      details: lowPerformers.map(emp => `${emp.employeeName}: ${emp.successRate}% نجاح, ${emp.statusDegradations} تدهورات`),
      actionItems: [
        'تدريب على مهارات تحسين حالة العميل',
        'توفير سكريبتات محادثة موحدة',
        'تحديد مرشد (mentor) لكل موظف'
      ]
    });
  }
  
  const stuckCustomers = clients.filter(c => {
    if (!c.SectionFollow?.length) return false;
    const lastFollow = [...c.SectionFollow].sort((a, b) => 
      new Date(b.createdAt || b.detailsDate) - new Date(a.createdAt || a.detailsDate)
    )[0];
    return lastFollow.CustomerDealsatuts === 'محتمل' && 
           c.SectionFollow.length > 5 &&
           !c.SectionFollow.some(f => f.CustomerDealsatuts === 'اشترى');
  });
  
  if (stuckCustomers.length > 0) {
    recommendations.push({
      type: 'stuck_customers',
      priority: 'high',
      title: 'عملاء عالقين في مرحلة محتمل',
      description: `${stuckCustomers.length} عميل لم يتحولوا للشراء رغم 5+ متابعات`,
      actionItems: [
        'عرض خاص أو خصم لهؤلاء العملاء',
        'تحويلهم لمدير مبيعات أقدم',
        'تغيير نهج التواصل'
      ]
    });
  }
  
  return recommendations;
}

// =============== 6. تحليل تنبؤي - كما هي ===============
async function predictConversions(clients) {
  const predictions = [];
  
  clients.forEach(client => {
    if (client.SectionFollow?.some(f => f.CustomerDealsatuts === 'اشترى')) return;
    
    const lastFollow = client.SectionFollow?.length 
      ? [...client.SectionFollow].sort((a, b) => 
          new Date(b.createdAt || b.detailsDate) - new Date(a.createdAt || a.detailsDate)
        )[0]
      : null;
    
    const currentStatus = lastFollow?.CustomerDealsatuts || client.CustomerDealsatuts || 'لم يتم التواصل';
    
    let conversionProbability = 0;
    let factors = [];
    
    switch (currentStatus) {
      case 'VIP+':
        conversionProbability += 40;
        factors.push('عميل VIP+');
        break;
      case 'VIP':
        conversionProbability += 35;
        factors.push('عميل VIP');
        break;
      case 'قيد التفاوض (على السعر / الشروط)':
        conversionProbability += 30;
        factors.push('في مرحلة التفاوض');
        break;
      case 'محتمل':
        conversionProbability += 20;
        factors.push('عميل محتمل');
        break;
      case 'تم التواصل':
        conversionProbability += 10;
        factors.push('تم التواصل مؤخراً');
        break;
    }
    
    const followupsCount = client.SectionFollow?.length || 0;
    if (followupsCount >= 3 && followupsCount <= 6) {
      conversionProbability += 15;
      factors.push('عدد متابعات مناسب');
    }
    
    if (lastFollow) {
      const daysSinceLastFollow = Math.round((new Date() - new Date(lastFollow.createdAt || lastFollow.detailsDate)) / (1000 * 60 * 60 * 24));
      if (daysSinceLastFollow <= 2) {
        conversionProbability += 15;
        factors.push('متابعة حديثة');
      }
    }
    
    if (client.CustomerType === 'company') {
      conversionProbability += 10;
      factors.push('عميل شركة');
    }
    
    predictions.push({
      customerId: client._id,
      customerName: client.fullName || `عميل ${client._id.toString().slice(-4)}`,
      currentStatus,
      conversionProbability: Math.min(Math.max(conversionProbability, 5), 95),
      factors: factors.slice(0, 3),
      recommendedAction: conversionProbability > 50 ? 'اتصال فوري' : 'متابعة خلال ٣ أيام',
      priority: conversionProbability > 50 ? 'high' : 'medium'
    });
  });
  
  return predictions
    .sort((a, b) => b.conversionProbability - a.conversionProbability)
    .slice(0, 20);
}

// =============== 7. إحصائيات متقدمة - كما هي ===============
async function calculateAdvancedStats(clients, employeePerformance) {
  const totalCustomers = clients.length;
  const totalFollowups = clients.reduce((sum, c) => sum + (c.SectionFollow?.length || 0), 0);
  
  const convertedCustomers = new Set(
    clients
      .filter(c => c.SectionFollow?.some(f => f.CustomerDealsatuts === 'اشترى'))
      .map(c => c._id.toString())
  ).size;
  
  let totalDaysToConversion = 0;
  let conversionCount = 0;
  
  clients.forEach(client => {
    if (!client.SectionFollow?.length) return;
    
    const follows = [...client.SectionFollow]
      .filter(f => f.CustomerDealsatuts)
      .sort((a, b) => new Date(a.createdAt || a.detailsDate) - new Date(b.createdAt || b.detailsDate));
    
    const purchaseFollow = follows.find(f => f.CustomerDealsatuts === 'اشترى');
    if (purchaseFollow && follows.length > 0) {
      const firstFollowDate = new Date(follows[0].createdAt || follows[0].detailsDate);
      const purchaseDate = new Date(purchaseFollow.createdAt || purchaseFollow.detailsDate);
      
      if (!isNaN(firstFollowDate.getTime()) && !isNaN(purchaseDate.getTime())) {
        const days = Math.round((purchaseDate - firstFollowDate) / (1000 * 60 * 60 * 24));
        if (days >= 0) {
          totalDaysToConversion += days;
          conversionCount++;
        }
      }
    }
  });
  
  const statusDistribution = {};
  clients.forEach(client => {
    if (client.SectionFollow?.length) {
      const lastFollow = [...client.SectionFollow].sort((a, b) => 
        new Date(b.createdAt || b.detailsDate) - new Date(a.createdAt || a.detailsDate)
      )[0];
      
      const status = lastFollow.CustomerDealsatuts;
      if (status) {
        statusDistribution[status] = (statusDistribution[status] || 0) + 1;
      }
    } else {
      statusDistribution['لم يتم التواصل'] = (statusDistribution['لم يتم التواصل'] || 0) + 1;
    }
  });
  
  const weeklyActiveCustomers = clients.filter(c => {
    if (!c.SectionFollow?.length) return false;
    const lastFollow = [...c.SectionFollow].sort((a, b) => 
      new Date(b.createdAt || b.detailsDate) - new Date(a.createdAt || a.detailsDate)
    )[0];
    const daysSince = Math.round((new Date() - new Date(lastFollow.createdAt || lastFollow.detailsDate)) / (1000 * 60 * 60 * 24));
    return daysSince <= 7;
  }).length;
  
  return {
    totalCustomers,
    totalFollowups,
    averageFollowupsPerCustomer: totalCustomers > 0 ? Number((totalFollowups / totalCustomers).toFixed(1)) : 0,
    convertedCustomers,
    conversionRate_total: totalCustomers > 0 ? Number(((convertedCustomers / totalCustomers) * 100).toFixed(1)) : 0,
    averageDaysToConversion: conversionCount > 0 ? Number((totalDaysToConversion / conversionCount).toFixed(1)) : 0,
    conversionCount,
    topPerformer: employeePerformance[0]?.employeeName || 'لا يوجد',
    statusDistribution,
    kpis: {
      weeklyActiveCustomers,
      urgentFollowupsNeeded: clients.filter(c => {
        if (!c.SectionFollow?.length) return true;
        const lastFollow = [...c.SectionFollow].sort((a, b) => 
          new Date(b.createdAt || b.detailsDate) - new Date(a.createdAt || a.detailsDate)
        )[0];
        const daysSince = Math.round((new Date() - new Date(lastFollow.createdAt || lastFollow.detailsDate)) / (1000 * 60 * 60 * 24));
        return daysSince >= 14;
      }).length
    }
  };
}

// =============== ✅ دالة جديدة 1: تصنيف متابعات الموظفين ===============
async function getEmployeeFollowupClassification(clients) {
  const employeeStats = {};
  
  const statusOrder = [
    "عدم الاتصال",
    "تم التواصل",
    "غير محتمل",
    "محتمل",
    "قيد التفاوض (على السعر / الشروط)",
    "VIP",
    "VIP+",
    "اشترى"
  ];

  clients.forEach(client => {
    if (!client.SectionFollow?.length) return;
    
    client.SectionFollow.forEach((follow, index, arr) => {
      const userId = follow.user;
      if (!userId) return;
      
      const userIdStr = userId.toString();
      
      if (!employeeStats[userIdStr]) {
        employeeStats[userIdStr] = {
          employeeId: userId,
          employeeName: '',
          totalFollowups: 0,
          followupsByStatus: {},
          improvements: 0,
          degradations: 0,
          maintained: 0,
          conversions: 0,
          uniqueCustomers: new Set()
        };
      }
      
      const stats = employeeStats[userIdStr];
      stats.totalFollowups++;
      stats.uniqueCustomers.add(client._id.toString());
      
      const status = follow.CustomerDealsatuts;
      if (status) {
        stats.followupsByStatus[status] = (stats.followupsByStatus[status] || 0) + 1;
      }
      
      if (status === 'اشترى') {
        stats.conversions++;
      }
      
      if (index > 0) {
        const prevFollow = arr[index - 1];
        const prevStatus = prevFollow.CustomerDealsatuts;
        
        if (prevStatus && status) {
          const prevScore = STATUS_SCORE[prevStatus] || 0;
          const currentScore = STATUS_SCORE[status] || 0;
          
          if (currentScore > prevScore) {
            stats.improvements++;
          } else if (currentScore < prevScore) {
            stats.degradations++;
          } else {
            stats.maintained++;
          }
        }
      }
    });
  });

  const result = await Promise.all(
    Object.values(employeeStats).map(async (stats) => {
      const employee = await userSchema.findById(stats.employeeId);
      stats.employeeName = employee?.fullName || employee?.name || `موظف ${stats.employeeId}`;
      
      const sortedFollowups = {};
      statusOrder.forEach(status => {
        if (stats.followupsByStatus[status]) {
          sortedFollowups[status] = stats.followupsByStatus[status];
        }
      });
      
      return {
        employeeId: stats.employeeId,
        employeeName: stats.employeeName,
        totalFollowups: stats.totalFollowups,
        uniqueCustomers: stats.uniqueCustomers.size,
        followupsByStatus: sortedFollowups,
        improvements: stats.improvements,
        degradations: stats.degradations,
        maintained: stats.maintained,
        conversions: stats.conversions,
        improvementRate: stats.totalFollowups > 0 ? Number(((stats.improvements / stats.totalFollowups) * 100).toFixed(1)) : 0,
        degradationRate: stats.totalFollowups > 0 ? Number(((stats.degradations / stats.totalFollowups) * 100).toFixed(1)) : 0
      };
    })
  );
  
  return result.sort((a, b) => b.totalFollowups - a.totalFollowups);
}

// =============== ✅ دالة جديدة 2: تفاصيل متابعات الموظف مع اسم العميل ===============
async function getEmployeeFollowupDetails(clients) {
  const employeeFollowups = {};

  clients.forEach(client => {
    if (!client.SectionFollow?.length) return;
    
    client.SectionFollow.forEach((follow, index, arr) => {
      const userId = follow.user;
      if (!userId) return;
      
      const userIdStr = userId.toString();
      
      if (!employeeFollowups[userIdStr]) {
        employeeFollowups[userIdStr] = [];
      }
      
      let statusChange = null;
      if (index > 0) {
        const prevFollow = arr[index - 1];
        const prevStatus = prevFollow.CustomerDealsatuts;
        const currentStatus = follow.CustomerDealsatuts;
        
        if (prevStatus && currentStatus) {
          const prevScore = STATUS_SCORE[prevStatus] || 0;
          const currentScore = STATUS_SCORE[currentStatus] || 0;
          
          if (currentScore > prevScore) statusChange = 'improvement';
          else if (currentScore < prevScore) statusChange = 'degradation';
          else statusChange = 'maintained';
        }
      }
      
      employeeFollowups[userIdStr].push({
        followId: follow._id,
        customerId: client._id,
        customerName: client.fullName || `عميل ${client._id.toString().slice(-4)}`,
        customerPhone: client.phone || 'لا يوجد',
        date: follow.createdAt || follow.detailsDate,
        status: follow.CustomerDealsatuts,
        details: follow.details || '',
        followType: index === 0 ? 'first' : 'followup',
        statusChange,
        previousStatus: index > 0 ? arr[index - 1].CustomerDealsatuts : null,
        isConverted: follow.CustomerDealsatuts === 'اشترى',
        totalPrice: follow.totalPrice || 0
      });
    });
  });

  const result = await Promise.all(
    Object.entries(employeeFollowups).map(async ([userId, followups]) => {
      const employee = await userSchema.findById(parseInt(userId));
      const employeeName = employee?.fullName || employee?.name || `موظف ${userId}`;
      
      return {
        employeeId: parseInt(userId),
        employeeName,
        totalFollowups: followups.length,
        followups: followups.sort((a, b) => new Date(b.date) - new Date(a.date))
      };
    })
  );
  
  return result.sort((a, b) => b.totalFollowups - a.totalFollowups);
}

module.exports = CustomerSectionFlowTiemLine;